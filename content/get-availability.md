---
title: Поиск по расписаниям и получение данных о наличии мест
aliases:
    - /availability
    - /schedules
---

{{< toc >}}

## Обязательные элементы

{{< hint warning >}}
Для поиска по расписанию и получения данных о наличии мест в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для получения информации о наличии мест и расписании выполнения рейсов между парами городов, а также для получения информации о наличии мест для указанных рейсов используется сервис [AirSchedulesAndAvailabilityRQ](https://developer.sabre.com/docs/soap_apis/air/search/air_schedules_availability).

Сервис может работать в двух режимах: получение информации о наличии мест и расписании рейсов для конкретной даты отправления или прибытия (элемент ```/AirSchedulesAndAvailabilityRQ/OriginDestination```) или получение информации о наличии мест и расписании рейсов для последовательности дат (элемент ```/AirSchedulesAndAvailabilityRQ/Calendar```). Большинство дополнительных параметров, указанных ниже, работают в обоих режимах (если не указано иное). Ниже представлены рекомендации только для режима поиска по конкретным датам, для режима поиска по последовательности дат необходимо заменить элемент ```/AirSchedulesAndAvailabilityRQ/OriginDestination``` на ```/AirSchedulesAndAvailabilityRQ/Calendar```.

### Конкретные даты

Сервис позволяет запросить информацию о наличии мест и расписание рейсов для максимум 40 комбинаций направлений и дат отправления или прибытия. Для каждой комбинации необходимо указать:
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@origin``` — код аэропорта или города отправления
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@destination``` — код аэропорта или города прибытия
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@date``` — дата отправления или прибытия (по умолчанию дата отправления, если не указано значение ```true``` у атрибута ```/@isArrival```)
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@identifier``` — уникальный идентификатор комбинации направления и даты отправления или прибытия

{{< details title="Пример запроса (простой запрос, конкретные даты)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (несколько направлений, конкретные даты)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD"/>
  <OriginDestination date="2022-12-01" destination="PAR" identifier="2" origin="SYD"/>
  <OriginDestination date="2022-12-01" destination="LON" identifier="3" origin="SYD"/>
  <OriginDestination date="2022-12-02" destination="PAR" identifier="4" origin="SYD"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="2">
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-01T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="MH 4601QF 8075" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-01T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="75" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-01T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionApplication="B" trafficRestrictionCode="Y">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:40" effectiveDate="2022-10-31" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-01T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8075" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-01T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="MH 4601QF 8075" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-01T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="75" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:35">
      <ns2:Segment destinationDateTime="2022-12-01T21:30:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5916IB 7307" discontinueDate="2023-03-24" duration="08:00" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:05:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-01T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 4221KL 2139" discontinueDate="2022-12-01" duration="14:00" effectiveDate="2022-12-01" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="6666" destination="CDG" destinationDateTime="2022-12-02T06:05:00.000" destinationTerminalId="2E" duration="14:00" equipmentType="77W" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="257" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="257"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:00">
      <ns2:Segment destinationDateTime="2022-12-01T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LX 9500LH 7000QR 5800AY 5840" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-11-11" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-01T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" mealService="DLDLDLDLDLLRLRLRLRLRLRLRLRLRLRLRLRLRLR" origin="SYD" originDateTime="2022-12-01T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:45:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-01T23:30:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2157QF 4223" discontinueDate="2023-03-22" duration="13:15" effectiveDate="2022-10-31" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="5970" destination="CDG" destinationDateTime="2022-12-02T05:45:00.000" destinationTerminalId="2E" duration="13:15" equipmentType="789" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="HKG" originDateTime="2022-12-01T23:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="185" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="185"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:00">
      <ns2:Segment destinationDateTime="2022-12-01T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I R Y B H K M L V S N Q O W</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-01T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" origin="SYD" originDateTime="2022-12-01T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="5800" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:45:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-01T23:30:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2157QF 4223" discontinueDate="2023-03-22" duration="13:15" effectiveDate="2022-10-31" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="5970" destination="CDG" destinationDateTime="2022-12-02T05:45:00.000" destinationTerminalId="2E" duration="13:15" equipmentType="789" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="HKG" originDateTime="2022-12-01T23:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="185" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="185"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:55">
      <ns2:Segment destinationDateTime="2022-12-01T21:20:00.000+08:00" destinationTerminalId="0" eTicket="true" originDateTime="2022-12-01T16:10:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="Q">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="08:10" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:20:00.000" destinationTerminalId="0" duration="08:10" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="7234" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="222"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:05:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-01T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 4221KL 2139" discontinueDate="2022-12-01" duration="14:00" effectiveDate="2022-12-01" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="6666" destination="CDG" destinationDateTime="2022-12-02T06:05:00.000" destinationTerminalId="2E" duration="14:00" equipmentType="77W" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="257" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="257"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:55">
      <ns2:Segment destinationDateTime="2022-12-01T21:20:00.000+08:00" destinationTerminalId="0" eTicket="true" originDateTime="2022-12-01T16:10:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="A3 1212ET 1316LH 9781LX 9029SK 8010TK 9321UK 8222AF 7234" discontinueDate="2023-03-23" duration="08:10" effectiveDate="2022-11-03" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>F A Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:20:00.000" destinationTerminalId="0" duration="08:10" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="222" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="222"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:05:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-01T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 4221KL 2139" discontinueDate="2022-12-01" duration="14:00" effectiveDate="2022-12-01" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="6666" destination="CDG" destinationDateTime="2022-12-02T06:05:00.000" destinationTerminalId="2E" duration="14:00" equipmentType="77W" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="257" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="257"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="3">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2022-12-02" identifier="4">
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-02T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="MH 4601QF 8075" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-02T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="75" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-02T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionApplication="B" trafficRestrictionCode="Y">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:40" effectiveDate="2022-10-31" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-02T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8075" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:30">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T19:30:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-02T14:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="MH 4601QF 8075" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3259" destination="CDG" destinationDateTime="2022-12-02T19:30:00.000" destinationTerminalId="2C" duration="07:40" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="75" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="75"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:35">
      <ns2:Segment destinationDateTime="2022-12-02T21:30:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-02T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5916IB 7307" discontinueDate="2023-03-24" duration="08:00" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="3"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-02T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-03T06:05:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-02T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2139" discontinueDate="2022-12-02" duration="14:00" effectiveDate="2022-12-02" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="6666" destination="CDG" destinationDateTime="2022-12-03T06:05:00.000" destinationTerminalId="2E" duration="14:00" equipmentType="77W" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="SIN" originDateTime="2022-12-02T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="257" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="257"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:00">
      <ns2:Segment destinationDateTime="2022-12-02T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-02T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LX 9500LH 7000QR 5800AY 5840" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-11-11" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-02T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" mealService="DLDLDLDLDLLRLRLRLRLRLRLRLRLRLRLRLRLRLR" origin="SYD" originDateTime="2022-12-02T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-03T05:45:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-02T23:30:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2157QF 4223" discontinueDate="2023-03-22" duration="13:15" effectiveDate="2022-10-31" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="5970" destination="CDG" destinationDateTime="2022-12-03T05:45:00.000" destinationTerminalId="2E" duration="13:15" equipmentType="789" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="HKG" originDateTime="2022-12-02T23:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="185" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="185"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:00">
      <ns2:Segment destinationDateTime="2022-12-02T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-02T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I R Y B H K M L V S N Q O W</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-02T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" origin="SYD" originDateTime="2022-12-02T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="5800" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-03T05:45:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-02T23:30:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2157QF 4223" discontinueDate="2023-03-22" duration="13:15" effectiveDate="2022-10-31" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="5970" destination="CDG" destinationDateTime="2022-12-03T05:45:00.000" destinationTerminalId="2E" duration="13:15" equipmentType="789" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="HKG" originDateTime="2022-12-02T23:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="185" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="185"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:55">
      <ns2:Segment destinationDateTime="2022-12-02T21:20:00.000+08:00" destinationTerminalId="0" eTicket="true" originDateTime="2022-12-02T16:10:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="A3 1212ET 1316LH 9781LX 9029SK 8010TK 9321UK 8222AF 7234" discontinueDate="2023-03-24" duration="08:10" effectiveDate="2022-11-03" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="true" thu="false" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-02T21:20:00.000" destinationTerminalId="0" duration="08:10" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T16:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="222" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="222"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-03T06:05:00.000+01:00" destinationTerminalId="2E" eTicket="true" originDateTime="2022-12-02T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 2139" discontinueDate="2022-12-02" duration="14:00" effectiveDate="2022-12-02" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="6666" destination="CDG" destinationDateTime="2022-12-03T06:05:00.000" destinationTerminalId="2E" duration="14:00" equipmentType="77W" mealService="BMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBMBM" origin="SIN" originDateTime="2022-12-02T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="257" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="257"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:30">
      <ns2:Segment destinationDateTime="2022-12-02T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-02T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LX 9500LH 7000QR 5800AY 5840" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-11-11" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-02T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" mealService="DLDLDLDLDLLRLRLRLRLRLRLRLRLRLRLRLRLRLR" origin="SYD" originDateTime="2022-12-02T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-03T06:15:00.000+01:00" destinationTerminalId="2C" eTicket="true" originDateTime="2022-12-03T00:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="13:10" effectiveDate="2022-10-31" groundTime="02:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="5970" destination="CDG" destinationDateTime="2022-12-03T06:15:00.000" destinationTerminalId="2C" duration="13:10" equipmentType="77W" mealService="BDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBD" origin="HKG" originDateTime="2022-12-03T00:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="261" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="261"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

### Последовательность дат

Сервис позволяет запросить информацию о наличии мест и расписание рейсов для одного маршрута для максимум 40 дней подряд. В запросе необходимо указать:
- ```/AirSchedulesAndAvailabilityRQ/Calendar/@origin``` — код аэропорта или города отправления
- ```/AirSchedulesAndAvailabilityRQ/Calendar/@destination``` — код аэропорта или города прибытия
- ```/AirSchedulesAndAvailabilityRQ/Calendar/@startDate``` — дата отправления или прибытия (по умолчанию дата отправления, если не указано значение ```true``` у атрибута ```/@isArrival```)
- ```/AirSchedulesAndAvailabilityRQ/Calendar/@days``` — количество дней (не более 40)

{{< details title="Пример запроса (простой запрос, последовательность дат)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <Calendar days="2" destination="LON" origin="SYD" startDate="2022-12-01"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2022-12-02" identifier="2">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-03T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-02T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-02T21:30:00.000" country="SG" departureDateTime="2022-12-02T23:05:00.000" destinationDateTime="2022-12-02T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-02T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-02T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-03T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-02T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-03T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-02T22:10:00.000" country="SG" departureDateTime="2022-12-02T23:55:00.000" destinationDateTime="2022-12-02T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-02T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-02T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-02T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-03T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-02T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-02T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-02T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-02T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-02T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-02T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-02T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

## Перевозчики

В запросе можно передать черный (ответ будет содержать рейсы любых перевозчиков, кроме перечисленных в списке) или белый (ответ будет содержать рейсы только тех перевозчиков, которые перечислены в списке) список перевозчиков:
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Carriers/@inclusion``` — тип списка:
    - ```all``` — белый список
    - ```none``` — черный список
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Carriers/Carrier/@type``` — тип перевозчика:
    - ```MARKETING``` — маркетинговый перевозчик
    - ```OPERATING``` — оперирующий перевозчик
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Carriers/Carrier``` — двухбуквенный IATA код перевозчика

Для того чтобы не получать информацию наличии мест для интерлайн перелетов (перелеты, содержащие несколько маркетинговых перевозчиков), необходимо указать значение ```true``` у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Carriers/@onlineOnly```.

{{< details title="Пример запроса (белый список маркетинговых перевозчиков)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Carriers inclusion="all">
        <Carrier type="MARKETING">QF</Carrier>
        <Carrier type="MARKETING">BA</Carrier>
      </Carriers>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T22:10:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391FJ 5320PG 4536KL 4881JQ 6001MU 4173" discontinueDate="2023-03-24" duration="08:05" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:25:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T23:15:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7305AA 6836" discontinueDate="2022-12-24" duration="14:10" effectiveDate="2022-11-07" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:25:00.000" destinationTerminalId="5" duration="14:10" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:15:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="12" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="12"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:45">
      <ns2:Segment destinationDateTime="2022-12-01T21:30:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5916IB 7307" discontinueDate="2023-03-24" duration="08:00" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T23:55:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-24" duration="14:20" effectiveDate="2022-10-30" groundTime="02:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="27:45">
      <ns2:Segment destinationDateTime="2022-12-01T17:50:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T12:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 9670AY 5012EK 5061FJ 5322PG 4534UL 3371KL 4891JQ 6081LA 8333MU 4172BA 7495" discontinueDate="2022-12-13" duration="08:20" effectiveDate="2022-11-05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T17:50:00.000" destinationTerminalId="1" duration="08:20" equipmentType="332" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T12:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="81" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="81"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307AA 6874" discontinueDate="2023-03-24" duration="14:10" effectiveDate="2022-10-30" groundTime="05:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="30:55">
      <ns2:Segment destinationDateTime="2022-12-01T14:35:00.000+02:00" destinationTerminalId="B" eTicket="true" originDateTime="2022-12-01T09:35:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LY 8782" discontinueDate="2023-01-28" duration="14:00" effectiveDate="2022-11-05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JNB" country="ZA" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="6862" destination="JNB" destinationDateTime="2022-12-01T14:35:00.000" destinationTerminalId="B" duration="14:00" equipmentType="789" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T09:35:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="63" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="63"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:30:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T20:15:00.000+02:00" originTerminalId="A" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7318AA 6446" discontinueDate="2023-01-04" duration="11:15" effectiveDate="2022-11-10" groundTime="05:40" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="5620" destination="LHR" destinationDateTime="2022-12-02T05:30:00.000" destinationTerminalId="5" duration="11:15" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="JNB" originDateTime="2022-12-01T20:15:00.000" originTerminalId="A" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="56" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="56"/>
        <ns2:Origin code="JNB" country="ZA" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="26:55">
      <ns2:Segment destinationDateTime="2022-12-01T16:00:00.000-06:00" destinationTerminalId="D" eTicket="true" originDateTime="2022-12-01T17:55:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 7261" discontinueDate="2023-01-27" duration="15:05" effectiveDate="2022-11-09" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DFW" country="US" state="TX" timezoneOffset="-06:00"/>
        <ns2:Leg airMiles="8578" destination="DFW" destinationDateTime="2022-12-01T16:00:00.000" destinationTerminalId="D" duration="15:05" equipmentType="789" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="7" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="7"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T09:50:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T18:55:00.000-06:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5492EI 8892IB 7387AA 6949" discontinueDate="2022-12-17" duration="08:55" effectiveDate="2022-11-13" groundTime="02:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="4751" destination="LHR" destinationDateTime="2022-12-02T09:50:00.000" destinationTerminalId="5" duration="08:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DFW" originDateTime="2022-12-01T18:55:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="192" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="192"/>
        <ns2:Origin code="DFW" country="US" state="TX" timezoneOffset="-06:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="28:45">
      <ns2:Segment destinationDateTime="2022-12-01T16:00:00.000-06:00" destinationTerminalId="D" eTicket="true" originDateTime="2022-12-01T17:55:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 7261" discontinueDate="2023-01-27" duration="15:05" effectiveDate="2022-11-09" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DFW" country="US" state="TX" timezoneOffset="-06:00"/>
        <ns2:Leg airMiles="8578" destination="DFW" destinationDateTime="2022-12-01T16:00:00.000" destinationTerminalId="D" duration="15:05" equipmentType="789" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="7" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="7"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T11:40:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T20:35:00.000-06:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-08" duration="09:05" effectiveDate="2022-11-13" groundTime="04:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Disclosure code="AA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="4751" destination="LHR" destinationDateTime="2022-12-02T11:40:00.000" destinationTerminalId="3" duration="09:05" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="DFW" originDateTime="2022-12-01T20:35:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="1505" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AA" flightNumber="50"/>
        <ns2:Origin code="DFW" country="US" state="TX" timezoneOffset="-06:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="27:15">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:30" effectiveDate="2022-12-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T14:00:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-02T10:00:00.000+04:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="EI 8804IB 7344" discontinueDate="2022-12-04" duration="08:00" effectiveDate="2022-11-28" groundTime="04:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T14:00:00.000" destinationTerminalId="5" duration="08:00" equipmentType="777" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T10:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="104" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="104"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="35:15">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-02T02:10:00.000+04:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="EI 8806IB 7346AA 6416" discontinueDate="2022-12-30" duration="08:05" effectiveDate="2022-12-01" groundTime="12:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="5" duration="08:05" equipmentType="788" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-02T02:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="106" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="106"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (черный список оперирующих перевозчиков)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Carriers inclusion="none">
        <Carrier type="OPERATING">QF</Carrier>
        <Carrier type="OPERATING">BA</Carrier>
      </Carriers>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (исключение интерлайн перелетов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Carriers onlineOnly="true"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:00">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T20:00:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T16:05:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8005" discontinueDate="2023-03-25" duration="07:55" effectiveDate="2022-12-01" groundTime="02:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T20:00:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T16:05:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="5"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:00">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T20:00:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T16:05:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="07:55" effectiveDate="2022-10-31" groundTime="02:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T20:00:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T16:05:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="5"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

## Пересадки

Сервис по умолчанию предлагает рейсы для заданного направления как с пересадками, так и без них.

Для того чтобы получить в ответе только рейсы без пересадок, необходимо указать значение ```true``` у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/@directFlightsOnly```.

{{< details title="Пример запроса (без пересадок)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Routing directFlightsOnly="true"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для того чтобы получить в ответе рейсы с заданными пунктами пересадки необходимо указать их в качестве значений элементов ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/ConnectPointPath/ConnectPoint```. При этом ответ будет различаться в зависимости от того указаны ли они внутри одно элемента ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/ConnectPointPath``` или разных:

{{< details title="Пример запроса (одна пересадка в любом из пунктов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Routing>
        <ConnectPointPath>
          <ConnectPoint>AUH</ConnectPoint>
        </ConnectPointPath>
        <ConnectPointPath>
          <ConnectPoint>DOH</ConnectPoint>
        </ConnectPointPath>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="25:05">
      <ns2:Segment destinationDateTime="2022-12-02T05:30:00.000+04:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:55:00.000+11:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="14:35" effectiveDate="2022-11-07" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D R Y H M B K I Q T N L U</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7506" destination="AUH" destinationDateTime="2022-12-02T05:30:00.000" duration="14:35" equipmentType="789" origin="SYD" originDateTime="2022-12-01T21:55:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="WY" flightNumber="5405" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="455"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:00:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:20:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6673AV 2413GA 9126NZ 4299XY 3019" discontinueDate="2023-03-22" duration="07:40" effectiveDate="2022-11-01" groundTime="02:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T12:00:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T08:20:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="19" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="19"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:30">
      <ns2:Segment destinationDateTime="2022-12-02T05:05:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T21:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="GF 5155KL 3939LY 9641ME 6637MS 8087NZ 4255PK 4455UX 2712WY 5405" discontinueDate="2023-03-25" duration="14:35" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7506" destination="AUH" destinationDateTime="2022-12-02T05:05:00.000" destinationTerminalId="3" duration="14:35" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="455" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="455"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:00:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:20:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6673AV 2413GA 9126NZ 4299XY 3019" discontinueDate="2023-03-22" duration="07:40" effectiveDate="2022-11-01" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T12:00:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T08:20:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="19" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="19"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:30">
      <ns2:Segment destinationDateTime="2022-12-02T05:05:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T21:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="Q">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="14:35" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>B C D G H J K L M Q S T V W Y Z</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7506" destination="AUH" destinationDateTime="2022-12-02T05:05:00.000" destinationTerminalId="3" duration="14:35" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="NZ" flightNumber="4255" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="455"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:00:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:20:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="Q">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>B C D G H J K L M Q S T V W Y Z</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T12:00:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T08:20:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="NZ" flightNumber="4299" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="19"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:35">
      <ns2:Segment destinationDateTime="2022-12-02T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6396IB 7951KM 2309WY 6076" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-02T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="909" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:15:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T07:45:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="WB 1097BA 7003" discontinueDate="2022-12-20" duration="07:30" effectiveDate="2022-11-17" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3259" destination="LHR" destinationDateTime="2022-12-02T12:15:00.000" destinationTerminalId="4" duration="07:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-02T07:45:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="3"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:35">
      <ns2:Segment destinationDateTime="2022-12-02T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="O">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-02T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6396" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:15:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T07:45:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-20" duration="07:30" effectiveDate="2022-11-17" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3259" destination="LHR" destinationDateTime="2022-12-02T12:15:00.000" destinationTerminalId="4" duration="07:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-02T07:45:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="7003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="3"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="25:35">
      <ns2:Segment destinationDateTime="2022-12-02T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6396IB 7951KM 2309WY 6076" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-02T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="909" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:15:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T07:45:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-20" duration="07:30" effectiveDate="2022-11-17" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3259" destination="LHR" destinationDateTime="2022-12-02T12:15:00.000" destinationTerminalId="4" duration="07:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-02T07:45:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="7003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="3"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="26:40">
      <ns2:Segment destinationDateTime="2022-12-02T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6396IB 7951KM 2309WY 6076" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-02T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="909" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:50:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="WB 1001BA 7007" discontinueDate="2022-12-17" duration="07:30" effectiveDate="2022-11-17" groundTime="04:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3259" destination="LHR" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="4" duration="07:30" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-02T08:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="7" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="7"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="26:40">
      <ns2:Segment destinationDateTime="2022-12-02T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="O">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-02T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6396" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T13:20:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:50:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-20" duration="07:30" effectiveDate="2022-11-17" groundTime="04:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="8"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3259" destination="LHR" destinationDateTime="2022-12-02T13:20:00.000" destinationTerminalId="4" duration="07:30" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-02T08:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="7007" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="7"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (две пересадки)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Routing>
        <ConnectPointPath>
          <ConnectPoint>SIN</ConnectPoint>
          <ConnectPoint>AUH</ConnectPoint>
        </ConnectPointPath>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="29:15">
      <ns2:Segment destinationDateTime="2022-12-01T17:50:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T12:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 9670AY 5012EK 5061FJ 5322PG 4534UL 3371KL 4891JQ 6081LA 8333MU 4172BA 7495" discontinueDate="2022-12-13" duration="08:20" effectiveDate="2022-11-05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T17:50:00.000" destinationTerminalId="1" duration="08:20" equipmentType="332" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T12:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="81" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="81"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T23:00:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T19:25:00.000+08:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UX 2718XY 3473" discontinueDate="2023-03-25" duration="07:35" effectiveDate="2022-10-30" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="3673" destination="AUH" destinationDateTime="2022-12-01T23:00:00.000" destinationTerminalId="3" duration="07:35" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T19:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="473" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="473"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T02:55:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6671GA 9056NZ 4291XY 3011" discontinueDate="2023-03-24" duration="07:50" effectiveDate="2022-11-01" groundTime="03:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T06:45:00.000" destinationTerminalId="4" duration="07:50" equipmentType="781" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T02:55:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="11" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="11"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="29:15">
      <ns2:Segment destinationDateTime="2022-12-01T17:50:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T12:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-18" duration="08:20" effectiveDate="2022-11-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D Q I Y B M E H K L N R S V Z</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T17:50:00.000" destinationTerminalId="1" duration="08:20" equipmentType="332" mealService="H H H H H H H H H H H H H H H H H" origin="SYD" originDateTime="2022-12-01T12:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="MU" flightNumber="4172" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="81"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T23:00:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T19:25:00.000+08:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UX 2718XY 3473" discontinueDate="2023-03-25" duration="07:35" effectiveDate="2022-10-30" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="3673" destination="AUH" destinationDateTime="2022-12-01T23:00:00.000" destinationTerminalId="3" duration="07:35" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T19:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="473" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="473"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T02:55:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6671GA 9056NZ 4291XY 3011" discontinueDate="2023-03-24" duration="07:50" effectiveDate="2022-11-01" groundTime="03:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T06:45:00.000" destinationTerminalId="4" duration="07:50" equipmentType="781" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T02:55:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="11" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="11"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="29:30">
      <ns2:Segment destinationDateTime="2022-12-01T17:35:00.000+08:00" destinationTerminalId="0" eTicket="true" originDateTime="2022-12-01T12:15:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="TK 9313UK 8232AF 7233" discontinueDate="2023-03-23" duration="08:20" effectiveDate="2022-11-03" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>Z C J U D Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T17:35:00.000" destinationTerminalId="0" duration="08:20" equipmentType="359" mealService="M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T12:15:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="232" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="232"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T23:00:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T19:25:00.000+08:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UX 2718XY 3473" discontinueDate="2023-03-25" duration="07:35" effectiveDate="2022-10-30" groundTime="01:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="3673" destination="AUH" destinationDateTime="2022-12-01T23:00:00.000" destinationTerminalId="3" duration="07:35" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T19:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="473" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="473"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T02:55:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6671GA 9056NZ 4291XY 3011" discontinueDate="2023-03-24" duration="07:50" effectiveDate="2022-11-01" groundTime="03:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T06:45:00.000" destinationTerminalId="4" duration="07:50" equipmentType="781" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T02:55:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="11" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="11"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="32:40">
      <ns2:Segment destinationDateTime="2022-12-01T14:15:00.000+08:00" destinationTerminalId="0" eTicket="true" originDateTime="2022-12-01T09:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="MK 8211TK 9305UK 8212" discontinueDate="2023-03-24" duration="08:10" effectiveDate="2022-11-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>F A Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T14:15:00.000" destinationTerminalId="0" duration="08:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T09:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="212" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="212"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T23:00:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T19:25:00.000+08:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UX 2718XY 3473" discontinueDate="2023-03-25" duration="07:35" effectiveDate="2022-10-30" groundTime="05:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="3673" destination="AUH" destinationDateTime="2022-12-01T23:00:00.000" destinationTerminalId="3" duration="07:35" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T19:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="473" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="473"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T06:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T02:55:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6671GA 9056NZ 4291XY 3011" discontinueDate="2023-03-24" duration="07:50" effectiveDate="2022-11-01" groundTime="03:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="false" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T06:45:00.000" destinationTerminalId="4" duration="07:50" equipmentType="781" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T02:55:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="11" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="11"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для того чтобы не получать рейсы с пересадками в заданных местах необходимо указать в запросе:
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Avoid/@type``` — тип места:
    - ```n``` — страна
    - ```a``` — аэропорт или город
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Avoid/@location``` — код места (страна, аэропорт или город)

{{< details title="Пример запроса (исключение пересадок в городах и странах)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Routing>
        <Avoid location="AUH" type="A"/>
        <Avoid location="DOH" type="A"/>
        <Avoid location="SIN" type="A"/>
        <Avoid location="FR" type="N"/>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

## Рейсы

Для того чтобы получить только рейсы из выбранного диапазона необходимо указать:
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Segment/@segmentNumber``` — номер сегмента начиная с ```1```
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Segment/Carriers/@minFlightNumber``` — минимальный номер рейса в диапазоне
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Segment/Carriers/@maxFlightNumber``` — максимальный номер рейса в диапазоне (для выбора только одного рейса должен совпадать с ```/@minFlightNumber```)
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/Segment/Carriers/MarketingCarrier``` — код маркетингового перевозчика

{{< details title="Пример запроса (выбор диапазона рейсов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="AUH">
    <Options>
      <Routing>
        <Segment segmentNumber="1">
          <Carriers maxFlightNumber="100" minFlightNumber="1">
            <MarketingCarrier>EY</MarketingCarrier>
          </Carriers>
        </Segment>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="07:40">
      <ns2:Segment destinationDateTime="2022-12-01T12:00:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-01T08:20:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6673AV 2413GA 9126NZ 4299XY 3019" discontinueDate="2023-03-22" duration="07:40" effectiveDate="2022-11-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T12:00:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T08:20:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="19" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="19"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="07:50">
      <ns2:Segment destinationDateTime="2022-12-01T06:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-01T02:55:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6671GA 9056NZ 4291XY 3011" discontinueDate="2023-03-24" duration="07:50" effectiveDate="2022-11-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T06:45:00.000" destinationTerminalId="4" duration="07:50" equipmentType="351" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T02:55:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="11" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="11"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="07:40">
      <ns2:Segment destinationDateTime="2022-12-01T14:50:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-01T11:10:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6677AV 2419NZ 4293XY 3025" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T14:50:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T11:10:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="25" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="25"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="09:30">
      <ns2:Segment destinationDateTime="2022-12-01T07:10:00.000+01:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T03:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="GF 5127LX 4201MH 5233PK 4073UL 2373XY 3073" discontinueDate="2023-03-25" duration="06:45" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="ZRH" country="CH" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="2960" destination="ZRH" destinationDateTime="2022-12-01T07:10:00.000" duration="06:45" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T03:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="73" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="73"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T08:55:00.000Z" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T08:15:00.000+01:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-13" duration="01:40" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="LX"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LCY" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="473" destination="LCY" destinationDateTime="2022-12-01T08:55:00.000" duration="01:40" equipmentType="221" mealService="M M M M M G G G G G G G G G G G G" origin="ZRH" originDateTime="2022-12-01T08:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LX" flightNumber="460" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LX" flightNumber="460"/>
        <ns2:Origin code="ZRH" country="CH" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="09:20">
      <ns2:Segment destinationDateTime="2022-12-01T06:15:00.000+01:00" destinationTerminalId="2" eTicket="true" originDateTime="2022-12-01T02:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LH 9661MH 5545UL 2335XY 3005" discontinueDate="2023-03-25" duration="06:30" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MUC" country="DE" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="2836" destination="MUC" destinationDateTime="2022-12-01T06:15:00.000" destinationTerminalId="2" duration="06:30" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T02:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="5"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T08:05:00.000Z" destinationTerminalId="2" eTicket="true" originDateTime="2022-12-01T07:00:00.000+01:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="02:05" effectiveDate="2022-10-30" groundTime="00:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Disclosure code="LH"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="586" destination="LHR" destinationDateTime="2022-12-01T08:05:00.000" destinationTerminalId="2" duration="02:05" equipmentType="32N" mealService="RMRMRMRMRMRGRGRGRGRGRGRGRGRGRGRGRG" origin="MUC" originDateTime="2022-12-01T07:00:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="2470" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="2470"/>
        <ns2:Origin code="MUC" country="DE" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2022-12-01T06:45:00.000+01:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T02:50:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LH 9655MH 5289PK 4001UL 2359UX 2707XY 3001" discontinueDate="2023-03-07" duration="06:55" effectiveDate="2022-11-01" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="FRA" country="DE" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="3012" destination="FRA" destinationDateTime="2022-12-01T06:45:00.000" destinationTerminalId="1" duration="06:55" equipmentType="781" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T02:50:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="1"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T08:45:00.000Z" destinationTerminalId="2" eTicket="true" originDateTime="2022-12-01T08:00:00.000+01:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UA 8818" discontinueDate="2023-03-18" duration="01:45" effectiveDate="2022-11-01" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Disclosure code="LH"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="408" destination="LHR" destinationDateTime="2022-12-01T08:45:00.000" destinationTerminalId="2" duration="01:45" equipmentType="32N" mealService="RMRMRMRMRMRGRGRGRGRGRGRGRGRGRGRGRG" origin="FRA" originDateTime="2022-12-01T08:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="900"/>
        <ns2:Origin code="FRA" country="DE" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2022-12-01T06:40:00.000Z" destinationTerminalId="2" eTicket="true" originDateTime="2022-12-01T02:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="GA 9050GF 5145MH 5537NZ 4285UL 2315XY 3015" discontinueDate="2023-03-22" duration="07:55" effectiveDate="2022-11-02" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MAN" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3521" destination="MAN" destinationDateTime="2022-12-01T06:40:00.000" destinationTerminalId="2" duration="07:55" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T02:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="15" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="15"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T08:40:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T07:25:00.000Z" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="RJ 3008IB 7556AA 6488" discontinueDate="2022-12-03" duration="01:15" effectiveDate="2022-11-21" groundTime="00:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="false" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N O Q S G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="151" destination="LHR" destinationDateTime="2022-12-01T08:40:00.000" destinationTerminalId="5" duration="01:15" equipmentType="320" mealService="M M M M M G G G G G G G G G G G G" origin="MAN" originDateTime="2022-12-01T07:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="1391" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="1391"/>
        <ns2:Origin code="MAN" country="GB" state="" timezoneOffset="+00:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="07:40">
      <ns2:Segment destinationDateTime="2022-12-01T17:45:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-01T14:05:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6675AV 2411GA 9448NZ 4297XY 3017" discontinueDate="2023-03-25" duration="07:40" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T17:45:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-01T14:05:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="17" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="17"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для того чтобы получить расписание и наличие мест для конкретных рейсов необходимо указать:
- ```/AirSchedulesAndAvailabilityRQ/Calendar/Options/Routing/SpecificFlight/Segment/@flightNumber``` — номер рейса
- ```/AirSchedulesAndAvailabilityRQ/Calendar/Options/Routing/SpecificFlight/Segment/@marketingCarrier``` — код маркетингового перевозчика

Для перелетов с пересадкой (т.е. состоящих из нескольких рейсов) необходимо указать каждый рейс в отдельном элементе ```/AirSchedulesAndAvailabilityRQ/Calendar/Options/Routing/SpecificFlight/Segment```.

{{< details title="Пример запроса (выбор конкретных рейсов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options>
      <Routing>
        <SpecificFlight>
          <Segment flightNumber="455" marketingCarrier="EY"/>
          <Segment flightNumber="19" marketingCarrier="EY"/>
        </SpecificFlight>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="25:30">
      <ns2:Segment destinationDateTime="2022-12-02T05:05:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T21:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="GF 5155KL 3939LY 9641ME 6637MS 8087NZ 4255PK 4455UX 2712WY 5405" discontinueDate="2023-03-25" duration="14:35" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7506" destination="AUH" destinationDateTime="2022-12-02T05:05:00.000" destinationTerminalId="3" duration="14:35" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T21:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="455" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="455"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T12:00:00.000Z" destinationTerminalId="4" eTicket="true" originDateTime="2022-12-02T08:20:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 6673AV 2413GA 9126NZ 4299XY 3019" discontinueDate="2023-03-22" duration="07:40" effectiveDate="2022-11-01" groundTime="03:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D W Z Y B H K M Q L V U E T</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0"/>
        <ns2:Disclosure code="EY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-02T12:00:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AUH" originDateTime="2022-12-02T08:20:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EY" flightNumber="19" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EY" flightNumber="19"/>
        <ns2:Origin code="AUH" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

## Время отправления или прибытия

{{< hint warning >}}
Возможность установки временного интервала доступна только в режиме поиска по конкретным датам!
{{< /hint >}}

Для того чтобы установить временной интервал для времени отправления (или прибытия, если установлено значение ```true``` у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@isArrival```) необходимо указать в запросе:
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/@time``` — желательное время отправления или прибытия
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/TimeWindow/@before``` — количество часов до желательного времени отправления или прибытия, для которых будут найдены рейсы 
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/TimeWindow/@before-unit``` — значение ```HOURS```
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/TimeWindow/@after``` — количество часов после желательного времени отправления или прибытия, для которых будут найдены рейсы
- ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/TimeWindow/@after-unit``` — значение ```HOURS```

{{< details title="Пример запроса (отправление с 10:00 до 18:00)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD" time="14:00">
    <Options>
      <TimeWindow after="4" after-unit="HOURS" before="4" before-unit="HOURS"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T22:10:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391FJ 5320PG 4536KL 4881JQ 6001MU 4173" discontinueDate="2023-03-24" duration="08:05" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:25:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T23:15:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7305AA 6836" discontinueDate="2022-12-24" duration="14:10" effectiveDate="2022-11-07" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:25:00.000" destinationTerminalId="5" duration="14:10" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:15:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="12" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="12"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T22:10:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-25" duration="08:05" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Q I Y B M E H K L N R S V Z</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="H H H H H H H H H H H H H H H H H" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="MU" flightNumber="4173" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:25:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T23:15:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7305AA 6836" discontinueDate="2022-12-24" duration="14:10" effectiveDate="2022-11-07" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:25:00.000" destinationTerminalId="5" duration="14:10" equipmentType="789" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:15:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="12" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="12"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-01T21:30:00.000+08:00" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="O">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-24" duration="08:00" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I W E T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" duration="08:00" equipmentType="77W" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="7307" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T23:15:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="O">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-24" duration="14:00" effectiveDate="2022-10-30" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I W E T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:00" equipmentType="777" origin="SIN" originDateTime="2022-12-01T23:15:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="7305" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="12"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-01T21:30:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5916IB 7307" discontinueDate="2023-03-24" duration="08:00" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="" eTicket="true" originDateTime="2022-12-01T23:05:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-24" duration="14:10" effectiveDate="2022-10-30" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" duration="14:10" equipmentType="77W" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="7307" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SIN" country="SG" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:15">
      <ns2:Segment destinationDateTime="2022-12-01T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LX 9500LH 7000QR 5800AY 5840" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-11-11" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-01T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" mealService="DLDLDLDLDLLRLRLRLRLRLRLRLRLRLRLRLRLRLR" origin="SYD" originDateTime="2022-12-01T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:00:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T23:55:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-24" duration="13:05" effectiveDate="2022-10-30" groundTime="02:00" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="5994" destination="LHR" destinationDateTime="2022-12-02T05:00:00.000" destinationTerminalId="3" duration="13:05" equipmentType="77W" mealService="BDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBD" origin="HKG" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="251" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="251"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:15">
      <ns2:Segment destinationDateTime="2022-12-01T21:55:00.000+08:00" destinationTerminalId="1" eTicket="true" originDateTime="2022-12-01T15:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-12-12" duration="09:10" effectiveDate="2022-10-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I R Y B H K M L V S N Q O W</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
        <ns2:Leg airMiles="4580" destination="HKG" destinationDateTime="2022-12-01T21:55:00.000" destinationTerminalId="1" duration="09:10" equipmentType="359" origin="SYD" originDateTime="2022-12-01T15:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="5800" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="100"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-02T05:00:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T23:55:00.000+08:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-24" duration="13:05" effectiveDate="2022-10-30" groundTime="02:00" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D P I W R E Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="CX"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="5994" destination="LHR" destinationDateTime="2022-12-02T05:00:00.000" destinationTerminalId="3" duration="13:05" equipmentType="77W" mealService="BDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBD" origin="HKG" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="CX" flightNumber="251" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="CX" flightNumber="251"/>
        <ns2:Origin code="HKG" country="HK" state="" timezoneOffset="+08:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (прибытие с 10:00 до 18:00)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" isArrival="true" origin="SYD" time="14:00">
    <Options>
      <TimeWindow after="4" after-unit="HOURS" before="4" before-unit="HOURS"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="24:05">
      <ns2:Segment destinationDateTime="2022-12-01T04:30:00.000+03:00" destinationTerminalId="" eTicket="true" originDateTime="2022-11-30T21:40:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6396IB 7951KM 2309WY 6076" discontinueDate="2022-12-20" duration="14:50" effectiveDate="2022-11-17" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="5"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="7688" destination="DOH" destinationDateTime="2022-12-01T04:30:00.000" duration="14:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:40:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="909" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="909"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T10:45:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T06:15:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="WY 6014" discontinueDate="2022-12-01" duration="07:30" effectiveDate="2022-11-17" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Y B H K M L V S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="QR"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3243" destination="LGW" destinationDateTime="2022-12-01T10:45:00.000" destinationTerminalId="N" duration="07:30" equipmentType="788" mealService="M M M M M M M M M M M M M M M M M M M M M M M" origin="DOH" originDateTime="2022-12-01T06:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QR" flightNumber="329" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QR" flightNumber="329"/>
        <ns2:Origin code="DOH" country="QA" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8413" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T07:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8001" discontinueDate="2023-03-25" duration="07:55" effectiveDate="2022-10-30" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="1"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-11-28" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="false" thu="false" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T07:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:55" effectiveDate="2022-10-31" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8001" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="1"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8413" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="3"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T07:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-18" duration="07:55" effectiveDate="2022-10-31" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8001" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="1"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-11-28" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="false" thu="false" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T07:45:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8001" discontinueDate="2023-03-25" duration="07:55" effectiveDate="2022-10-30" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="2"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="3" duration="07:55" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="1"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8413" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T07:40:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8015" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="02:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:40:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="15" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="15"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-11-28" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="false" thu="false" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T07:40:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="02:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L S N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:40:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8015" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="15"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:55">
      <ns2:Segment destinationDateTime="2022-12-01T05:15:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-11-30T21:45:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 8413" discontinueDate="2022-11-30" duration="14:30" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E Y R M B U K Q L T X V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="1"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="0" status="CC"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T05:15:00.000" destinationTerminalId="3" duration="14:30" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-11-30T21:45:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="413" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="413"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T11:40:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T07:40:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="02:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T11:40:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T07:40:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8015" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="15"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

## Другое

По умолчанию сервис возвращает до 8 рекомендаций для каждой заданной комбинации направления и даты отправления или прибытия. Это значение можно увеличить (максимум 300), указав нужное значение у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/@maxReturnedOptions```. В режиме поиска по последовательности дат можно установить количество возвращаемых рекомендаций в качестве значения атрибута ```/AirSchedulesAndAvailabilityRQ/Calendar/Options/@solutionsPerDay``` (максимум 50).

{{< details title="Пример запроса (1 рекомендация)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options maxReturnedOptions="1"/>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="0" status="CL"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="0" status="CC"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0" status="CL"/>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для получения только расписаний рейсов (без информации о наличии мест) необходимо указать значение ```true``` у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/@schedulesOnly```.

{{< details title="Пример запроса (только расписания рейсов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="6.0.0" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2022-12-01" destination="LON" identifier="1" origin="SYD">
    <Options schedulesOnly="true"/>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="6.0.0" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2022-12-01" identifier="1">
    <ns2:Solution duration="23:45">
      <ns2:Segment destinationDateTime="2022-12-02T05:15:00.000Z" destinationTerminalId="5" eTicket="true" originDateTime="2022-12-01T16:30:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="IB 7307" discontinueDate="2023-03-24" duration="22:10" effectiveDate="2022-10-30" mealServiceSegmentOverride="M M M M M M M M M M M M M M M M M M M M M M" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="BA"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T21:30:00.000" country="SG" departureDateTime="2022-12-01T23:05:00.000" destinationDateTime="2022-12-01T23:05:00.000" elapsedFlightTimeLeg="08:00" elapsedLayoverTime="01:35" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T21:30:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T21:30:00.000" destinationTerminalId="1" duration="08:00" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T16:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T05:15:00.000" destinationTerminalId="5" duration="14:10" equipmentType="77W" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="SIN" originDateTime="2022-12-01T23:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="16" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="16"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="24:10">
      <ns2:Segment destinationDateTime="2022-12-02T06:15:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T17:05:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="AY 5004EK 5003UL 3391" discontinueDate="2023-03-24" duration="22:25" effectiveDate="2022-10-30" stopQuantity="1">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="QF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:HiddenStop arrivalDateTime="2022-12-01T22:10:00.000" country="SG" departureDateTime="2022-12-01T23:55:00.000" destinationDateTime="2022-12-01T23:55:00.000" elapsedFlightTimeLeg="08:05" elapsedLayoverTime="01:45" location="SIN" locationTimeZone="+08:00" originDateTime="2022-12-01T22:10:00.000"/>
        <ns2:Leg airMiles="3907" destination="SIN" destinationDateTime="2022-12-01T22:10:00.000" destinationTerminalId="1" duration="08:05" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SYD" originDateTime="2022-12-01T17:05:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:Leg airMiles="6764" destination="LHR" destinationDateTime="2022-12-02T06:15:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="HRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHRHR" origin="SIN" originDateTime="2022-12-01T23:55:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="1" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="QF" flightNumber="1"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E N Y R M B U K Q L T X V S</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-18" duration="07:50" effectiveDate="2022-10-31" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I W R T Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8003" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:20">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:20:00.000Z" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T14:30:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8003" discontinueDate="2023-03-25" duration="07:50" effectiveDate="2022-10-30" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H W E N Y R M B U K Q L T X V S</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3420" destination="LHR" destinationDateTime="2022-12-01T18:20:00.000" destinationTerminalId="3" duration="07:50" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:30:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="3" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="3"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8415" discontinueDate="2023-03-25" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="QF 8009" discontinueDate="2023-03-25" duration="08:00" effectiveDate="2022-10-30" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C I O H Y R M B U K Q L T V X</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EK" flightNumber="9" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="23:25">
      <ns2:Segment destinationDateTime="2022-12-01T13:20:00.000+04:00" destinationTerminalId="3" eTicket="true" originDateTime="2022-12-01T06:00:00.000+11:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-19" duration="14:20" effectiveDate="2022-10-31" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
        <ns2:Leg airMiles="7480" destination="DXB" destinationDateTime="2022-12-01T13:20:00.000" destinationTerminalId="3" duration="14:20" equipmentType="388" mealService="M M M M M M M M M M M M M M M M M" origin="SYD" originDateTime="2022-12-01T06:00:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8415" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="415"/>
        <ns2:Origin code="SYD" country="AU" state="NS" timezoneOffset="+11:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2022-12-01T18:25:00.000Z" destinationTerminalId="N" eTicket="true" originDateTime="2022-12-01T14:25:00.000+04:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2023-03-19" duration="08:00" effectiveDate="2022-10-31" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="EK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGW" country="GB" state="" timezoneOffset="+00:00"/>
        <ns2:Leg airMiles="3405" destination="LGW" destinationDateTime="2022-12-01T18:25:00.000" destinationTerminalId="N" duration="08:00" equipmentType="388" mealService="M M M M M M M M M M M M M M M" origin="DXB" originDateTime="2022-12-01T14:25:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QF" flightNumber="8009" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EK" flightNumber="9"/>
        <ns2:Origin code="DXB" country="AE" state="" timezoneOffset="+04:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}
