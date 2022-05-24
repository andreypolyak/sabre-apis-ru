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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (несколько направлений, конкретные даты)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW"/>
  <OriginDestination date="2020-09-20" destination="LAX" identifier="2" origin="MOW"/>
  <OriginDestination date="2020-09-21" destination="NYC" identifier="3" origin="MOW"/>
  <OriginDestination date="2020-09-21" destination="LAX" identifier="4" origin="MOW"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="2">
    <ns2:Solution duration="12:15">
      <ns2:Segment destinationDateTime="2020-09-20T14:15:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T12:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="6078" destination="LAX" destinationDateTime="2020-09-20T14:15:00.000" destinationTerminalId="B" duration="12:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T12:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="106" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="106"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 8452VS 6841" discontinueDate="2020-09-22" duration="11:05" effectiveDate="2020-09-19" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
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
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-20T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="772" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="601" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="G">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-07" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z P A G W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9680" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-03" duration="11:05" effectiveDate="2020-09-05" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-20T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="772" mealService="B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8179" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-03" duration="11:05" effectiveDate="2020-09-05" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-20T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="772" mealService="B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8179" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AZ 3542DL 8395KL 2213VS 6762" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-20T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="MMMMMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMS" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="66" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z F P A G Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-20T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8395" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:00">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AZ 3542DL 8395KL 2213VS 6762" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-20T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="MMMMMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMS" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="66" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:00">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z F P A G Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-20T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8395" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2020-09-21" identifier="3">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-21T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-21T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-21T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-21T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-21T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-21T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-21T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-21T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-21T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-21T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:40">
      <ns2:Segment destinationDateTime="2020-09-21T08:35:00.000+02:00" destinationTerminalId="5" eTicket="true" originDateTime="2020-09-21T07:15:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="SK 8048" discontinueDate="2020-10-24" duration="02:20" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="795" destination="ARN" destinationDateTime="2020-09-21T08:35:00.000" destinationTerminalId="5" duration="02:20" equipmentType="359" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-21T07:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="362" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="362"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:55:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:25:00.000+02:00" originTerminalId="5" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:30" effectiveDate="2020-03-29" groundTime="01:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>C D Z J Y S B P A E M H Q V W U K L T O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="SK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3921" destination="EWR" destinationDateTime="2020-09-21T12:55:00.000" destinationTerminalId="B" duration="08:30" equipmentType="333" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="ARN" originDateTime="2020-09-21T10:25:00.000" originTerminalId="5" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SK" flightNumber="903" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SK" flightNumber="903"/>
        <ns2:Origin code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-21T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-21T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-21T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-21T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-21T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-21T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-21T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-21T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-21T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-21T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-21T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-21T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2020-09-21" identifier="4">
    <ns2:Solution duration="12:15">
      <ns2:Segment destinationDateTime="2020-09-21T14:15:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T12:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="6078" destination="LAX" destinationDateTime="2020-09-21T14:15:00.000" destinationTerminalId="B" duration="12:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-21T12:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="106" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="106"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:00">
      <ns2:Segment destinationDateTime="2020-09-21T08:35:00.000+02:00" destinationTerminalId="5" eTicket="true" originDateTime="2020-09-21T07:15:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="SK 8048" discontinueDate="2020-10-24" duration="02:20" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="795" destination="ARN" destinationDateTime="2020-09-21T08:35:00.000" destinationTerminalId="5" duration="02:20" equipmentType="359" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-21T07:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="362" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="362"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:15:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:55:00.000+02:00" originTerminalId="5" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="11:20" effectiveDate="2020-03-29" groundTime="01:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>C D Z J Y S B P A E M H Q V W U K L T O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="SK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5521" destination="LAX" destinationDateTime="2020-09-21T12:15:00.000" destinationTerminalId="B" duration="11:20" equipmentType="333" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="ARN" originDateTime="2020-09-21T09:55:00.000" originTerminalId="5" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SK" flightNumber="939" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SK" flightNumber="939"/>
        <ns2:Origin code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 8452VS 6841" discontinueDate="2020-09-22" duration="11:05" effectiveDate="2020-09-19" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
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
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-21T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="772" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-21T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="601" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="G">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-07" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z P A G W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9680" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-03" duration="11:05" effectiveDate="2020-09-05" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-21T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="789" mealService="B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-21T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8179" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:15">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:50:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-03" duration="11:05" effectiveDate="2020-09-05" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="false" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5578" destination="LAX" destinationDateTime="2020-09-21T11:55:00.000" destinationTerminalId="B" duration="11:05" equipmentType="789" mealService="B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-21T09:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8179" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="601"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:45">
      <ns2:Segment destinationDateTime="2020-09-21T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-21T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-21T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-21T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AZ 3542DL 8395KL 2213VS 6762" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-21T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="MMMMMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMS" origin="CDG" originDateTime="2020-09-21T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="66" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:45">
      <ns2:Segment destinationDateTime="2020-09-21T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-21T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-21T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-21T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z F P A G Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-21T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="CDG" originDateTime="2020-09-21T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="8395" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:00">
      <ns2:Segment destinationDateTime="2020-09-21T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-21T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-21T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-21T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:55:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:15:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AZ 3542DL 8395KL 2213VS 6762" discontinueDate="2020-10-24" duration="11:40" effectiveDate="2020-03-29" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="5670" destination="LAX" destinationDateTime="2020-09-21T12:55:00.000" destinationTerminalId="B" duration="11:40" equipmentType="388" mealService="MMMMMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMS" origin="CDG" originDateTime="2020-09-21T10:15:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="66" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="66"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <Calendar days="2" destination="NYC" origin="MOW" startDate="2020-09-20"/>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-20T19:18:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T16:00:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T19:18:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-20T16:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="663" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="663"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-20T20:08:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T16:50:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T20:08:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-20T16:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="661" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="661"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
  <ns2:OriginAndDestination baseDate="2020-09-21" identifier="2">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-21T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-21T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-21T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-21T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-21T19:18:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T16:00:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T19:18:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-21T16:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="663" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="663"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-21T20:08:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T16:50:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T20:08:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-21T16:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="661" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="661"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-21T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-21T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-21T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-21T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-21T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-21T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-21T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-21T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-21T08:05:00.000" duration="03:25" equipmentType="73H" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-21T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-21T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-21T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:40">
      <ns2:Segment destinationDateTime="2020-09-21T08:35:00.000+02:00" destinationTerminalId="5" eTicket="true" originDateTime="2020-09-21T07:15:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="SK 8048" discontinueDate="2020-10-24" duration="02:20" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="false" thu="true" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>Z C J U D S T P L R Y B E M H W Q N V G K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Disclosure code="SQ"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="795" destination="ARN" destinationDateTime="2020-09-21T08:35:00.000" destinationTerminalId="5" duration="02:20" equipmentType="359" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-21T07:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SQ" flightNumber="362" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SQ" flightNumber="362"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T12:55:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-21T10:25:00.000+02:00" originTerminalId="5" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:30" effectiveDate="2020-03-29" groundTime="01:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>C D Z J Y S B P A E M H Q V W U K L T O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="SK"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3921" destination="EWR" destinationDateTime="2020-09-21T12:55:00.000" destinationTerminalId="B" duration="08:30" equipmentType="333" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="ARN" originDateTime="2020-09-21T10:25:00.000" originTerminalId="5" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SK" flightNumber="903" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SK" flightNumber="903"/>
        <ns2:Origin code="ARN" country="SE" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Carriers inclusion="all">
        <Carrier type="MARKETING">SU</Carrier>
        <Carrier type="MARKETING">AF</Carrier>
      </Carriers>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="15:23">
      <ns2:Segment destinationDateTime="2020-09-20T08:00:00.000+01:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-19" duration="04:20" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="true" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1563" destination="LHR" destinationDateTime="2020-09-20T08:00:00.000" destinationTerminalId="4" duration="04:20" equipmentType="320" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2570" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2570"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:03:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:45:00.000+01:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:18" effectiveDate="2020-09-01" groundTime="02:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S A Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T14:03:00.000" destinationTerminalId="4" duration="08:18" equipmentType="764" mealService="L L L L L L L L L L L L L L L L L L L L L" origin="LHR" originDateTime="2020-09-20T10:45:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3600" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="4"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:00">
      <ns2:Segment destinationDateTime="2020-09-20T09:50:00.000+01:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T07:25:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-23" duration="04:25" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1563" destination="LHR" destinationDateTime="2020-09-20T09:50:00.000" destinationTerminalId="4" duration="04:25" equipmentType="320" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:25:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2574" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2574"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:25:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T12:35:00.000+01:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-16" duration="07:50" effectiveDate="2020-08-07" groundTime="02:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S A Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="VS"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T15:25:00.000" destinationTerminalId="4" duration="07:50" equipmentType="351" mealService="L L L L L L L L L L L L L L L L L L L L L" origin="LHR" originDateTime="2020-09-20T12:35:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="9916" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="VS" flightNumber="137"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="14:30">
      <ns2:Segment destinationDateTime="2020-09-20T11:10:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T08:25:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="03:45" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MXP" country="IT" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1430" destination="MXP" destinationDateTime="2020-09-20T11:10:00.000" destinationTerminalId="1" duration="03:45" equipmentType="73H" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T08:25:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2410" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2410"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:55:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T12:35:00.000+02:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:20" effectiveDate="2020-09-20" groundTime="01:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S A Y B M U K H L Q T N R V G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AZ"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3995" destination="JFK" destinationDateTime="2020-09-20T15:55:00.000" destinationTerminalId="1" duration="09:20" equipmentType="330" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="MXP" originDateTime="2020-09-20T12:35:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="9756" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AZ" flightNumber="604"/>
        <ns2:Origin code="MXP" country="IT" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:43">
      <ns2:Segment destinationDateTime="2020-09-20T12:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T10:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T12:00:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="L L L L L L S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T10:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2012" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2012"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:53:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T13:30:00.000+02:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-01" duration="09:23" effectiveDate="2020-09-05" groundTime="01:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4082" destination="JFK" destinationDateTime="2020-09-20T16:53:00.000" destinationTerminalId="4" duration="09:23" equipmentType="76W" mealService="L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T13:30:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3590" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="211"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:08">
      <ns2:Segment destinationDateTime="2020-09-20T11:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="04:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="BCN" country="ES" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1879" destination="BCN" destinationDateTime="2020-09-20T11:00:00.000" destinationTerminalId="1" duration="04:40" equipmentType="32B" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2638" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2638"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:28:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T12:35:00.000+02:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:53" effectiveDate="2020-09-11" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="true" sun="true" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3831" destination="JFK" destinationDateTime="2020-09-20T15:28:00.000" destinationTerminalId="4" duration="08:53" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L" origin="BCN" originDateTime="2020-09-20T12:35:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3596" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="169"/>
        <ns2:Origin code="BCN" country="ES" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:05:00.000+01:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T09:50:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="04:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1563" destination="LHR" destinationDateTime="2020-09-20T12:05:00.000" destinationTerminalId="4" duration="04:15" equipmentType="333" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T09:50:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2578" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2578"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:45:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T14:05:00.000+01:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="07:40" effectiveDate="2020-08-01" groundTime="02:00" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S A Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="VS"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T16:45:00.000" destinationTerminalId="4" duration="07:40" equipmentType="789" mealService="L L L L L L L L L L L L L L L L L L L L L" origin="LHR" originDateTime="2020-09-20T14:05:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="9663" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="VS" flightNumber="45"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:50">
      <ns2:Segment destinationDateTime="2020-09-20T13:05:00.000+02:00" destinationTerminalId="2C" eTicket="true" originDateTime="2020-09-20T10:05:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="04:00" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T13:05:00.000" destinationTerminalId="2C" duration="04:00" equipmentType="32B" mealService="L L L L L L L L L L L L L L L L L L L L L" origin="SVO" originDateTime="2020-09-20T10:05:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2454" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2454"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:55:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AZ 3714DL 9184KL 2301RO 9527VS 6758" discontinueDate="2020-10-24" duration="08:35" effectiveDate="2020-03-29" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>P F J C D I Z O W S A Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T16:55:00.000" destinationTerminalId="1" duration="08:35" equipmentType="77W" mealService="MSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMSMS" origin="CDG" originDateTime="2020-09-20T14:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="6" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="6"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:30:00.000+01:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T07:05:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="04:25" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1563" destination="LHR" destinationDateTime="2020-09-20T09:30:00.000" destinationTerminalId="4" duration="04:25" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:05:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2580" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2580"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:25:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T12:35:00.000+01:00" originTerminalId="3" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-16" duration="07:50" effectiveDate="2020-08-07" groundTime="03:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S A Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="VS"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T15:25:00.000" destinationTerminalId="4" duration="07:50" equipmentType="351" mealService="L L L L L L L L L L L L L L L L L L L L L" origin="LHR" originDateTime="2020-09-20T12:35:00.000" originTerminalId="3" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="9916" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="VS" flightNumber="137"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (черный список оперирующих перевозчиков)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Carriers inclusion="none">
        <Carrier type="OPERATING">AF</Carrier>
        <Carrier type="OPERATING">KL</Carrier>
      </Carriers>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-04-12" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="350" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:05">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:10:00.000+03:00" originTerminalId="F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QS 8899" discontinueDate="2020-10-25" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y M B H K T A L X Q U V N S W R P O G E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="OK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="1" duration="02:50" equipmentType="738" mealService="B B B B B G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T07:10:00.000" originTerminalId="F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="OK" flightNumber="899" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="OK" flightNumber="899"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (исключение интерлайн перелетов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Carriers onlineOnly="true"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:42">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3628" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:39">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="G">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-07" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z P A G W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9680" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:19:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:00:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 6020VS 3941" discontinueDate="2020-10-24" duration="08:19" effectiveDate="2020-09-01" groundTime="01:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T12:19:00.000" destinationTerminalId="4" duration="08:19" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L L" origin="AMS" originDateTime="2020-09-20T10:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="47" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="47"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:45">
      <ns2:Segment destinationDateTime="2020-09-20T07:55:00.000+01:00" destinationTerminalId="5" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="S7 4001" discontinueDate="2020-10-24" duration="04:15" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1585" destination="LHR" destinationDateTime="2020-09-20T07:55:00.000" destinationTerminalId="5" duration="04:15" equipmentType="321" mealService="M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-20T05:40:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="236" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="236"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:25:00.000-04:00" destinationTerminalId="7" eTicket="true" originDateTime="2020-09-20T09:35:00.000+01:00" originTerminalId="5" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5475EI 8875IB 7374AA 6140" discontinueDate="2020-10-19" duration="07:50" effectiveDate="2020-09-15" groundTime="01:40" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
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
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T12:25:00.000" destinationTerminalId="7" duration="07:50" equipmentType="777" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="LHR" originDateTime="2020-09-20T09:35:00.000" originTerminalId="5" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="175" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="175"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:57">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3628" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing directFlightsOnly="true"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для того чтобы получить в ответе рейсы с заданными пунктами пересадки необходимо указать их в качестве значений элементов ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/ConnectPointPath/ConnectPoint```. При этом ответ будет различаться в зависимости от того указаны ли они внутри одно элемента ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/Routing/ConnectPointPath``` или разных:

