---
title: Получение текста правил тарифов
---

{{< toc >}}

## Введение

{{< hint warning >}}
Для получение текста правил тарифов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для получения текста правил тарифов по заданным параметрам тарифа используется сервис [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules).

В запросе необходимо указать:

- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/MarketingCarrier/@Code``` — код перевозчика, который зафайлировал тариф
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/OriginLocation/@LocationCode``` — пункт отправления для тарифа
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/DestinationLocation/@LocationCode``` — пункт прибытия для тарифа

{{< hint warning >}}
Обратите внимание на то, что пункты отправления и прибытия тарифа могут не совпадать с пунктами отправления и прибытия сегментов. См. ниже информацию о том как получить эти и другие данные для формирования запроса.
{{< /hint >}}

- ```/OTA_AirRulesRQ/RuleReqInfo/FareBasis/@Code``` — код тарифа

Для получения текста правил приватных тарифов также может потребоваться указание Account Code (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Account/Code```) или Corporate ID (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Corporate/ID```).

В случае необходимости получения только определенных категорий правил тарифа необходимо указать номера категорий пассажиров в последовательно расположенных элементах ```/OTA_AirRulesRQ/RuleReqInfo/Category```.

Сервис может работать в двух режимах:

#### Получение правил тарифов на текущую дату

Для получения правил тарифов на текущую дату (актуальных в данный момент) необходимо в запросе указать дату вылета в качестве значения атрибута ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/@DepartureDateTime```.

#### Получение правил тарифов на дату в прошлом

Для получения правил тарифов, которые были актуальны в прошлом (например, для уже оформленного билета), необходимо указать в запросе:
- ```/OTA_AirRulesRQ/OptionalQualifiers/TravelDateOptions/Historical/TicketingDate``` — дата оформления билета или выполнения расчета стоимости
- ```/OTA_AirRulesRQ/OptionalQualifiers/TravelDateOptions/Historical/TravelDate``` — дата вылета

## Пример

{{< details title="Пример запроса" >}}
```XML
<OTA_AirRulesRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <OriginDestinationInformation>
    <FlightSegment DepartureDateTime="12-01">
      <DestinationLocation LocationCode="LHR"/>
      <MarketingCarrier Code="EY"/>
      <OriginLocation LocationCode="SYD"/>
    </FlightSegment>
  </OriginDestinationInformation>
  <RuleReqInfo>
    <Category>16</Category>
    <FareBasis Code="YLWF2AU"/>
  </RuleReqInfo>
</OTA_AirRulesRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirRulesRS Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T12:43:16-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">RDSYDLHR01DECYLWF2AU-EY*16</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <FareRuleInfo>
    <Header>
      <Line Type="Legend">
        <Text>V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG</Text>
      </Line>
      <Line Type="Fare">
        <Text>1   YLWF2AU        Y R   168785     ----      -    -/12M EH01</Text>
      </Line>
      <Line Type="Passenger Type">
        <Text>PASSENGER TYPE-ADT                 AUTO PRICE-YES</Text>
      </Line>
      <Line Type="Origin Destination">
        <Text>FROM-SYD TO-LON    CXR-EY    TVL-01DEC22  RULE-AUGD IPREUAS/4</Text>
      </Line>
      <Line Type="Fare Basis">
        <Text>FARE BASIS-YLWF2AU           NORMAL FARE  DIS-N   VENDOR-ATP</Text>
      </Line>
      <Line Type="Fare Type">
        <Text>FARE TYPE-ER      RT-ECONOMY RESTRICTED</Text>
      </Line>
      <Line Type="Currency">
        <Text>AUD  4067.00  0113  E16MAY22 D-INFINITY   FC-YLWF2AU  FN-C1</Text>
      </Line>
      <Line Type="System Dates">
        <Text>SYSTEM DATES - CREATED 15MAY22/1009  EXPIRES INFINITY</Text>
      </Line>
      <ParsedData>
        <CurrencyLine>
          <Amount>4067.00</Amount>
          <CurrencyCode>AUD</CurrencyCode>
          <Discontinue>INFINITY</Discontinue>
          <Effective>2022-05-16</Effective>
          <FareClass>YLWF2AU</FareClass>
          <RoutingNumberOrMPM>0113</RoutingNumberOrMPM>
          <TariffDescriptionNumber>C1</TariffDescriptionNumber>
        </CurrencyLine>
        <FareBasisLine>
          <DisplayType Code="N"/>
          <FareBasis Code="YLWF2AU"/>
          <FareVendor>ATP</FareVendor>
          <Text>NORMAL FARE</Text>
        </FareBasisLine>
        <FareTypeLine>
          <FareDescription Code="RT">ECONOMY RESTRICTED</FareDescription>
          <FareType>ER</FareType>
        </FareTypeLine>
        <OriginDestinationLine>
          <Airline Code="EY"/>
          <DestinationLocation LocationCode="LON"/>
          <OriginLocation LocationCode="SYD"/>
          <Rule>AUGD</Rule>
          <TariffDescriptionNumber>IPREUAS/4</TariffDescriptionNumber>
          <TravelDate>2022-12-01</TravelDate>
        </OriginDestinationLine>
        <PassengerTypeLine>
          <AutoPrice>YES</AutoPrice>
          <PassengerType Code="ADT"/>
        </PassengerTypeLine>
        <SystemDatesLine>
          <CreateDateTime>2022-05-15T10:09</CreateDateTime>
          <ExpireDateTime>INFINITY</ExpireDateTime>
        </SystemDatesLine>
      </ParsedData>
    </Header>
    <Rules>
      <Paragraph RPH="16" Title="PENALTIES">
        <Text>*SPECIAL EMERGENCY RULES
*SUBJECT TO CHANGE AT ANYTIME
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
SEE FARE RULE FOR CANCELLATION/NO SHOW PENALTY
--------------------------------------------------
FOR TICKET ISSUED/REISSUED ON/BEFORE 31MAY22
ALL NEW TRAVEL TO BE COMPLETED ON/BEFORE 30SEP22.
CHANGES
ANY TIME
CHANGES PERMITTED FOR REISSUE/REVALIDATION.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
DIFFERENCE IN FARE MAY APPLY FOR FEW SCENARIOS.
FOR ANY COVID RELATED POLICY
INFORMATION AVAILABLE ON ETIHAD.COM/
DESTINATION GUIDE TO BE CONSIDERED AS THE SOURCE
FOR TRAVEL RESTRICTIONS/BANS.
GENERAL RULE - APPLY UNLESS OTHERWISE SPECIFIED
CHANGES
ANY TIME
CHANGES PERMITTED FOR REISSUE/REVALIDATION.
WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
DATE CHANGES FOR REISSUE/REVALIDATION ARE
PERMITTED AT FREE OF COST.
CHANGES RESULTING IN A DIFFERENT BOOKING CLASS/
SEASONALITY/ ROUTING OR TRAVEL VALIDITY WILL
REQUIRE A REISSUE AND ADDITIONAL FARE/TAX
DIFFERENCES MUST BE COLLECTED.
-----------------------------------------------
OFFICIAL DOCUMENTATION REQUIRED IN THE CASE OF
DEATH OF PASSENGER/FAMILY MEMBER
--------------------------------------------------
ONE DATE CHANGE PERMITTED FOC WHEN RETURN DATE
OUT OF RANGE.
RETURN DATE MUST BE SPECIFIED AT TIME OF ORIGINAL
BOOKING.
IF ORIGINAL RBD IS NOT AVAILABLE THEN ANY FARE
DIFFERENCE SHALL APPLY.
-------------------------------------------------
CANCELLATIONS
BEFORE DEPARTURE
CANCELLATIONS PERMITTED FOR CANCEL.
WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
OFFICIAL DOCUMENTATION REQUIRED IN THE CASE OF
DEATH OF PASSENGER/FAMILY MEMBER
--------------------------------------------------
IN CASES WHERE THE APPLICABLE PENALTIES ARE
HIGHER THAN THE SUM OF BASE FARE AND FUEL
SURCHARGE - ONLY THE BASE FARE AND FUEL SURCHARGE
TO BE RETAINED. GOVERNMENT TAXES AND AIRPORT
CHARGES TO BE REFUNDED IN FULL
--------------------------------------------------
FOR NON-REFUNDABLE TICKETS  - ONLY THE BASE FARE
AND FUEL SURCHARGE TO BE RETAINED. UNUTILIZED
GOVERNMENT TAXES AND AIRPORT CHARGES TO BE
REFUNDED IN FULL
--------------------------------------------------
TICKETS ISSUED 7 DAYS OR MORE PRIOR TO A FLIGHTS
SCHEDULED DEPARTURE CAN BE CANCELLED/REFUNDED
WITHOUT PENALTY UP TO 24 HOURS AFTER A TICKET IS
ISSUED.
--------------------------------------------------
AFTER DEPARTURE
CANCELLATIONS PERMITTED FOR CANCEL.
WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
DEDUCT APPLICABLE ONE WAY FARE FOR THE JOURNEY
TRAVELED.
--------------------------------------------------
OFFICIAL DOCUMENTATION REQUIRED IN THE CASE OF
DEATH OF PASSENGER/FAMILY MEMBER
--------------------------------------------------
IN CASES WHERE THE APPLICABLE PENALTIES ARE
HIGHER THAN THE SUM OF BASE FARE AND FUEL
SURCHARGE - ONLY THE BASE FARE AND FUEL SURCHARGE
TO BE RETAINED. GOVERNMENT TAXES AND AIRPORT
CHARGES TO BE REFUNDED IN FULL
--------------------------------------------------
FOR NON-REFUNDABLE TICKETS  - ONLY THE BASE FARE
AND FUEL SURCHARGE TO BE RETAINED. UNUTILIZED
GOVERNMENT TAXES AND AIRPORT CHARGES TO BE
REFUNDED IN FULL
CHANGES
ANY TIME
CHARGE AUD 300.00 FOR NO-SHOW.
WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
NO NOSHOW FEE APPLIES FOR AN INFANT NOT OCCUPYING
A SEAT
NOSHOW FEES ARE NOT WAIVED IN THE CASE OF ILLNESS
OF THE PASSENGER OR AN IMMEDIATE FAMILY MEMBER.
NOSHOW FEES ARE WAIVED IN THE CASE OF DEATH OF
THE PASSENGER OR AN IMMEDIATE FAMILY MEMBER OF
THE PASSENGER. A VALID DEATH CERTIFICATE OR COPY
THERE OF IS REQUIRED DULY EXECUTED BY THE
COMPETENT AUTHORITIES I.E. THOSE DESIGNATED TO
ISSUE DEATH CERTIFICATES UNDER APPLICABLE LAWS OF
THE COUNTRY CONCERNED IN THE COUNTRY IN WHICH THE
DEATH OCCURRED. IN THE CASE OF NOSHOW FEES AN
IMMEDIATE FAMILY MEMBER SHALL BE CONFINED TO THE
SPOUSE CHILD PARENT BROTHER OR SISTER OF THE
PASSENGER.
-----------------------------------------------
ONE DATE CHANGE PERMITTED FOC WHEN RETURN DATE
OUT OF RANGE.
RETURN DATE MUST BE SPECIFIED AT TIME OF ORIGINAL
BOOKING.
IF ORIGINAL RBD IS NOT AVAILABLE THEN ANY FARE
DIFFERENCE SHALL APPLY.
-------------------------------------------------
IF A NO SHOW TICKET IS PROCESSED FOR ANY
CHANGES/REFUND THEN THE PENALTIES OF
CHANGE /REFUND WITHIN 96 HOURS BEFORE
DEPARTURE OF A FLIGHT WILL BE APPLICABLE
IN ADDITION TO THE NO SHOW CHARGE.
CANCELLATIONS
ANY TIME
CHARGE AUD 300.00 FOR NO-SHOW.
WAIVED FOR DEATH OF PASSENGER OR FAMILY MEMBER.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
NO NOSHOW FEE APPLIES FOR AN INFANT NOT OCCUPYING
A SEAT
NOSHOW FEES ARE NOT WAIVED IN THE CASE OF ILLNESS
OF THE PASSENGER OR AN IMMEDIATE FAMILY MEMBER.
NOSHOW FEES ARE WAIVED IN THE CASE OF DEATH OF
THE PASSENGER OR AN IMMEDIATE FAMILY MEMBER OF
THE PASSENGER. A VALID DEATH CERTIFICATE OR COPY
THERE OF IS REQUIRED DULY EXECUTED BY THE
COMPETENT AUTHORITIES I.E. THOSE DESIGNATED TO
ISSUE DEATH CERTIFICATES UNDER APPLICABLE LAWS OF
THE COUNTRY CONCERNED IN THE COUNTRY IN WHICH THE
DEATH OCCURRED. IN THE CASE OF NOSHOW FEES AN
IMMEDIATE FAMILY MEMBER SHALL BE CONFINED TO THE
SPOUSE CHILD PARENT BROTHER OR SISTER OF THE
PASSENGER.
-------------------------------------------------
IF A NO SHOW TICKET IS PROCESSED FOR ANY
CHANGES/REFUND THEN THE PENALTIES OF
CHANGE /REFUND WITHIN 96 HOURS BEFORE
DEPARTURE OF A FLIGHT WILL BE APPLICABLE
IN ADDITION TO THE NO SHOW CHARGE.
--------------------------------------------------
OFFICIAL DOCUMENTATION REQUIRED IN THE CASE OF
DEATH OF PASSENGER/FAMILY MEMBER
--------------------------------------------------
IN CASES WHERE THE APPLICABLE PENALTIES ARE
HIGHER THAN THE SUM OF BASE FARE AND FUEL
SURCHARGE - ONLY THE BASE FARE AND FUEL SURCHARGE
TO BE RETAINED. GOVERNMENT TAXES AND AIRPORT
CHARGES TO BE REFUNDED IN FULL
--------------------------------------------------
FOR NON-REFUNDABLE TICKETS  - ONLY THE BASE FARE
AND FUEL SURCHARGE TO BE RETAINED. UNUTILIZED
GOVERNMENT TAXES AND AIRPORT CHARGES TO BE
REFUNDED IN FULL
.</Text>
      </Paragraph>
    </Rules>
  </FareRuleInfo>
</OTA_AirRulesRS>
```
{{< /details >}}

## Выбор тарифа из списка дубликатов

В некоторых случаях перевозчики могут иметь несколько тарифов с одинаковым кодом, пунктом отправления, пунктом прибытия и датой вылета. В этом случае при попытке запросить текст правил тарифа при помощи сервиса [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules) ответ будет содержать элемент ```/OTA_AirRulesRS/DuplicateFareInfo``` с перечислением дубликатов тарифов:

{{< details title="Пример ответа с перечислением дубликатов тарифов" >}}
```XML
<OTA_AirRulesRS Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-03T14:16:11-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">RDSVXKRR04APRNVOR-SU*16</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <DuplicateFareInfo>
    <Text>SVX-KRR       CXR-SU       WED 04APR18                     RUB
    THE FOLLOWING CARRIERS ALSO PUBLISH FARES SVX-KRR:
    7R AA AC AF AM AR AY AZ BA BD CI CO CX CZ DL EK EY FV FZ GA HU
    IB JJ JL KE KL KQ LA LH LO LX ME MF NN NW OK OS OU QR R2 R3 RO
    S7 SN SQ SV TG TK U6 UA UN UT UX VN VV XF
    //SEE FQHELP FOR INFORMATION ABOUT THE NEW FARE DISPLAYS//
    ALL FEES/TAXES/SVC CHARGES INCLUDED WHEN ITINERARY PRICED
    SURCHARGE FOR PAPER TICKET MAY BE ADDED WHEN ITIN PRICED
    SU-SUK/SAVER-ES - ECONOMY SAVER
    V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG
    1   NVOR           N O     3000     ----      -/  -/165   15
    2   NVOR           N O     6000     ----      -/  -/165   65
    *** THERE ARE NO YY REQUESTED FARES PUBLISHED SVX-KRR ***
    15*  1. SVX-AER-KRR
    2. SVX-LED-KRR
    3. SVX-MOW-KRR
    4. SVX-KRR
    65*  TRAVEL MUST BE DIRECT</Text>
  </DuplicateFareInfo>
</OTA_AirRulesRS>
```
{{< /details >}}

Для выбора одного из предложенных тарифов необходимо повторно отправить запрос к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules), указав номер тарифа из списка в качестве значения атрибута ```/OTA_AirRulesRQ/RuleReqInfo/@RPH```.

