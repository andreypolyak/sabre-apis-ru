# Получение текста правил тарифов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

*Для получение текста правил тарифов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для получения текста правил тарифов по заданным параметрам тарифа используется сервис [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules).

В запросе необходимо указать:

- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/MarketingCarrier/@Code``` — код перевозчика, который зафайлировал тариф
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/OriginLocation/@LocationCode``` — пункт отправления для тарифа
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/DestinationLocation/@LocationCode``` — пункт прибытия для тарифа

*Обратите внимание на то, что пункты отправления и прибытия тарифа могут не совпадать с пунктами отправления и прибытия сегментов. О том, как получить эти и другие данные для формирования запроса см. ниже.*

- ```/OTA_AirRulesRQ/RuleReqInfo/FareBasis/@Code``` — код тарифа

Для получения текста правил приватных тарифов также может потребоваться указание Account Code (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Account/Code```) или Corporate ID (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Corporate/ID```).

В случае необходимости получения только определенных категорий правил тарифа необходимо указать номера категорий пассажиров в последовательно расположенных элементах ```/OTA_AirRulesRQ/RuleReqInfo/Category```.

Сервис может работать в двух режимах:

**Получение правил тарифов на текущую дату**

Для получения правил тарифов на текущую дату (актуальных в данный момент) необходимо в запросе указать дату вылета в качестве значения атрибута ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/@DepartureDateTime```.

**Получение правил тарифов на дату в прошлом**

Для получения правил тарифов, которые были актуальны в прошлом (например, для уже оформленного билета), необходимо указать в запросе:
- ```/OTA_AirRulesRQ/OptionalQualifiers/TravelDateOptions/Historical/TicketingDate``` — дата оформления билета или выполнения расчета стоимости
- ```/OTA_AirRulesRQ/OptionalQualifiers/TravelDateOptions/Historical/TravelDate``` — дата вылета

## Пример

{% xmlsec "Пример запроса", false %}
<OTA_AirRulesRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <OriginDestinationInformation>
    <FlightSegment DepartureDateTime="09-01">
      <DestinationLocation LocationCode="AER"/>
      <MarketingCarrier Code="SU"/>
      <OriginLocation LocationCode="LED"/>
    </FlightSegment>
  </OriginDestinationInformation>
  <RuleReqInfo>
    <Category>16</Category>
    <FareBasis Code="YNBR"/>
  </RuleReqInfo>
</OTA_AirRulesRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirRulesRS Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-30T11:41:49-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">RDLEDAER01SEPYNBR-SU*16</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <FareRuleInfo>
    <Header>
      <Line Type="Legend">
        <Text>V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG</Text>
      </Line>
      <Line Type="Fare">
        <Text>1   YNBR           Y R    68600 E21MY         -/  -/365   15</Text>
      </Line>
      <Line Type="Passenger Type">
        <Text>PASSENGER TYPE-ADT                 AUTO PRICE-YES</Text>
      </Line>
      <Line Type="Origin Destination">
        <Text>FROM-LED TO-AER    CXR-SU    TVL-01SEP20  RULE-ENR1 IPREURD/304</Text>
      </Line>
      <Line Type="Fare Basis">
        <Text>FARE BASIS-YNBR              SPECIAL FARE  DIS-E   VENDOR-ATP</Text>
      </Line>
      <Line Type="Fare Type">
        <Text>FARE TYPE-SB      RT-BUDGET FARE</Text>
      </Line>
      <Line Type="Currency">
        <Text>RUB    68600  0015  E21MAY20 D-INFINITY   FC-YNBR  FN-16</Text>
      </Line>
      <Line Type="System Dates">
        <Text>SYSTEM DATES - CREATED 05SEP19/0923  EXPIRES INFINITY</Text>
      </Line>
      <ParsedData>
        <CurrencyLine>
          <Amount>68600</Amount>
          <CurrencyCode>RUB</CurrencyCode>
          <Discontinue>INFINITY</Discontinue>
          <Effective>2020-05-21</Effective>
          <FareClass>YNBR</FareClass>
          <RoutingNumberOrMPM>0015</RoutingNumberOrMPM>
          <TariffDescriptionNumber>16</TariffDescriptionNumber>
        </CurrencyLine>
        <FareBasisLine>
          <DisplayType Code="E"/>
          <FareBasis Code="YNBR"/>
          <FareVendor>ATP</FareVendor>
          <Text>SPECIAL FARE</Text>
        </FareBasisLine>
        <FareTypeLine>
          <FareDescription Code="RT">BUDGET FARE</FareDescription>
          <FareType>SB</FareType>
        </FareTypeLine>
        <OriginDestinationLine>
          <Airline Code="SU"/>
          <DestinationLocation LocationCode="AER"/>
          <OriginLocation LocationCode="LED"/>
          <Rule>ENR1</Rule>
          <TariffDescriptionNumber>IPREURD/304</TariffDescriptionNumber>
          <TravelDate>2020-09-01</TravelDate>
        </OriginDestinationLine>
        <PassengerTypeLine>
          <AutoPrice>YES</AutoPrice>
          <PassengerType Code="ADT"/>
        </PassengerTypeLine>
        <SystemDatesLine>
          <CreateDateTime>2019-09-05T09:23</CreateDateTime>
          <ExpireDateTime>INFINITY</ExpireDateTime>
        </SystemDatesLine>
      </ParsedData>
    </Header>
    <Rules>
      <Paragraph RPH="16" Title="PENALTIES">
        <Text>FARE RULE
CANCELLATIONS
ANY TIME
TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/NO-SHOW/
REFUND.
CHANGES
ANY TIME
CHARGE RUB 2600 FOR REISSUE/REVALIDATION.
CHANGES NOT PERMITTED IN CASE OF NO-SHOW.
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
NOT LATER THAN 30 MINUTES AFTER DEPARTURE OF THE
ORIGINALLY SCHEDULED FLIGHT.
---
CHANGE PERMITTED WITHIN SAME BRAND LITE - FARES
WITH PREFIX -NB/-NO.
IF CHANGE IS MADE FOR TOTALY UNUSED TICKET BRAND
LITE CAN BE EXCHANGED TO BRAND BUDGET/SAVER -
FARES WITH PREFIX -VU/-VO.
//
1.WHEN THE FIRST TICKETED FLIGHT COUPON IS
CHANGED - THE ENTIRE TICKET MUST BE RE-PRICED
USING -CURRENT- FARES IN EFFECT ON THE DATE OF NEW
TICKET ISSUANCE.
---
NEW FARE AMOUNT SHOULD BE EQUAL OR HIGHER THAN
PREVIOUS AMOUNT.
---
ANY DIFFERENCE IN FARES PLUS CHANGE FEE MUST BE
COLLECTED.
---
ALL RULE PROVISIONS OF THE NEW FARE INCLUDING
ADVANCE PURCHASE/MIN STAY/MAX STAY/
SEASONALITY/ETC MUST BE MET.
---
2. WHEN CHANGES ARE MADE TO OTHER THAN THE FIRST
TICKETED FLIGHT COUPON - THE ENTIRE TICKET MUST
BE RE-PRICED USING -HISTORICAL- FARES IN EFFECT
ON THE DATE OF ORIGINAL TICKET ISSUE.
---
NEW FARE AMOUNT SHOULD BE EQUAL OR HIGHER THAN
PREVIOUS AMOUNT.
---
ANY DIFFERENCE IN FARES PLUS CHANGE FEE MUST BE
COLLECTED.
---
ALL RULE PROVISIONS OF THE NEW FARE INCLUDING
ADVANCE PURCHASE/MIN STAY/MAX STAY/
SEASONALITY/ETC MUST BE MET.
GENERAL RULE - APPLY UNLESS OTHERWISE SPECIFIED
NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
// CANCELLATION PROVISIONS //
---
CHARGE APPLY PER TRANSACTION.
CHILD DISCOUNT DOES NOT APPLY.
INFANT WITHOUT A SEAT FREE OF CHARGE.
---
RULES FOR CANCELLATION APPLY BY PRICING UNIT.
ONLY FARE IN SAME BRAND CAN BE USED FOR REFUND
PROCEDURE OF PARTLY USED TICKET.
FARES DIVIDED INTO BRANDS BY FOLLOWING -
PROMO - FARES WITH PREFIX -SX/-SO
BUDGET/SAVER - FARES WITH PREFIX -VU/-VO/
OPTIMUM/CLASSIC - FARES WITH PREFIX -CL/-CO
MAXIMUM/FLEX - FARES WITH PREFIX -FM/-FO
//
WHEN COMBINING ON A HALF ROUNDTRIP BASIS THE MOST
RESTRICTIVE CANCELLATION CONDITIONS APPLIES FOR
THE ENTIRE PRICING UNIT.
---
PENALTIES WAIVED IN CASE OF INVOLUNTARY REFUND.
CONTACT CARRIER FOR DETAILS.
---
IF REFUND PERMITTED FLIGHTS SEGMENTS MUST BE
CANCELLED NO LATER THAN CHECK-IN CLOSE TIME.
IN SUCH CASE A REFUND MAY BE REQUESTED DURING
TICKET VALIDITY PERIOD.
OTHERWISE NO-SHOW PROVISIONS APPLY.
---
VOLUNTARY REFUND OF UNUSED FEES AND TAXES
PERMITTED DURING TICKET VALIDITY PERIOD.
EXCEPT-
FOR TICKETS THAT HAVE NO REFUND VALUE AT THE
MOMENT OF TICKET ISSUE /WHERE FARE IS NON-
REFUNDABLE ANY TIME/. IN THIS CASE YQ/YR
SURCHARGES ARE ALSO NON-REFUNDABLE.
---
FOR TICKETS THAT HAVE NO REFUND VALUE AT THE
MOMENT OF TICKET ISSUE /WHERE FARE IS NON-
REFUNDABLE ANY TIME/IN CASE OF NO-SHOW ALL OTHERS
TAXES AND SURCHARGES ARE ALSO NON-REFUNDABLE.
---
PERIOD VALIDITY FOR SPECIAL FARE WILL BE FARE MAX
STAY FROM THE DATE ON THE FIRST FLIGHT COUPON.
---
IN CASE OF CANCELLATION AFTER DEPARTURE REFUND
THE DIFFERENCE BETWEEN THE FARE PAID AND THE
APPLICABLE FARE FLOWN. REFUND FEE APPLIES.
WHEN RECALCULATING FARES FOR TRANSPORTATION USED
FARES IN LOWER RBD THAN SHOWN IN USED COUPONS
CANNOT APPLY.
---
FOR EACH USED PORTION OF 9B WITHIN GERMANY 35EUR
FOR ECONOMY AND 65EUR FOR BUSINESS CLASS OF
SERVICE SHOULD BE RETAINED FOR PARTLY USED TICKET.
ALL OTHER CHARGES SHOULD BE COLLECTED BASED UPON
THE RULE AND FARE USED.
---
ANY APPLICABLE FARE OF OTHER AIRLINE
WHOSE PORTION HAD BEEN USED MAY BE APPLIED FOR
REFUND PROCEDURE OF PARTLY USED TICKET ISSUED IN
BRAND OPTIMUM/CLASSIC - FARES WITH PREFIX -CL/-CO.
REFUND CAN ONLY BE MADE THROUGH ISSUING OFFICE.
---

// CHANGES PROVISIONS //

---
CHARGE APPLY PER TRANSACTION.
CHILD DISCOUNT DOES NOT APPLY.
INFANT WITHOUT A SEAT FREE OF CHARGE.
CHANGE PERMITTED ONLY WITHIN SAME BRAND.
//EXCEPTION -
IF CHANGE IS MADE FOR TOTALY UNUSED TICKET BRAND
LITE CAN BE EXCHANGED TO BRAND SAVER AND BRAND
SAVER CAN BE EXCHANGED TO BRAND LITE//
FARES DIVIDED INTO BRANDS BY FOLLOWING -
PROMO - FARES WITH PREFIX -SX/-SO
LITE - FARES WITH PREFIX -NB/-NO
BUDGET/SAVER - FARES WITH PREFIX -VU/-VO/-PX
OPTIMUM/CLASSIC - FARES WITH PREFIX -CL/-CO
MAXIMUM/FLEX - FARES WITH PREFIX -FM/-FO
//
---
CHANGE IS A ROUTING/DATE/FLIGHT/BOOKING CLASS/FARE
MODIFICATION.
---
RULES FOR CHANGES APPLY BY FARE
COMPONENT/DIRECTION.
IN CASE OF COMBINATION CHARGE THE HIGHEST FEE OF
ALL CHANGED FARE COMPONENTS.
---
WHENEVER A NONREFUNDABLE FARE TICKET IS REISSUED
A NONREFUNDABLE NOTATION MUST BE MADE IN THE
ENDORSEMENT BOX OF THE NEW TICKET.
THE ORIGINAL NONREFUNDABLE VALUE REMAINS
NONREFUNDABLE FOR ANY SUBSEQUENT REISSUES.
---
NEW RESERVATION AND REISSUANCE MUST BE MADE NOT
LATER THAN 30 MINUTES AFTER DEPARTURE OF THE
ORIGINALLY SCHEDULED FLIGHT.
OTHERWISE REFER TO REFUND RULES.
EXCEPTION - FOR FARES WHICH ALLOW TO MAKE CHANGES
IN CASE OF NO-SHOW REISSUE LATER THAN 30 MINUTES
AFTER DEPARTURE OF THE
ORIGINALLY SCHEDULED FLIGHT PERMITTED WITHIN
TICKET VALIDITY PERIOD UNDER THE SAME CONDITIONS
AS NO-SHOW.</Text>
      </Paragraph>
    </Rules>
  </FareRuleInfo>
</OTA_AirRulesRS>
{% endxmlsec %}

## Выбор тарифа из списка дубликатов

В некоторых случаях перевозчики могут иметь несколько тарифов с одинаковым кодом, пунктом отправления, пунктом прибытия и датой вылета. В этом случае при попытке запросить текст правил тарифа при помощи сервиса OTA_AirRulesLLSRQ ответ будет содержать элемент ```/OTA_AirRulesRS/DuplicateFareInfo``` с перечислением дубликатов тарифов:

{% xmlsec "Пример ответа с перечислением дубликатов тарифов", false %}
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
{% endxmlsec %}

Для выбора одного из предложенных тарифов необходимо повторно отправить запрос к сервису OTA_AirRulesLLSRQ, указав номер тарифа из списка в качестве значения атрибута ```/OTA_AirRulesRQ/RuleReqInfo/@RPH```.

В случае необходимости получения только определенных категорий правил тарифа необходимо указать номера категорий пассажиров в последовательно расположенных элементах ```/OTA_AirRulesRQ/RuleReqInfo/Category```.

{% xmlsec "Пример запроса", false %}
<OTA_AirRulesRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <RuleReqInfo RPH="1">
    <Category>16</Category>
  </RuleReqInfo>
</OTA_AirRulesRQ>
{% endxmlsec %}

## Алгоритм получения данных для составления запроса

Для получения текста правил тарифов для всех сегментов на маршруте, необходимо составить список компонентов тарифов (fare component) в расчете стоимости для варианта перелета в результатах поиска или в PQ для уже созданного бронирования, проассоциировать их с сегментами и для каждого компонента тарифа запросить текст правил при помощи сервиса [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules).

Ниже представлены алгоритмы получения данных для различных сервисов.

### Алгоритм получения данных из ответа сервисов BargainFinderMaxRQ и BargainFinderMax_ADRQ (OTA ответ)

[OTA ответ](shop.md#vid_otveta) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) содержит информацию обо всех примененных тарифах в последовательно расположенных элементах ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode```. Каждый элемент будет соответствовать одному сегменту в маршруте (элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItinerary/OriginDestinationOptions/OriginDestinationOption/FlightSegment```).

Правила тарифов необходимо запрашивать для каждого компонента тарифа (fare component). Каждый компонент тарифа может соответствовать одному или нескольким сегментам. Например, в следующем примере есть два компонента тарифа (представлен элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes```):

{% xmlsec "Пример", true %}
<FareBasisCodes>
  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="E" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="FROM" FareComponentEndAirport="JFK" FareComponentFareRule="ESA1" FareComponentFareTariff="1" FareComponentFareType="XPX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">EVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="JFK" AvailabilityBreak="true" BookingCode="E" DepartureAirportCode="SVO" GovCarrier="SU">EVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="SVO" BookingCode="N" DepartureAirportCode="JFK" FareComponentBeginAirport="JFK" FareComponentDirectionality="TO" FareComponentEndAirport="AER" FareComponentFareRule="ESA1" FareComponentFareTariff="1" FareComponentFareType="XPX" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="SU">NVULA</FareBasisCode>
  <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="SVO" GovCarrier="SU">NVULA</FareBasisCode>
</FareBasisCodes>
{% endxmlsec %}

Определить компонент тарифа можно по наличию атрибута ```/@FareComponentDirectionality```. Те элементы ```/FareBasisCode``` (и соответствующие им сегменты), что не имеют атрибутов ```/@FareComponentDirectionality```, относятся к предыдущему компоненту тарифа. В приведенном выше примере первый и второй сегмент относятся к первому компоненту тарифа, а третий и четвертый сегмент — ко второму компоненту тарифа.

Запрос к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules) для каждого компонента тарифа должен содержать следующую информацию из [OTA ответа](shop.md#vid_otveta) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) (путь указан относительно элемента ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes```):
- код перевозчика, который зафайлировал тариф — ```/FareBasisCode/@GovCarrier```
- пункт отправления для тарифа — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/FareBasisCode/@FareComponentBeginAirport```
    - значение ```TO```: ```/FareBasisCode/@FareComponentEndAirport```
- пункт прибытия для тарифа — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/FareBasisCode/@FareComponentEndAirport```
    - значение ```TO```: ```/FareBasisCode/@FareComponentBeginAirport```
- дата вылета — зависит от значения атрибута ```/FareBasisCode/@FareComponentDirectionality```:
    - значение ```FROM```: ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItinerary/OriginDestinationOptions/OriginDestinationOption/FlightSegment/@DepartureDateTime```
    - значение ```TO```: дата вылета предыдущего компонента тарифа, у которого ```/FareBasisCode/@FareComponentBeginAirport``` совпадает с ```/FareBasisCode/@FareComponentEndAirport``` текущего компонента тарифа, а ```/FareBasisCode/@FareComponentEndAirport``` совпадает с ```/FareBasisCode/@FareComponentBeginAirport``` текущего компонента тарифа
- код тарифа — ```/FareBasisCode```

В представленном выше примере у обоих компонентов тарифов будет дата вылета первого сегмента на маршруте, т.к. у второго компонента тарифа значение атрибута ```/FareBasisCode/@FareComponentDirectionality``` равно ```TO```.

#### Пример

{% xmlsec "Ответ RevalidateItinRQ", false %}
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
{% endxmlsec %}

Данные для запроса правил тарифов:

| **Код перевозчика, который зафайлировал тариф** | **Пункт отправления для тарифа** | **Пункт прибытия для тарифа** | **Дата вылета** | **Код тарифа** |
|----|-----|-----|------------|------|
| SU | LED | AER | 2020-09-01 | YNBR |
| SU | LED | AER | 2020-09-01 | BNBR |

### Алгоритм получения данных из ответа сервисов BargainFinderMaxRQ и BargainFinderMax_ADRQ (GIR ответ)

Алгоритм получения данных из [GIR ответа](shop.md#vid_otveta) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) содержит информацию обо всех компонентах тарифов в последовательно расположенных элементах ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent```. Этот элемент имеет дочерние элементы ```/Segment``` для связи компонентов тарифов с сегментами на маршруте (элементы ```/Segment``` указаны последовательно в том же порядке, как и в маршруте).

Описание каждого компонента тарифа доступно в ```/GroupedItineraryResponse/FareComponentDesc``` (у которого ```/GroupedItineraryResponse/FareComponentDesc/@ID``` равен ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent/@Ref```).

Запрос к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules) для каждого компонента тарифа должен содержать следующую информацию из [GIR ответа](shop.md#vid_otveta) сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary):
- код перевозчика, который зафайлировал тариф — ```/GroupedItineraryResponse/FareComponentDesc/@GoverningCarrier```
- пункт отправления для тарифа — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: пункт отправления для первого сегмента для выбранного компонента тарифа
    - значение ```TO```: пункт прибытия для последнего сегмента для выбранного компонента тарифа
- пункт прибытия для тарифа — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: пункт прибытия для последнего сегмента для выбранного компонента тарифа
    - значение ```TO```: пункт отправления для первого сегмента для выбранного компонента тарифа
- дата вылета — зависит от значения атрибута ```/GroupedItineraryResponse/FareComponentDesc/@Directionality```:
    - значение ```FROM```: дата вылета для первого сегмента для выбранного компонента тарифа
    - значение ```TO```: дата вылета предыдущего компонента тарифа, у которого пункт отправления совпадает с пунктом прибытия текущего компонента тарифа, а пункт прибытия совпадает с пунктом отправления текущего компонента тарифа
- код тарифа — ```/GroupedItineraryResponse/FareComponentDesc/@FareBasisCode```


#### Пример

{% xmlsec "Ответ RevalidateItinRQ", false %}
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
{% endxmlsec %}

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