{{< details title="Пример запроса (одна пересадка в любом из пунктов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing>
        <ConnectPointPath>
          <ConnectPoint>PAR</ConnectPoint>
        </ConnectPointPath>
        <ConnectPointPath>
          <ConnectPoint>AMS</ConnectPoint>
        </ConnectPointPath>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:42">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3628" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:42">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 3628AZ 5911KL 6184VS 3989" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="263" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:39">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="G">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-07" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z P A G W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9680" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:19:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:00:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 6020VS 3941" discontinueDate="2020-10-24" duration="08:19" effectiveDate="2020-09-01" groundTime="01:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T12:19:00.000" destinationTerminalId="4" duration="08:19" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L L" origin="AMS" originDateTime="2020-09-20T10:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="47" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="47"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:39">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:19:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:00:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="KL 6020VS 3941" discontinueDate="2020-10-24" duration="08:19" effectiveDate="2020-09-01" groundTime="01:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T12:19:00.000" destinationTerminalId="4" duration="08:19" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L L" origin="AMS" originDateTime="2020-09-20T10:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="47" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="47"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:57">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M U K H L Q T E N R V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="3628" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:57">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:52:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T10:20:00.000+02:00" originTerminalId="2E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 3628AZ 5911KL 6184VS 3989" discontinueDate="2020-10-24" duration="08:32" effectiveDate="2020-09-01" groundTime="01:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3635" destination="JFK" destinationDateTime="2020-09-20T12:52:00.000" destinationTerminalId="4" duration="08:32" equipmentType="333" mealService="L L L L L L L L L L L L L L L L L L L" origin="CDG" originDateTime="2020-09-20T10:20:00.000" originTerminalId="2E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="263" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="263"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (две пересадки)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing>
        <ConnectPointPath>
          <ConnectPoint>PAR</ConnectPoint>
          <ConnectPoint>AMS</ConnectPoint>
        </ConnectPointPath>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="16:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="01:20" effectiveDate="2020-09-20" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T11:35:00.000" duration="01:20" equipmentType="73J" mealService="M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="8230" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="1230"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T13:20:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="Y">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-21" duration="08:10" effectiveDate="2020-09-20" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T15:30:00.000" destinationTerminalId="4" duration="08:10" equipmentType="772" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T13:20:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="6698" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="641"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="01:20" effectiveDate="2020-09-20" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T11:35:00.000" duration="01:20" equipmentType="73J" mealService="M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="8230" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="1230"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T13:20:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-27" duration="08:10" effectiveDate="2020-06-30" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="true" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T15:30:00.000" destinationTerminalId="4" duration="08:10" equipmentType="772" mealService="L L L L L L L L L L L L L L L L L" origin="AMS" originDateTime="2020-09-20T13:20:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9348" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="641"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:25">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="01:20" effectiveDate="2020-09-20" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T11:35:00.000" duration="01:20" equipmentType="73J" mealService="M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="8230" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="1230"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:35:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T13:20:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AF 6698VS 6837" discontinueDate="2020-10-24" duration="08:15" effectiveDate="2020-07-14" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="9"/>
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
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T15:35:00.000" destinationTerminalId="4" duration="08:15" equipmentType="333" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T13:20:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="641" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="641"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="16:35">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T10:15:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="01:20" effectiveDate="2020-09-20" groundTime="01:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T11:35:00.000" duration="01:20" equipmentType="73J" mealService="M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T10:15:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="8230" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="1230"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T15:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T13:20:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international" trafficRestrictionCode="Y">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-21" duration="08:10" effectiveDate="2020-09-20" groundTime="01:45" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T15:30:00.000" destinationTerminalId="4" duration="08:10" equipmentType="772" mealService="M M M M M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T13:20:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="6698" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="641"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:55">
      <ns2:Segment destinationDateTime="2020-09-20T10:35:00.000+02:00" destinationTerminalId="2C" eTicket="true" originDateTime="2020-09-20T07:35:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-23" duration="04:00" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="true" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T10:35:00.000" destinationTerminalId="2C" duration="04:00" equipmentType="32B" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:35:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2450" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2450"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:40:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8531G3 5147GA 9541KL 2008KQ 3116MK 9394MU 4959UU 8640" discontinueDate="2020-10-07" duration="01:25" effectiveDate="2020-04-04" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T13:05:00.000" duration="01:25" equipmentType="319" mealService="M M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T11:40:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1640" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1640"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T14:30:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="08:00" effectiveDate="2020-08-31" groundTime="01:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T16:30:00.000" destinationTerminalId="4" duration="08:00" equipmentType="772" mealService="D D D D D D D D D D D D D D D D D" origin="AMS" originDateTime="2020-09-20T14:30:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9313" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="645"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="15:55">
      <ns2:Segment destinationDateTime="2020-09-20T10:35:00.000+02:00" destinationTerminalId="2C" eTicket="true" originDateTime="2020-09-20T07:35:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-23" duration="04:00" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="true" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="6"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T10:35:00.000" destinationTerminalId="2C" duration="04:00" equipmentType="32B" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:35:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2450" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2450"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:45:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="01:20" effectiveDate="2020-08-13" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T13:05:00.000" duration="01:20" equipmentType="321" origin="CDG" originDateTime="2020-09-20T11:45:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="2008" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1640"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T14:30:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="08:00" effectiveDate="2020-08-31" groundTime="01:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T16:30:00.000" destinationTerminalId="4" duration="08:00" equipmentType="772" mealService="D D D D D D D D D D D D D D D D D" origin="AMS" originDateTime="2020-09-20T14:30:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9313" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="645"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:10:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T06:10:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-19" duration="04:00" effectiveDate="2020-08-20" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="true" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:10:00.000" destinationTerminalId="2E" duration="04:00" equipmentType="319" origin="SVO" originDateTime="2020-09-20T06:10:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1845" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1845"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:40:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8531G3 5147GA 9541KL 2008KQ 3116MK 9394MU 4959UU 8640" discontinueDate="2020-10-07" duration="01:25" effectiveDate="2020-04-04" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T13:05:00.000" duration="01:25" equipmentType="319" mealService="M M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T11:40:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1640" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1640"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T14:30:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="08:00" effectiveDate="2020-08-31" groundTime="01:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T16:30:00.000" destinationTerminalId="4" duration="08:00" equipmentType="772" mealService="D D D D D D D D D D D D D D D D D" origin="AMS" originDateTime="2020-09-20T14:30:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9313" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="645"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:35">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="2E" eTicket="true" originDateTime="2020-09-20T05:55:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8278SU 3006" discontinueDate="2020-10-24" duration="04:05" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1529" destination="CDG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="2E" duration="04:05" equipmentType="321" mealService="B B B B B B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T05:55:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1655" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1655"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:40:00.000+02:00" originTerminalId="2F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="DL 8531G3 5147GA 9541KL 2008KQ 3116MK 9394MU 4959UU 8640" discontinueDate="2020-10-07" duration="01:25" effectiveDate="2020-04-04" groundTime="02:40" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Disclosure code="AF"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="248" destination="AMS" destinationDateTime="2020-09-20T13:05:00.000" duration="01:25" equipmentType="319" mealService="M M M M M M S S S S S S S S S S S S S S S S S S S S" origin="CDG" originDateTime="2020-09-20T11:40:00.000" originTerminalId="2F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AF" flightNumber="1640" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AF" flightNumber="1640"/>
        <ns2:Origin code="CDG" country="FR" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T16:30:00.000-04:00" destinationTerminalId="4" eTicket="true" originDateTime="2020-09-20T14:30:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-09-20" duration="08:00" effectiveDate="2020-08-31" groundTime="01:25" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3643" destination="JFK" destinationDateTime="2020-09-20T16:30:00.000" destinationTerminalId="4" duration="08:00" equipmentType="772" mealService="D D D D D D D D D D D D D D D D D" origin="AMS" originDateTime="2020-09-20T14:30:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="9313" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="645"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing>
        <Avoid location="PAR" type="A"/>
        <Avoid location="HEL" type="A"/>
        <Avoid location="AMS" type="A"/>
        <Avoid location="GB" type="N"/>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:05">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:10:00.000+03:00" originTerminalId="F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QS 8899" discontinueDate="2020-10-25" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y M B H K T A L X Q U V N S W R P O G E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="OK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="1" duration="02:50" equipmentType="738" mealService="B B B B B G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T07:10:00.000" originTerminalId="F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="OK" flightNumber="899" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="OK" flightNumber="899"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:05">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:10:00.000+03:00" originTerminalId="F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-25" duration="02:50" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>Y P B H L M Q V X U J K T W</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Disclosure code="OK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="1" duration="02:50" equipmentType="738" origin="SVO" originDateTime="2020-09-20T07:10:00.000" originTerminalId="F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="QS" flightNumber="8899" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="OK" flightNumber="899"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:30:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-02" duration="09:20" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:30:00.000" destinationTerminalId="B" duration="09:20" equipmentType="763" mealService="M M M M M M M M M M M M M M M M M" origin="PRG" originDateTime="2020-09-20T10:10:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7705" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:00:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:10:00.000+03:00" originTerminalId="F" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QS 8899" discontinueDate="2020-10-25" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y M B H K T A L X Q U V N S W R P O G E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="OK"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:00:00.000" destinationTerminalId="1" duration="02:50" equipmentType="738" mealService="B B B B B G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T07:10:00.000" originTerminalId="F" smokingAllowed="false"/>
        <ns2:MarketingFlight code="OK" flightNumber="899" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="OK" flightNumber="899"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:30:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-02" duration="09:20" effectiveDate="2020-06-05" groundTime="01:10" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:30:00.000" destinationTerminalId="B" duration="09:20" equipmentType="763" mealService="M M M M M M M M M M M M M M M M M" origin="PRG" originDateTime="2020-09-20T10:10:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7705" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing>
        <Segment segmentNumber="1">
          <Carriers maxFlightNumber="199" minFlightNumber="100">
            <MarketingCarrier>SU</MarketingCarrier>
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
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="17:46">
      <ns2:Segment destinationDateTime="2020-09-20T16:15:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-06-02" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="5728" destination="MIA" destinationDateTime="2020-09-20T16:15:00.000" duration="12:15" equipmentType="359" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T11:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="110" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="110"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T21:46:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T18:45:00.000-04:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6926" discontinueDate="2020-10-24" duration="03:01" effectiveDate="2020-09-05" groundTime="02:30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J R D I Y B H K M L G V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Disclosure code="AA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGA" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="1097" destination="LGA" destinationDateTime="2020-09-20T21:46:00.000" destinationTerminalId="B" duration="03:01" equipmentType="738" mealService="D D D D D D F F F F F F F F F F F F F F" origin="MIA" originDateTime="2020-09-20T18:45:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AA" flightNumber="1626" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AA" flightNumber="1626"/>
        <ns2:Origin code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="18:29">
      <ns2:Segment destinationDateTime="2020-09-20T16:15:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-06-02" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="5728" destination="MIA" destinationDateTime="2020-09-20T16:15:00.000" duration="12:15" equipmentType="359" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T11:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="110" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="110"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T22:29:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T19:25:00.000-04:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="CX 7536MH 9335" discontinueDate="2020-10-21" duration="03:04" effectiveDate="2020-09-09" groundTime="03:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J R D I Y B H K M L G V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Disclosure code="AA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="1090" destination="JFK" destinationDateTime="2020-09-20T22:29:00.000" destinationTerminalId="8" duration="03:04" equipmentType="763" mealService="D D D D D D F F F F F F F F F F F F F F" origin="MIA" originDateTime="2020-09-20T19:25:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AA" flightNumber="1142" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AA" flightNumber="1142"/>
        <ns2:Origin code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="18:56">
      <ns2:Segment destinationDateTime="2020-09-20T16:15:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-06-02" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="5728" destination="MIA" destinationDateTime="2020-09-20T16:15:00.000" duration="12:15" equipmentType="359" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T11:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="110" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="110"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T22:56:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T19:50:00.000-04:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="BA 6896" discontinueDate="2020-09-30" duration="03:06" effectiveDate="2020-09-01" groundTime="03:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J R D I Y B H K M L G V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Disclosure code="AA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGA" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="1097" destination="LGA" destinationDateTime="2020-09-20T22:56:00.000" destinationTerminalId="B" duration="03:06" equipmentType="738" mealService="D D D D D D F F F F F F F F F F F F F F" origin="MIA" originDateTime="2020-09-20T19:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AA" flightNumber="1171" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AA" flightNumber="1171"/>
        <ns2:Origin code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="19:02">
      <ns2:Segment destinationDateTime="2020-09-20T16:15:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-06-02" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="true" sun="true" thu="false" tue="true" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="5728" destination="MIA" destinationDateTime="2020-09-20T16:15:00.000" duration="12:15" equipmentType="359" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T11:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="110" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="110"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T23:02:00.000-04:00" destinationTerminalId="D" eTicket="true" originDateTime="2020-09-20T19:56:00.000-04:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="WS 7292" discontinueDate="2020-09-24" duration="03:06" effectiveDate="2020-09-05" groundTime="03:41" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="false" sat="false" sun="true" thu="false" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z W S Y B M H Q K L U T X V E</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Disclosure code="DL"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="LGA" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="1097" destination="LGA" destinationDateTime="2020-09-20T23:02:00.000" destinationTerminalId="D" duration="03:06" equipmentType="321" mealService="D D D D D V V V V V V V V V V V V V V" origin="MIA" originDateTime="2020-09-20T19:56:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="DL" flightNumber="1982" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="DL" flightNumber="1982"/>
        <ns2:Origin code="MIA" country="US" state="FL" timezoneOffset="-04:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="20:02">
      <ns2:Segment destinationDateTime="2020-09-20T14:15:00.000-07:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T12:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="12:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
        <ns2:Leg airMiles="6078" destination="LAX" destinationDateTime="2020-09-20T14:15:00.000" destinationTerminalId="B" duration="12:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T12:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="106" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="106"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-21T01:02:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T16:30:00.000-07:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="domestic-domestic">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="QF 4874TN 1214" discontinueDate="2020-09-30" duration="05:32" effectiveDate="2020-06-01" groundTime="02:15" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="false" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J R D I Y B H K M L G V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Disclosure code="AA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="2475" destination="JFK" destinationDateTime="2020-09-21T01:02:00.000" destinationTerminalId="8" duration="05:32" equipmentType="32B" mealService="D D D D D D D D D S S S S S S S S S S S S S S" origin="LAX" originDateTime="2020-09-20T16:30:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AA" flightNumber="184" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AA" flightNumber="184"/>
        <ns2:Origin code="LAX" country="US" state="CA" timezoneOffset="-07:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options>
      <Routing>
        <SpecificFlight>
          <Segment flightNumber="236" marketingCarrier="BA"/>
          <Segment flightNumber="175" marketingCarrier="BA"/>
        </SpecificFlight>
      </Routing>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="13:45">
      <ns2:Segment destinationDateTime="2020-09-20T07:55:00.000+01:00" destinationTerminalId="5" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="S7 4001" discontinueDate="2020-10-24" duration="04:15" effectiveDate="2020-03-30" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
        <ns2:Leg airMiles="1585" destination="LHR" destinationDateTime="2020-09-20T07:55:00.000" destinationTerminalId="5" duration="04:15" equipmentType="321" mealService="M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-20T05:40:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="236" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="236"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T12:25:00.000-04:00" destinationTerminalId="7" eTicket="true" originDateTime="2020-09-20T09:35:00.000+01:00" originTerminalId="5" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AY 5475EI 8875IB 7374AA 6140" discontinueDate="2020-10-19" duration="07:50" effectiveDate="2020-09-15" groundTime="01:40" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D R I W E T Y B H K M L V S N Q O G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
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
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3452" destination="JFK" destinationDateTime="2020-09-20T12:25:00.000" destinationTerminalId="7" duration="07:50" equipmentType="777" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="LHR" originDateTime="2020-09-20T09:35:00.000" originTerminalId="5" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="175" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="BA" flightNumber="175"/>
        <ns2:Origin code="LHR" country="GB" state="" timezoneOffset="+01:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW" time="14:00">
    <Options>
      <TimeWindow after="4" after-unit="HOURS" before="4" before-unit="HOURS"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:30">
      <ns2:Segment destinationDateTime="2020-09-20T15:50:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T14:35:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="SU 3700" discontinueDate="2020-10-24" duration="02:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>C D Z F P A R Y B M E H K Q G T S V W L U O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="LO"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="WAW" country="PL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="717" destination="WAW" destinationDateTime="2020-09-20T15:50:00.000" duration="02:15" equipmentType="E95" mealService="M M M M M M M RFRFRFRFRFRFRFRFRFRFRFRFRFRFRF" origin="SVO" originDateTime="2020-09-20T14:35:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LO" flightNumber="676" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LO" flightNumber="676"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T20:05:00.000-04:00" destinationTerminalId="7" eTicket="true" originDateTime="2020-09-20T16:45:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:20" effectiveDate="2020-03-29" groundTime="00:55" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>C D Z F P A R Y B M E H K Q G T S V W L U O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Disclosure code="LO"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4267" destination="JFK" destinationDateTime="2020-09-20T20:05:00.000" destinationTerminalId="7" duration="09:20" equipmentType="789" mealService="DBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDBDB" origin="WAW" originDateTime="2020-09-20T16:45:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LO" flightNumber="26" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LO" flightNumber="26"/>
        <ns2:Origin code="WAW" country="PL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-04-12" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="350" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:45">
      <ns2:Segment destinationDateTime="2020-09-20T15:35:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T13:10:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="03:25" effectiveDate="2020-04-13" stopQuantity="0">
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
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="FRA" country="DE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1275" destination="FRA" destinationDateTime="2020-09-20T15:35:00.000" destinationTerminalId="1" duration="03:25" equipmentType="32A" mealService="M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-20T13:10:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="1445" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="1445"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T19:55:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T17:10:00.000+02:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UA 8843SN 7232" discontinueDate="2020-10-24" duration="08:45" effectiveDate="2020-03-30" groundTime="01:35" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>F A J C D Z P G E N Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="F" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
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
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3856" destination="JFK" destinationDateTime="2020-09-20T19:55:00.000" destinationTerminalId="1" duration="08:45" equipmentType="74H" mealService="M M M M M M M M M M M M M M M M M M M M M M" origin="FRA" originDateTime="2020-09-20T17:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="404" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="404"/>
        <ns2:Origin code="FRA" country="DE" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:45">
      <ns2:Segment destinationDateTime="2020-09-20T15:35:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T13:10:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="03:25" effectiveDate="2020-04-13" stopQuantity="0">
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
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="FRA" country="DE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1275" destination="FRA" destinationDateTime="2020-09-20T15:35:00.000" destinationTerminalId="1" duration="03:25" equipmentType="32A" mealService="M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-20T13:10:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="1445" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="1445"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T19:55:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T17:10:00.000+02:00" originTerminalId="1" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:45" effectiveDate="2020-03-30" groundTime="01:35" passengerCheckInInformation="/LUFTHANS" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P O A R Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Disclosure code="LH"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3856" destination="JFK" destinationDateTime="2020-09-20T19:55:00.000" destinationTerminalId="1" duration="08:45" equipmentType="74H" origin="FRA" originDateTime="2020-09-20T17:10:00.000" originTerminalId="1" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="8843" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="404"/>
        <ns2:Origin code="FRA" country="DE" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:25">
      <ns2:Segment destinationDateTime="2020-09-20T14:45:00.000+02:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T12:30:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="03:15" effectiveDate="2020-03-29" stopQuantity="0">
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
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="MUC" country="DE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1209" destination="MUC" destinationDateTime="2020-09-20T14:45:00.000" destinationTerminalId="2" duration="03:15" equipmentType="319" mealService="M M M M M M M M M M M M M M M M M" origin="DME" originDateTime="2020-09-20T12:30:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="2527" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="2527"/>
        <ns2:Origin code="DME" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T18:55:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T16:05:00.000+02:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="UA 9255AC 9447" discontinueDate="2020-10-24" duration="08:50" effectiveDate="2020-03-29" groundTime="01:20" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P G E N Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="9"/>
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
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4044" destination="EWR" destinationDateTime="2020-09-20T18:55:00.000" destinationTerminalId="B" duration="08:50" equipmentType="359" mealService="M M M M M M M M M M M M M M M M M M M M" origin="MUC" originDateTime="2020-09-20T16:05:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="412" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="LH" flightNumber="412"/>
        <ns2:Origin code="MUC" country="DE" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

---

{{< details title="Пример запроса (прибытие с 10:00 до 18:00)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" isArrival="true" origin="MOW" time="14:00">
    <Options>
      <TimeWindow after="4" after-unit="HOURS" before="4" before-unit="HOURS"/>
    </Options>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AA 8985BA 6005IB  350" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="5" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-03-29" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V N S O Q</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" mealService="HSHSHSHSHSHSHSHSHSHSHSHSHSHSHSHS" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="BA" flightNumber="6005" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:40">
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000+03:00" destinationTerminalId="2" eTicket="true" originDateTime="2020-09-20T10:00:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="JL 6862SU 3960" discontinueDate="2020-10-24" duration="01:40" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I F U Y B H K M P T L V S N Q O Z R G W X E A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="N7"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
        <ns2:Leg airMiles="545" destination="HEL" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="2" duration="01:40" equipmentType="E90" mealService="M M M M M M G G G G G G G G G G G G G G G G G G G G" origin="SVO" originDateTime="2020-09-20T10:00:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="AY" flightNumber="712" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="712"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T14:40:00.000-04:00" destinationTerminalId="8" eTicket="true" originDateTime="2020-09-20T12:45:00.000+03:00" originTerminalId="2" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="08:55" effectiveDate="2020-04-12" groundTime="01:05" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D R I Y B H K M L V S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="9"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="9"/>
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
        <ns2:Disclosure code="AY"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4117" destination="JFK" destinationDateTime="2020-09-20T14:40:00.000" destinationTerminalId="8" duration="08:55" equipmentType="333" origin="HEL" originDateTime="2020-09-20T12:45:00.000" originTerminalId="2" smokingAllowed="false"/>
        <ns2:MarketingFlight code="IB" flightNumber="350" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="AY" flightNumber="5"/>
        <ns2:Origin code="HEL" country="FI" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="P" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="4"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="4"/>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:30:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-02" duration="09:20" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
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
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:30:00.000" destinationTerminalId="B" duration="09:20" equipmentType="763" mealService="M M M M M M M M M M M M M M M M M" origin="PRG" originDateTime="2020-09-20T10:10:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7705" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:20">
      <ns2:Segment destinationDateTime="2020-09-20T09:55:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T07:35:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="03:20" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="DUS" country="DE" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1290" destination="DUS" destinationDateTime="2020-09-20T09:55:00.000" duration="03:20" equipmentType="320" mealService="B B B B B B B B B B B B B B B B B B B B B" origin="SVO" originDateTime="2020-09-20T07:35:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2536" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2536"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:55:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T11:35:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" codeshareBlockDisplay="LH 5194UA 9616" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:40" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="false" wed="true"/>
          <ns2:ScheduledBookingClasses>A</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="A" seatAvailability="4"/>
        <ns2:Disclosure code="SN"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3755" destination="EWR" destinationDateTime="2020-09-20T13:55:00.000" duration="08:20" equipmentType="333" mealService="MSMSMS" origin="DUS" originDateTime="2020-09-20T11:35:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="EW" flightNumber="1112" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="EW" flightNumber="1112"/>
        <ns2:Origin code="DUS" country="DE" state="" timezoneOffset="+02:00"/>
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
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options maxReturnedOptions="1"/>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails cancelled="false" charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Availability bookingClassCode="J" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="C" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="D" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="I" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Z" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="O" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="W" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="S" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="A" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="F" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Y" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="B" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="M" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="U" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="K" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="H" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="L" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="X" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="Q" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="T" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="E" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="N" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="R" seatAvailability="7"/>
        <ns2:Availability bookingClassCode="G" seatAvailability="0"/>
        <ns2:Availability bookingClassCode="V" seatAvailability="0"/>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}

Для получения только расписаний рейсов (без информации о наличии мест) необходимо указать значение ```true``` у атрибута ```/AirSchedulesAndAvailabilityRQ/OriginDestination/Options/@schedulesOnly```.

{{< details title="Пример запроса (только расписания рейсов)" >}}
```XML
<AirSchedulesAndAvailabilityRQ version="5.3.1" xmlns="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <OriginDestination date="2020-09-20" destination="NYC" identifier="1" origin="MOW">
    <Options schedulesOnly="true"/>
  </OriginDestination>
</AirSchedulesAndAvailabilityRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ns2:AirSchedulesAndAvailabilityRS version="5.3.1" xmlns="http://services.sabre.com/STL/v01" xmlns:ns2="https://myschedules.havail.sabre.com/ws/AirSchedulesAndAvailability">
  <ApplicationResults status="Complete"/>
  <ns2:OriginAndDestination baseDate="2020-09-20" identifier="1">
    <ns2:Solution duration="09:55">
      <ns2:Segment destinationDateTime="2020-09-20T12:15:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T09:20:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2020-10-24" duration="09:55" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T12:15:00.000" destinationTerminalId="1" duration="09:55" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T09:20:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="100" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="100"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:15">
      <ns2:Segment destinationDateTime="2020-09-20T17:30:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T14:15:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2020-10-24" duration="10:15" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T17:30:00.000" destinationTerminalId="1" duration="10:15" equipmentType="77W" mealService="LSLSLSLSLSLSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" origin="SVO" originDateTime="2020-09-20T14:15:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="102" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="102"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-20T19:18:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T16:00:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T19:18:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-20T16:00:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="663" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="663"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="11:18">
      <ns2:Segment destinationDateTime="2020-09-20T20:08:00.000-04:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T16:50:00.000+03:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="9999-12-31" duration="11:18" effectiveDate="2018-10-08" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z Y B H K M L V X S N Q O</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="X0"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T20:08:00.000" duration="11:18" equipmentType="777" mealService="D D D D D D D D D D D D D D D D D" origin="SVO" originDateTime="2020-09-20T16:50:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="X0" flightNumber="661" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="X0" flightNumber="661"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="10:30">
      <ns2:Segment destinationDateTime="2020-09-20T23:10:00.000-04:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T19:40:00.000+03:00" originTerminalId="D" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2020-10-24" duration="10:30" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O W S A F Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="JFK" country="US" state="NY" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4661" destination="JFK" destinationDateTime="2020-09-20T23:10:00.000" destinationTerminalId="1" duration="10:30" equipmentType="359" mealService="DSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDSDS" origin="SVO" originDateTime="2020-09-20T19:40:00.000" originTerminalId="D" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="122" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="122"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:55">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:35:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2020-10-24" duration="08:20" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M U H Q V W S T L K</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:35:00.000" destinationTerminalId="B" duration="08:20" equipmentType="764" mealService="M M M M M M M M M M M M M M M M M" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="LH" flightNumber="7963" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="13:00">
      <ns2:Segment destinationDateTime="2020-09-20T08:05:00.000+02:00" destinationTerminalId="" eTicket="true" originDateTime="2020-09-20T05:40:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="KQ  900" discontinueDate="2020-10-18" duration="03:25" effectiveDate="2020-09-06" stopQuantity="0">
          <ns2:DaysOfOperation fri="false" mon="false" sat="false" sun="true" thu="false" tue="false" wed="false"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M P U F K W H S L A Q T E N R V X G</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="KL"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1337" destination="AMS" destinationDateTime="2020-09-20T08:05:00.000" duration="03:25" equipmentType="73J" mealService="M M M M M M M M M M M M M M M M M M M M M M M M M M" origin="SVO" originDateTime="2020-09-20T05:40:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="KL" flightNumber="900" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="KL" flightNumber="900"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T11:40:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T09:15:00.000+02:00" originTerminalId="" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="AC 5751LH 7963" discontinueDate="2020-10-24" duration="08:25" effectiveDate="2020-03-29" groundTime="01:10" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="3649" destination="EWR" destinationDateTime="2020-09-20T11:40:00.000" destinationTerminalId="B" duration="08:25" equipmentType="764" mealService="B B B B B B B B B B B B B B B B B B B B" origin="AMS" originDateTime="2020-09-20T09:15:00.000" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="71" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="71"/>
        <ns2:Origin code="AMS" country="NL" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
    <ns2:Solution duration="12:45">
      <ns2:Segment destinationDateTime="2020-09-20T09:20:00.000+02:00" destinationTerminalId="1" eTicket="true" originDateTime="2020-09-20T07:30:00.000+03:00" originTerminalId="E" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" discontinueDate="2020-10-24" duration="02:50" effectiveDate="2020-03-29" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D I Z O Y B M U K H L X Q T E N R G V</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="SU"/>
        <ns2:DerivedInformation connectingSegment="false"/>
        <ns2:Destination code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
        <ns2:Leg airMiles="1040" destination="PRG" destinationDateTime="2020-09-20T09:20:00.000" destinationTerminalId="1" duration="02:50" equipmentType="73H" mealService="B B B B B B S S S S S S S S S S S S S S S" origin="SVO" originDateTime="2020-09-20T07:30:00.000" originTerminalId="E" smokingAllowed="false"/>
        <ns2:MarketingFlight code="SU" flightNumber="2010" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="SU" flightNumber="2010"/>
        <ns2:Origin code="SVO" country="RU" state="" timezoneOffset="+03:00"/>
      </ns2:Segment>
      <ns2:Segment destinationDateTime="2020-09-20T13:15:00.000-04:00" destinationTerminalId="B" eTicket="true" originDateTime="2020-09-20T10:10:00.000+02:00" originTerminalId="0" subjectToGovernmentApproval="false" trackingStatus="international-international">
        <ns2:AdditionalDetails charter="false" codeshareBlockDisplay="AC 3728LH 7705" discontinueDate="2020-10-01" duration="09:05" effectiveDate="2020-06-05" groundTime="00:50" stopQuantity="0">
          <ns2:DaysOfOperation fri="true" mon="true" sat="true" sun="true" thu="true" tue="true" wed="true"/>
          <ns2:ScheduledBookingClasses>J C D Z P Y B M E U H Q V W S T L K G N</ns2:ScheduledBookingClasses>
        </ns2:AdditionalDetails>
        <ns2:Disclosure code="UA"/>
        <ns2:DerivedInformation connectingSegment="true"/>
        <ns2:Destination code="EWR" country="US" state="NJ" timezoneOffset="-04:00"/>
        <ns2:Leg airMiles="4087" destination="EWR" destinationDateTime="2020-09-20T13:15:00.000" destinationTerminalId="B" duration="09:05" equipmentType="763" mealService="L L L L L L L L L L L L L L L L L L L L" origin="PRG" originDateTime="2020-09-20T10:10:00.000" originTerminalId="0" smokingAllowed="false"/>
        <ns2:MarketingFlight code="UA" flightNumber="187" isCallDirect="false" isCheckTariff="false"/>
        <ns2:OperatingFlight code="UA" flightNumber="187"/>
        <ns2:Origin code="PRG" country="CZ" state="" timezoneOffset="+02:00"/>
      </ns2:Segment>
    </ns2:Solution>
  </ns2:OriginAndDestination>
</ns2:AirSchedulesAndAvailabilityRS>
```
{{< /details >}}