В случае необходимости получения только определенных категорий правил тарифа необходимо указать номера категорий пассажиров в последовательно расположенных элементах ```/OTA_AirRulesRQ/RuleReqInfo/Category```.

{{< details title="Пример запроса" >}}
```XML
<OTA_AirRulesRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <RuleReqInfo RPH="1">
    <Category>16</Category>
  </RuleReqInfo>
</OTA_AirRulesRQ>
```
{{< /details >}}

## Алгоритм получения данных для составления запроса

Для получения текста правил тарифов для всех сегментов на маршруте, необходимо составить список компонентов тарифов (fare component) в расчете стоимости для рекомендации из результатов поиска или в PQ для уже созданного бронирования, проассоциировать их с сегментами и для каждого компонента тарифа запросить текст правил при помощи сервиса [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules).

Ниже представлены алгоритмы получения данных для различных сервисов.

### Алгоритм получения данных из ответа сервисов BargainFinderMaxRQ, BargainFinderMax_ADRQ и RevalidateItinRQ (OTA ответ)

[OTA ответ](shop.html#вид-ответа) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) содержит информацию обо всех примененных тарифах в последовательно расположенных элементах ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode```. Каждый элемент будет соответствовать одному сегменту в маршруте (элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItinerary/OriginDestinationOptions/OriginDestinationOption/FlightSegment```).

Правила тарифов необходимо запрашивать для каждого компонента тарифа (fare component). Каждый компонент тарифа может соответствовать одному или нескольким сегментам. Например, в следующем примере есть два компонента тарифа (представлен элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes```):

{{< details title="Пример" open=true >}}
```XML
<FareBasisCodes>
  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="E" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="JFK" FareComponentFareRule="ESA1" FareComponentFareTariff="1" FareComponentFareType="XPX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">EVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="JFK" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="SVO" GovCarrier="SU">EVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="JFK" FareComponentBeginAirport="JFK" FareComponentDirectionality="TO" FareComponentEndAirport="AER" FareComponentFareRule="ESA1" FareComponentFareTariff="1" FareComponentFareType="XPX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NVULA</FareBasisCode>
</FareBasisCodes>
```
{{< /details >}}

Определить компонент тарифа можно по наличию атрибута ```/@FareComponentDirectionality```. Те элементы ```/FareBasisCode``` (и соответствующие им сегменты), что не имеют атрибутов ```/@FareComponentDirectionality```, относятся к предыдущему компоненту тарифа. В приведенном выше примере первый и второй сегмент относятся к первому компоненту тарифа, а третий и четвертый сегмент — ко второму компоненту тарифа.

Запрос к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules) для каждого компонента тарифа должен содержать следующую информацию из [OTA ответа](shop.html#вид-ответа) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) (путь указан относительно элемента ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes```):
- код перевозчика, который зафайлировал тариф — ```/FareBasisCode/@GovCarrier```
- пункт отправления для тарифа — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/FareBasisCode/@FareComponentBeginAirport```
    - значение ```TO```: ```/FareBasisCode/@FareComponentEndAirport```
- пункт прибытия для тарифа — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/FareBasisCode/@FareComponentEndAirport```
    - значение ```TO```: ```/FareBasisCode/@FareComponentBeginAirport```
- дата вылета — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItinerary/OriginDestinationOptions/OriginDestinationOption/FlightSegment/@DepartureDateTime```
    - значение ```TO```: дата вылета предыдущего компонента тарифа, у которого:
        - город, к которому относится пункт отправления (```/@FareComponentBeginAirport```), равен городу, к которому относится пункт прибытия (```/@FareComponentEndAirport```) текущего компонента тарифа
        - город, к которому относится пункт прибытия (```/@FareComponentEndAirport```), равен городу, к которому относится пункт отправления (```/@FareComponentBeginAirport```) текущего компонента тарифа
- код тарифа — ```/FareBasisCode```

В представленном выше примере у обоих компонентов тарифов будет дата вылета первого сегмента на маршруте, т.к. у второго компонента тарифа значение атрибута ```/FareBasisCode/@FareComponentDirectionality``` равно ```TO```.

#### Пример

{{< details title="Ответ RevalidateItinRQ" >}}
```XML
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="1" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="5.2.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="1020644705884425218" Type="WORKERTHREAD"/>
    <Warning Code="ASECT2LAPP00651.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27040" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24113" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24111" Type="DEFAULT"/>
  </Warnings>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-01T06:25:00" DepartureDateTime="2020-09-01T05:00:00" ElapsedTime="85" FlightNumber="35" ResBookDesigCode="Y" StopQuantity="0">
              <DepartureAirport LocationCode="LED" TerminalID="1"/>
              <ArrivalAirport LocationCode="SVO" TerminalID="B"/>
              <OperatingAirline Code="SU" FlightNumber="35"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="372"/>
              </TPA_Extensions>
            </FlightSegment>
            <FlightSegment ArrivalDateTime="2020-09-01T10:15:00" DepartureDateTime="2020-09-01T07:45:00" ElapsedTime="150" FlightNumber="1138" ResBookDesigCode="Y" StopQuantity="0">
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
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="315">
            <FlightSegment ArrivalDateTime="2020-09-08T09:20:00" DepartureDateTime="2020-09-08T06:50:00" ElapsedTime="150" FlightNumber="1141" ResBookDesigCode="B" StopQuantity="0">
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
            <FlightSegment ArrivalDateTime="2020-09-08T12:05:00" DepartureDateTime="2020-09-08T10:40:00" ElapsedTime="85" FlightNumber="14" ResBookDesigCode="B" StopQuantity="0">
              <DepartureAirport LocationCode="SVO" TerminalID="B"/>
              <ArrivalAirport LocationCode="LED" TerminalID="1"/>
              <OperatingAirline Code="SU" FlightNumber="14"/>
              <Equipment AirEquipType="32A"/>
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
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-08-26" PricingSource="WPNI1_ITIN" PricingSubSource="MIP" Revalidated="true">
        <ItinTotalFare>
          <BaseFare Amount="62800" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="62800" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="62800" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="12006" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="74806" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="Y" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="Y" DepartureAirportCode="SVO" GovCarrier="SU">YNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="SVO" BookingCode="B" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="LED" FareComponentFareRule="ENR1" FareComponentFareTariff="304" FareComponentFareType="SB" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">BNBR</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="B" DepartureAirportCode="SVO" GovCarrier="SU">BNBR</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="62800" CurrencyCode="RUB"/>
              <FareConstruction Amount="62800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="62800" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2700" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2700" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2700" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2700" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="115" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="115" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="184" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="10800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="1206" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="12006" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="74806" CurrencyCode="RUB"/>
              <TPA_Extensions>
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
              <FareCalcLine Info="LED SU X/MOW SU AER34300SU X/MOW SU LED28500RUB62800END"/>
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
                <FareReference>B</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="S"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>B</FareReference>
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
            <FareReference>B</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>B</FareReference>
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
```
{{< /details >}}

Данные для запроса правил тарифов:

| **Код перевозчика, который зафайлировал тариф** | **Пункт отправления для тарифа** | **Пункт прибытия для тарифа** | **Дата вылета** | **Код тарифа** |
|----|-----|-----|------------|------|
| SU | LED | AER | 2020-09-01 | YNBR |
| SU | LED | AER | 2020-09-01 | BNBR |

### Алгоритм получения данных из ответа сервисов BargainFinderMaxRQ, BargainFinderMax_ADRQ и RevalidateItinRQ (GIR ответ)

Алгоритм получения данных из [GIR ответа](shop.html#вид-ответа) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) содержит информацию обо всех компонентах тарифов в последовательно расположенных элементах ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent```. Этот элемент имеет дочерние элементы ```/Segment``` для связи компонентов тарифов с сегментами на маршруте (элементы ```/Segment``` указаны последовательно в том же порядке, как и в маршруте).

Описание каждого компонента тарифа доступно в ```/GroupedItineraryResponse/FareComponentDesc``` (у которого ```/GroupedItineraryResponse/FareComponentDesc/@ID``` равен ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent/@Ref```).

Запрос к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules) для каждого компонента тарифа должен содержать следующую информацию из [GIR ответа](shop.html#вид-ответа) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary):
- код перевозчика, который зафайлировал тариф — ```/GroupedItineraryResponse/FareComponentDesc/@GoverningCarrier```
- пункт отправления для тарифа — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: пункт отправления для первого сегмента для выбранного компонента тарифа
    - значение ```TO```: пункт прибытия для последнего сегмента для выбранного компонента тарифа
- пункт прибытия для тарифа — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: пункт прибытия для последнего сегмента для выбранного компонента тарифа
    - значение ```TO```: пункт отправления для первого сегмента для выбранного компонента тарифа
- дата вылета — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: дата вылета для первого сегмента для выбранного компонента тарифа
    - значение ```TO```: дата вылета предыдущего компонента тарифа, у которого:
        - город, к которому относится пункт отправления, равен городу, к которому относится пункт прибытия текущего компонента тарифа
        - город, к которому относится пункт прибытия, равен городу, к которому относится пункт отправления текущего компонента тарифа
- код тарифа — ```/GroupedItineraryResponse/FareComponentDesc/@FareBasisCode```


#### Пример

{{< details title="Ответ RevalidateItinRQ" >}}
```XML
<GroupedItineraryResponse Version="5.2.0" xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Message Code="TRANSACTIONID" Severity="Info" Text="1020606814840800114" Type="WORKERTHREAD"/>
  <Message Code="ASECT2LAPP00607.IDM.SGDCPROD.SABRE.COM" Severity="Info" Text="27035" Type="SERVER"/>
  <Message Code="RULEID" Severity="Info" Text="24113" Type="DRE"/>
  <Message Code="RULEID" Severity="Info" Text="24111" Type="DEFAULT"/>
  <Statistics Itineraries="1"/>
  <ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="1" Stops="0" TotalMilesFlown="873">
    <Departure Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="07:45:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="10:15:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="1138" Operating="SU" OperatingFlightNumber="1138">
      <Equipment Code="73H" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="2" Stops="0" TotalMilesFlown="873">
    <Departure Airport="AER" City="AER" Country="RU" Time="06:50:00+03:00"/>
    <Arrival Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="09:20:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="1141" Operating="SU" OperatingFlightNumber="1141">
      <Equipment Code="32A" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="3" Stops="0" TotalMilesFlown="372">
    <Departure Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="10:40:00+03:00"/>
    <Arrival Airport="LED" City="LED" Country="RU" Terminal="1" Time="12:05:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="14" Operating="SU" OperatingFlightNumber="14">
      <Equipment Code="32A" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="4" Stops="0" TotalMilesFlown="372">
    <Departure Airport="LED" City="LED" Country="RU" Terminal="1" Time="05:00:00+03:00"/>
    <Arrival Airport="SVO" City="MOW" Country="RU" Terminal="B" Time="06:25:00+03:00"/>
    <Carrier Marketing="SU" MarketingFlightNumber="35" Operating="SU" OperatingFlightNumber="35">
      <Equipment Code="32A" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <TaxDesc Amount="120" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="1" PublishedAmount="120" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="2700" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="2" PublishedAmount="2700" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="2700" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="3" PublishedAmount="2700" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="2700" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="4" PublishedAmount="2700" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="184" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="5" PublishedAmount="184" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="184" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="6" PublishedAmount="184" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="115" Code="RI4" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" ID="7" PublishedAmount="115" PublishedCurrency="RUB" Station="SVO"/>
  <TaxDesc Amount="120" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="8" PublishedAmount="120" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc Amount="115" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="9" PublishedAmount="115" PublishedCurrency="RUB" Station="LED"/>
  <TaxDesc Amount="184" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="10" PublishedAmount="184" PublishedCurrency="RUB" Station="SVO"/>
  <TaxSummaryDesc Amount="10800" Code="YQF" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" ID="1" PublishedAmount="2700" PublishedCurrency="RUB" Station="LED"/>
  <TaxSummaryDesc Amount="1206" Code="RI3" Country="RU" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" ID="2" PublishedAmount="115" PublishedCurrency="RUB" Station="LED"/>
  <FareComponentDesc ApplicablePricingCategories="10 16" Direction="EH" Directionality="FROM" FareAmount="34300" FareBasisCode="YNBR" FareCurrency="RUB" FarePassengerType="ADT" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="00" GoverningCarrier="SU" ID="1" NotValidAfter="2020-09-01" NotValidBefore="2020-09-01" PublishedFareAmount="68600" VendorCode="ATP">
    <Segment/>
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ApplicablePricingCategories="10 16" Direction="EH" Directionality="TO" FareAmount="28500" FareBasisCode="BNBR" FareCurrency="RUB" FarePassengerType="ADT" FareRule="ENR1" FareTariff="304" FareType="SB" FareTypeBitmap="00" GoverningCarrier="SU" ID="2" NotValidAfter="2020-09-08" NotValidBefore="2020-09-08" PublishedFareAmount="57000" VendorCode="ATP">
    <Segment/>
    <Segment/>
  </FareComponentDesc>
  <ValidatingCarrierDesc ID="1" NewVcxProcess="true" SettlementMethod="RUT">
    <Default Code="SU"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" NewVcxProcess="true" SettlementMethod="BSP">
    <Default Code="SU"/>
  </ValidatingCarrierDesc>
  <BaggageAllowanceDesc ID="1" Pieces="0"/>
  <LegDesc ID="1">
    <Schedule Ref="2"/>
    <Schedule Ref="3"/>
  </LegDesc>
  <LegDesc ID="2">
    <Schedule Ref="4"/>
    <Schedule Ref="1"/>
  </LegDesc>
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription ArrivalLocation="AER" DepartureDate="2020-09-01" DepartureLocation="LED"/>
      <LegDescription ArrivalLocation="LED" DepartureDate="2020-09-08" DepartureLocation="AER"/>
    </GroupDescription>
    <Itinerary CurrentItinerary="true" ID="1" PricingSource="WPNI1_ITIN">
      <Leg Ref="2"/>
      <Leg Ref="1"/>
      <PricingInformation PricingSubsource="MIP" Revalidated="true">
        <Fare ETicketable="true" GoverningCarriers="SU SU" LastTicketDate="2020-08-26" VITA="true" ValidatingCarrierCode="SU">
          <PassengerInfo NonRefundable="true" PassengerNumber="1" PassengerType="ADT">
            <FareComponent Ref="1">
              <Segment BookingCode="Y" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="Y" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
            </FareComponent>
            <FareComponent Ref="2">
              <Segment BookingCode="B" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
              <Segment AvailabilityBreak="true" BookingCode="B" CabinCode="Y" MealCode="S" SeatsAvailable="9"/>
            </FareComponent>
            <Tax Ref="4"/>
            <Tax Ref="3"/>
            <Tax Ref="2"/>
            <Tax Ref="3"/>
            <Tax Ref="9"/>
            <Tax Ref="10"/>
            <Tax Ref="8"/>
            <Tax Ref="10"/>
            <Tax Ref="7"/>
            <Tax Ref="5"/>
            <Tax Ref="1"/>
            <Tax Ref="6"/>
            <TaxSummary Ref="1"/>
            <TaxSummary Ref="2"/>
            <CurrencyConversion ExchangeRateUsed="1" From="RUB" To="RUB"/>
            <FareMessage Carrier="SU" Code="0" Info="NONREF/HEBO3BPATEH" Type="N"/>
            <FareMessage Code="0" Info="VALIDATING CARRIER" Type="W"/>
            <FareMessage Code="0" Info="BSP - SU" Type="W"/>
            <FareMessage Code="0" Info="RUT - SU" Type="W"/>
            <PassengerTotalFare BaseFareAmount="62800" BaseFareCurrency="RUB" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="62800" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="62800" EquivalentCurrency="RUB" ExchangeRateOne="64.4000000" TotalFare="74806" TotalTaxes="12006"/>
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
          </PassengerInfo>
          <TotalFare BaseFareAmount="62800" BaseFareCurrency="RUB" ConstructionAmount="62800" ConstructionCurrency="RUB" Currency="RUB" EquivalentAmount="62800" EquivalentCurrency="RUB" TotalPrice="74806" TotalTaxes="12006"/>
          <ValidatingCarrier Ref="2"/>
          <ValidatingCarrier Ref="1"/>
        </Fare>
      </PricingInformation>
    </Itinerary>
  </ItineraryGroup>
</GroupedItineraryResponse>
```
{{< /details >}}

Данные для запроса правил тарифов:

| **Код перевозчика, который зафайлировал тариф** | **Пункт отправления для тарифа** | **Пункт прибытия для тарифа** | **Дата вылета** | **Код тарифа** |
|----|-----|-----|------------|------|
| SU | LED | AER | 2020-09-01 | YNBR |
| SU | LED | AER | 2020-09-01 | BNBR |

### Алгоритм получения данных из ответа сервиса TravelItineraryReadRQ

Ответ сервиса [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) содержит информацию обо всех компонентах тарифов для всех созданных PQ в элементах ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdown/FareComponent```.

- Код перевозчика, который зафайлировал тариф — ```/@GoverningCarrier```
- Пункт отправления для тарифа — ```/Location/@Origin``` (если атрибут ```/@FareDirectionality``` имеет значение ```FROM```) или ```/Location/@Destination``` (если атрибут ```/@FareDirectionality``` имеет значение ```TO```)
- Пункт прибытия для тарифа — ```/Location/@Destination``` (если атрибут ```/@FareDirectionality``` имеет значение ```FROM```) или ```/Location/@Origin``` (если атрибут ```/@FareDirectionality``` имеет значение ```TO```)
- Дата вылета — ```/Dates/@DepartureDateTime```
- Код тарифа — ```/@FareBasisCode```
