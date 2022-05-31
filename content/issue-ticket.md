---
title: Оформление билетов и EMD
aliases:
    - /issue-ticket-old
---

{{< toc >}}

## Алгоритм оформления билетов и EMD

![](/sabre-apis-ru/assets/svg/issue-ticket/issue-ticket.svg)

## Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В бронировании перед оформлением билетов и (или) EMD необходимо проверить:
- что сегменты подтверждены (статус ```HK``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/FlightSegment/@Status```) — в случае оформления билетов
- что сегментам присвоен локатор авиакомпании (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/FlightSegment/SupplierRef/@ID``` после ```DC[код авиакомпании]*```, например ```DCSU*ABCDEF```) — в случае оформления билетов
- что дополнительные услуги подтверждены (статус ```HD``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/Ancillaries/AncillaryService/@ActionCode```) — в случае оформления EMD

Кроме того, при оформлении билетов необходимо проверить наличие PQ (Price Quote, сохраненный расчет), а также то, что они подходит для выписки билетов:
1. **Проверка наличия PQ**. Каждому PQ в бронировании соответствует один элемент ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote``` в ответе на запрос [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary). Номер PQ будет присутствовать в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/@RPH```.
2. **Проверка статуса PQ**. PQ может иметь один из двух статусов (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/MiscInformation/SignatureLine/@Status```):
    - ```ACTIVE``` — активный PQ, который можно использовать для оформления билетов
    - ```HISTORY``` — удаленный PQ, который нельзя использовать для оформления билетов
3. **Проверка типа PQ**. В системе могут быть два типа PQ:
    - стандартный PQ, который используется для оформления новых билетов
    - PQR (PQ Reissue), который содержит расчет для оформления билетов в обмен (см. [Обмен билетов](exchange-ticket.html)). PQR должны иметь значение ```Y``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/MiscInformation/SignatureLine/@PQR_Ind```.
4. **Проверка применимости PQ**. Рекомендуется перед оформлением билетов проверить соответствие между рейсами, сохраненными в PQ, с рейсами в бронировании. Также рекомендуется проверить соответствие между пассажирами, для которых созданы PQ, с пассажирами в бронировании. Это позволит избежать проблем в случае изменения расписания перевозчиком или, например, изменения PQ агентами в терминале.
5. **Проверка актуальности PQ**. PQ отражает стоимость бронирования на момент создания PQ. По прошествии времени стоимость выбранного перелета может меняться из-за изменения тарифов, прошедшего [тайм-лимита](timelimit.html), изменения курса валют или других причин. Поэтому при оформлении билетов рекомендуется использовать актуальные PQ. Дата и время создания PQ указаны в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/@StoredDateTime```. При этом алгоритм работы с системой может быть разным в зависимости от того, включена ли в PCC настройка [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета):
    - Если настройка отключена, то система при каждой попытке оформления билета производит перерасчет стоимости. Это означает, что если стоимость перелета изменилась между временем создания PQ и попыткой оформления билета, то билет будет оформлен с новой стоимостью. Поэтому если в PCC настройка отключена, рекомендуется снизить временной промежуток между созданием PQ и оформлением билетов до минимума. Для бронирования с устаревшим PQ рекомендуется выполнить [Перерасчет стоимости бронирований](reprice-booking.html).
    - Если настройка включена, то система не производит перерасчета стоимости во время оформления билета и использует сохраненный в PQ расчет (в случае соблюдения требований [тайм-лимита](timelimit.html)), однако только в том случае, если PQ был создан в тот же день, когда производится оформление билета (используется локальный часовой пояс для PCC).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{{< details title="Пример запроса" >}}
```XML
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="QMRXLE"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:31:30.957-05:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:CustomerInfo>
      <tir310:ContactNumbers>
        <tir310:ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
        <tir310:ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
      </tir310:ContactNumbers>
      <tir310:PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-3.1">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</tir310:Email>
        <tir310:GivenName>IVAN MR</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-5.2">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ELENA MS</tir310:GivenName>
        <tir310:Surname>IVANOVA</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-7.3">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ANDREY</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-9.4">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>EKATERINA</tir310:GivenName>
        <tir310:Surname>IVANOVA</tir310:Surname>
      </tir310:PersonName>
    </tir310:CustomerInfo>
    <tir310:ItineraryInfo>
      <tir310:ItineraryPricing>
        <tir310:PriceQuote RPH="1">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="170110" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="16713" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2490AU</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">6216GB</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="186823" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="8198.00"/>
                  <tir310:EquivFare Amount="340220"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="33426"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="373646"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$MP-I$BRYF$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - EY</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                <tir310:FareCalculation>
                  <tir310:Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLWF2AU"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="2463"/>
                  <tir310:OriginLocation LocationCode="SYD"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLWF2AU"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="25"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-02</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-02</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLXF2AU"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="12"/>
                  <tir310:OriginLocation LocationCode="LHR"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLXF2AU"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="464"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SYD"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="LON" Origin="SYD"/>
                  <tir310:Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="SYD" Origin="LON"/>
                  <tir310:Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>3</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>4</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="ADT">
              <tir310:PassengerData NameNumber="01.01">IVANOV/IVAN MR</tir310:PassengerData>
              <tir310:PassengerData NameNumber="02.01">IVANOVA/ELENA MS</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuote RPH="2">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="128280" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="8007" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="136287" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="3091.00"/>
                  <tir310:EquivFare Amount="128280"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8007"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="136287"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$MP-I$BRYF$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - EY</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                <tir310:FareCalculation>
                  <tir310:Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLWF2AUCH"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="2463"/>
                  <tir310:OriginLocation LocationCode="SYD"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLWF2AUCH"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="25"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-02</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-02</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLXF2AUCH"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="12"/>
                  <tir310:OriginLocation LocationCode="LHR"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLXF2AUCH"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="464"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SYD"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="LON" Origin="SYD"/>
                  <tir310:Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="SYD" Origin="LON"/>
                  <tir310:Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>3</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>4</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="CNN">
              <tir310:PassengerData NameNumber="03.01">IVANOV/ANDREY</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuote RPH="3">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="404.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="16770" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4149" TaxCode="UB"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="20919" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="404.00"/>
                  <tir310:EquivFare Amount="16770"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="4149"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="20919"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$MP-I$BRYF$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - EY</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                <tir310:FareCalculation>
                  <tir310:Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="YLWF2AUIN"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="2463"/>
                  <tir310:OriginLocation LocationCode="SYD"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="YLWF2AUIN"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="25"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-02</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-02</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="YLXF2AUIN"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="12"/>
                  <tir310:OriginLocation LocationCode="LHR"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="YLXF2AUIN"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="464"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-12-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-12-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SYD"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="LON" Origin="SYD"/>
                  <tir310:Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                  <tir310:Location Destination="SYD" Origin="LON"/>
                  <tir310:Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>3</tir310:FlightSegmentNumber>
                    <tir310:FlightSegmentNumber>4</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE USED TO CALCULATE DISCOUNT</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="INF">
              <tir310:PassengerData NameNumber="04.01">IVANOVA/EKATERINA</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuoteTotals>
          <tir310:BaseFare Amount="11693.00"/>
          <tir310:EquivFare Amount="485270.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="45582.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="530852.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AUH"/>
            <tir310:Equipment AirEquipType="789"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:MarriageGrp Group="001" Ind="O" Sequence="1"/>
            <tir310:Meal Code="R"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="SYD"/>
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
            <tir310:UpdatedArrivalTime>12-02T06:40</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>12-01T23:25</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>SYD</or110:DepartureAirport>
                <or110:ArrivalAirport>AUH</or110:ArrivalAirport>
                <or110:EquipmentType>789</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>2463</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MarriageGrp>
                  <or110:Group>1</or110:Group>
                  <or110:Sequence>1</or110:Sequence>
                </or110:MarriageGrp>
                <or110:MealCode>R</or110:MealCode>
                <or110:ElapsedTime>795</or110:ElapsedTime>
                <or110:AirMilesFlown>7506</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-12-01T23:25:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-12-02T06:40:00</or110:ArrivalDateTime>
                <or110:FlightNumber>2463</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>true</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:Equipment AirEquipType="789"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:MarriageGrp Group="001" Ind="I" Sequence="2"/>
            <tir310:Meal Code="M"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
            <tir310:UpdatedArrivalTime>12-02T14:10</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>12-02T10:35</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>AUH</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL 3</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>3</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>LHR</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL 3</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>3</or110:ArrivalTerminalCode>
                <or110:EquipmentType>789</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>25</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MarriageGrp>
                  <or110:Group>1</or110:Group>
                  <or110:Sequence>2</or110:Sequence>
                </or110:MarriageGrp>
                <or110:MealCode>M</or110:MealCode>
                <or110:ElapsedTime>455</or110:ElapsedTime>
                <or110:AirMilesFlown>3420</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-12-02T10:35:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-12-02T14:10:00</or110:ArrivalDateTime>
                <or110:FlightNumber>25</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>true</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:Equipment AirEquipType="781"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:MarriageGrp Group="002" Ind="O" Sequence="1"/>
            <tir310:Meal Code="M"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
            <tir310:UpdatedArrivalTime>12-08T19:20</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>12-08T08:30</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="4" sequence="3">
                <or110:DepartureAirport>LHR</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL 3</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>3</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>AUH</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL 3</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>3</or110:ArrivalTerminalCode>
                <or110:EquipmentType>781</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>12</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MarriageGrp>
                  <or110:Group>2</or110:Group>
                  <or110:Sequence>1</or110:Sequence>
                </or110:MarriageGrp>
                <or110:MealCode>M</or110:MealCode>
                <or110:ElapsedTime>410</or110:ElapsedTime>
                <or110:AirMilesFlown>3420</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-12-08T08:30:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-12-08T19:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>12</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>true</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="SYD"/>
            <tir310:Equipment AirEquipType="789"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:MarriageGrp Group="002" Ind="I" Sequence="2"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AUH"/>
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
            <tir310:UpdatedArrivalTime>12-09T17:55</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>12-08T22:10</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="5" sequence="4">
                <or110:DepartureAirport>AUH</or110:DepartureAirport>
                <or110:ArrivalAirport>SYD</or110:ArrivalAirport>
                <or110:EquipmentType>789</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>464</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MarriageGrp>
                  <or110:Group>2</or110:Group>
                  <or110:Sequence>2</or110:Sequence>
                </or110:MarriageGrp>
                <or110:ElapsedTime>825</or110:ElapsedTime>
                <or110:AirMilesFlown>7506</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-12-08T22:10:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-12-09T17:55:00</or110:ArrivalDateTime>
                <or110:FlightNumber>464</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>true</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="QMRXLE" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="9LSC" CreateDateTime="2022-05-24T03:30" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-24T03:31" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="1"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="30" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
    </tir310:RemarkInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="26" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="27" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="28" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="29" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:OpenReservationElements>
      <or110:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FreeText>
          <or110:FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>1234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>20NOV2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20NOV1980</or110:DateOfBirth>
            <or110:Gender>M</or110:Gender>
            <or110:LastName>IVANOV</or110:LastName>
            <or110:FirstName>IVAN</or110:FirstName>
            <or110:MiddleName>IVANOVICH</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>true</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>2234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>15AUG2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20JAN1980</or110:DateOfBirth>
            <or110:Gender>F</or110:Gender>
            <or110:LastName>IVANOVA</or110:LastName>
            <or110:FirstName>ELENA</or110:FirstName>
            <or110:MiddleName>IVANOVNA</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FreeText>
          <or110:FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>3234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>20NOV2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>15JAN2012</or110:DateOfBirth>
            <or110:Gender>M</or110:Gender>
            <or110:LastName>IVANOV</or110:LastName>
            <or110:FirstName>ANDREY</or110:FirstName>
            <or110:MiddleName>IVANOVICH</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>1234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>15APR2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20FEB2022</or110:DateOfBirth>
            <or110:Gender>FI</or110:Gender>
            <or110:LastName>IVANOVA</or110:LastName>
            <or110:FirstName>EKATERINA</or110:FirstName>
            <or110:MiddleName>IVANOVNA</or110:MiddleName>
            <or110:Infant>true</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT EY NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>NN</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT EY NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>NN</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-26" id="26" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>NN</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-27" id="27" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>NN</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/79851234567/RU</or110:FreeText>
          <or110:FullText>CTCM EY HK1/79851234567/RU</or110:FullText>
          <or110:PassengerContactMobilePhone>
            <or110:PhoneNumber>79851234567</or110:PhoneNumber>
            <or110:Language>RU</or110:Language>
          </or110:PassengerContactMobilePhone>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:Comment>COM/RU</or110:Comment>
          <or110:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or110:FreeText>
          <or110:FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</or110:FullText>
          <or110:PassengerContactEmail>
            <or110:Email>CUSTOMER@CUSTOMER.COM</or110:Email>
            <or110:Language>RU</or110:Language>
          </or110:PassengerContactEmail>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or110:Email comment="BC/" type="BC">
          <or110:Address>AGENCY@AGENCY.COM</or110:Address>
        </or110:Email>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or110:Email comment="TO/" type="TO">
          <or110:Address>CUSTOMER@CUSTOMER.COM</or110:Address>
        </or110:Email>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
    </tir310:OpenReservationElements>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
```
{{< /details >}}

## Оформление билетов и EMD (AirTicketRQ)

Для оформления билетов или EMD используется сервис [AirTicketRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket).

Ниже указаны обязательные и необязательные элементы и атрибуты запроса к сервису:

### Переход в другой PCC

Для оформления билета или EMD в другом PCC (т.е. не в iPCC, в котором была создана сессия или токен) необходимо указать его в качестве значения атрибута ```/AirTicketRQ/@targetCity```.

{{< hint warning >}}
Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).
{{< /hint >}}

### Выбор стока

В Sabre существует возможность оформления билетов и EMD на разных платформах или стоках. Для того чтобы указать сток, на котором будет произведена выписка билета или EMD, необходимо указать его в качестве значения атрибута ```/AirTicketRQ/DesignatePrinter/Printers/Ticket/@CountryCode```.

Соответствие стоков и их кодов:

| Сток | Код стока |
| -- | -- |
| Сток BSP Россия | ```RU``` |
| Сток BSP Казахстан | ```KZ``` |
| Прямой сток Аэрофлота | ```1R``` |
| Прямой сток других авиакомпаний | ```1Y``` |
| Сток ТКП | ```1T``` |

### Выбор принтера

Перед оформление билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в качестве значения атрибута ```/AirTicketRQ/DesignatePrinter/Printers/Hardcopy/@LNIATA```.

Подробнее о терминальных адресах принтеров см. раздел [Конфигурация Sabre](configuration.html#терминальные-адреса-ta-lniata).

### Чтение бронирования

Код бронирования (PNR Record Locator), в котором необходимо произвести оформление билета или EMD, указывается в качестве значения атрибута ```/AirTicketRQ/Itinerary/@ID```.

### Оформление билетов и EMD

Сервис [AirTicketRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket) позволяет одну или несколько инструкций по оформлению билетов или EMD в последовательно расположенных элементах ```/AirTicketRQ/Ticketing```. Инструкции будут выполнены последовательно: одна за другой. В случае, если в PCC, в котором производится оформление билетов или EMD, не включены настройки [Automatically End Transaction at Ticketing](tjr-settings.html#automatically-end-transaction-at-ticketing-автоматическое-сохранение-бронирований-при-оформлении-билетов) или [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.html#automatically-end-transaction-and-redisplay-the-pnr-at-ticketing-автоматическое-сохранение-бронирований-и-повторное-их-открытие-при-оформлении-билетов), то все инструкции будут выполнены без промежуточного сохранения бронирования, а бронирование может быть сохранено только при [пост-обработке](issue-ticket.html#пост-обработка). Если одна из указанных настроек включена, то после выполнения каждой инструкции оформления билетов или EMD бронирование будет сохранено и вновь открыто.

В одном запросе в разных инструкциях могут быть оформлены одновременно и билеты и EMD.

Ниже представлены элементы, которые могут быть указаны в каждой инструкции оформления билета или EMD:

#### Выбор форм оплаты

Подробнее о выборе форм оплаты в Sabre см. [Выбор форм оплаты](fop.html).

В Sabre при оформлении билета или EMD можно указать одну или несколько форм оплаты. Возможные виды форм оплаты представлены ниже.

##### Наличный или безналичный расчет

При использовании наличного или безналичного расчета код формы оплаты необходимо указать в качестве значения атрибута ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BasicFOP/@Type```.

Коды форм оплаты:
- ```CA``` — наличный расчет
- ```CK``` — безналичный расчет

##### Банковская карта

При использовании банковской карты в качестве формы оплаты необходимо добавить элемент ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BasicFOP/CC_Info/PaymentCard``` в запрос и указать следующие атрибуты:
- ```/@Code``` — код платежной системы
- ```/@ExpireDate``` — год и месяц срока истечения действия карты (формат ```YYYY-MM```)
- ```/@ManualApprovalCode``` — код авторизации платежа (в случае наличия)
- ```/@Number``` — номер карты

Список кодов основных платежных систем:
- ```VI``` — Visa
- ```CA``` — Master Card
- ```AX``` — American Express

#### Ссылка на сохраненную в бронировании форму оплаты

Для добавления ссылки на сохраненную в бронировании форму оплаты необходимо указать ее порядковый номер в качестве значения атрибута ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BasicFOP/@Reference```.

##### Двойная форма оплаты (наличный или безналичный расчет и кредитная карта)

{{< hint warning >}}
Обратите внимание на то, что двойная форма оплаты возможна только для билетов!
{{< /hint >}}

Для использования двух форм оплаты необходимо добавить информацию о каждой в элементы ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_One``` и ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_Two``` соответственно. У данных элементов необходимо указать код формы оплаты в атрибуте ```/@Type```, если используется форма оплаты наличный или безналичный расчет (```CA``` или ```CK```).

В качестве значения атрибута ```/AirTicketRQ/Ticketing/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/Fare/@Amount``` должна быть указана сумма, которая будет списана со второй формы оплаты. Обратите внимание на то, что эта сумма не может превышать величину тарифа для билета.

При использовании двойной формы оплаты оформление билета может производиться только для одного PQ.

#### Особенности оформления билетов

При оформлении билета или билетов необходимо указать:
- одну или несколько форм оплаты (см. выше)
- величину комиссии в процентах (```/AirTicketRQ/Ticketing/MiscQualifiers/Commission/@Percent```) или абсолютных значениях (```/@Amount```)
- один или несколько номеров PQ, по которым будет производиться оформление билетов (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/Record/@Number``` для одного PQ, если PQ несколько, то в атрибуте ```/@Number``` задается номер первого PQ, а в атрибуте ```/@EndNumber``` — номер последнего PQ)

Дополнительно в запросе можно указать:
- номер пассажира (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/NameSelect/@NameNumber```)
- текст для *добавления* в полe Endorsement билета (```/AirTicketRQ/Ticketing/MiscQualifiers/Endorsement/Text```). Для *переопределения* значения этого поля необходимо дополнительно указать значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/Endorsement/@Override```
- добавление даты рождения пассажира из SSR типа DOCS в поле Endorsement билета (```/AirTicketRQ/Ticketing/MiscQualifiers/DateOfBirth```)
- текст туркода для добавления в билет (```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/Text```). Существует 4 разных опции добавления туркода:
    - по умолчанию в маске билета перед указанным туркодом будут располагаться буквы ```IT``` (Inclusive Tour)
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressFareReplaceWithIT/@Ind```, то в маске билета перед указанным туркодом будут располагаться буквы ```IT``` (Inclusive Tour), а также скрыта стоимость
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressIT/@Ind```, то в маске билета будет указан туркод
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressITSupressFare/@Ind```, то в маске билета будет указан туркод, а также скрыта стоимость

Существует несколько стратегий оформления билетов в рамках каждой инструкции оформления билета:
1. для каждого пассажира в бронировании указывается отдельная инструкция
2. для каждого PQ в бронировании указывается отдельная инструкция
3. указывается одна инструкция для всех PQ в бронировании

Рекомендуется использовать первую или вторую стратегию.

{{< hint warning >}}
Обратите внимание на то, что в случае использования первой стратегии, при наличии в бронировании нескольких пассажиров одной категории и при включенной настройке [Price Retention Ticketing Alert](tjr-settings.html#price-retention-ticketing-alert-предупреждение-об-изменении-стоимости-билетов) при попытке оформить билет будет вызвано предупреждение. Для решения этой проблемы необходимо выполнить одно из действий:
- отключить настройку Price Retention Ticketing Alert
- использовать другую стратегию оформления билетов
- игнорировать предупреждения, указав ```true``` в качестве значения атрибута ```/AirTicketRQ/PostProcessing/@acceptPriceChanges```
{{< /hint >}}

#### Особенности оформления билетов в обмен

При оформлении билета или билетов в обмен после [сохранения маски расчета стоимости обмена](exchange-ticket.html) (PQR) необходимо указать:
- величину комиссии в процентах (```/AirTicketRQ/Ticketing/MiscQualifiers/Commission/@Percent```) или абсолютных значениях (```/@Amount```)
- номер PQR, по которому будет производиться оформление билета в обмен (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/Record/@Number```), а также признак использования PQR (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/Record/@Reissue``` со значением ```true```)

{{< hint danger >}}
Форму оплаты указывать не требуется, поскольку она уже была указана в PQR при расчете стоимости обмена.
{{< /hint >}}

Дополнительно в запросе можно указать:
- текст для *добавления* в полe Endorsement билета (```/AirTicketRQ/Ticketing/MiscQualifiers/Endorsement/Text```). Для *переопределения* значения этого поля необходимо дополнительно указать значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/Endorsement/@Override```
- добавление даты рождения пассажира из SSR типа DOCS в поле Endorsement билета (```/AirTicketRQ/Ticketing/MiscQualifiers/DateOfBirth```)
- текст туркода для добавления в билет (```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/Text```). Существует 4 разных опции добавления туркода:
    - по умолчанию в маске билета перед указанным туркодом будут располагаться буквы ```IT``` (Inclusive Tour)
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressFareReplaceWithIT/@Ind```, то в маске билета перед указанным туркодом будут располагаться буквы ```IT``` (Inclusive Tour), а также скрыта стоимость
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressIT/@Ind```, то в маске билета будет указан туркод
    - если указано значение ```true``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/TourCode/SuppressITSupressFare/@Ind```, то в маске билета будет указан туркод, а также скрыта стоимость

#### Особенности оформления EMD

При оформлении EMD необходимо указать:
- тип оформляемого документа (значение ```EMD``` у атрибута ```/AirTicketRQ/Ticketing/MiscQualifiers/Ticket/@Type```)
- форму оплаты (см. выше)
- один или несколько номеров дополнительных услуг, для которых необходимо оформить EMD (```/AirTicketRQ/Ticketing/MiscQualifiers/AirExtras/@Number``` для одной дополнительной услуги, если дополнительных услуг несколько, то в атрибуте ```/@Number``` задается номер первой дополнительной услуги, а в атрибуте ```/@EndNumber``` — номер последней дополнительной услуги).

Номер дополнительной услуги в бронировании может быть получен в атрибуте ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/Ancillaries/AncillaryService/@SequenceNumber``` из ответа на запрос [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary).

### Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/AirTicketRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку следующего вида:

{{< details title="Нарушение правил минимального стыковочного времени" open=true >}}
```XML
<SystemSpecificResults>
  <Message code="ERR.SP.BUSINESS_ERROR">Invalid connect time between air segments - please verify itinerary</Message>
  <Message code="ERR.SP.PROVIDER_ERROR">SabreCommandLLSRQ: INVALID CONNECT TIME SEGS 1 AND 2 - MINIMUM IS 60 MINUTES VERIFY ANY REMAINING SEGS</Message>
</SystemSpecificResults>
```
{{< /details >}}

Билеты и EMD в этом случае оформлены не будут.

### Пост-обработка

Сервис позволяет указать в запросе условия обработки различных предупреждений системы при оформлении билетов:
- ```/AirTicketRQ/PostProcessing/@acceptNegotiatedFare``` — обработка предупреждения, возникающего при попытке оформить билет по приватному тарифу при включенной настройке [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета), но выключенной настройке [Allow Ticket CAT 35 IT/BT PQ Fare](tjr-settings.html#allow-ticket-cat-35-itbt-pq-fare-оформление-билетов-по-сохраненным-в-pq-приватным-тарифам-без-перерасчета). Возможные значения:
    - ```true``` — оформление билета по публичному тарифу
    - ```false``` — отмена процесса оформления билета
- ```/AirTicketRQ/PostProcessing/@acceptPriceChanges``` — обработка предупреждения, возникающего при не соответствии стоимости билета сохраненной в PQ и фактической стоимости билета при включенной настройке [Price Retention Ticketing Alert](tjr-settings.html#price-retention-ticketing-alert-предупреждение-об-изменении-стоимости-билетов). Возможные значения:
    - ```true``` — оформление билета по новой цене
    - ```false``` — отмена процесса оформления билета
- ```/AirTicketRQ/PostProcessing/@actionOnBackDatePrice``` — обработка предупреждения, возникающего при попытке оформления билета по PQ, содержащей расчет на прошлую дату. Возможные значения:
    - ```R``` — выполнить перерасчет стоимости и оформить билет по актуальной стоимости
    - ```O``` — оформить билет по сохраненному PQ без перерасчета (в этом случае гарантия Sabre не сохранится)
    - ```Q``` — отмена процесса оформления билета
- ```/AirTicketRQ/PostProcessing/@actionOnPQExpired``` — обработка предупреждения, возникающего при попытке оформления билета по устаревшей PQ при включенной настройке [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета). Возможные значения:
    - ```R``` — выполнить перерасчет стоимости и оформить билет по актуальной стоимости
    - ```O``` — оформить билет по сохраненному PQ без перерасчета (в этом случае гарантия Sabre не сохранится)
    - ```Q``` — отмена процесса оформления билета

При оформлении EMD указанные выше атрибуты можно не указывать.

В случае, если в PCC, в котором производится оформление билетов или EMD, не включены настройки [Automatically End Transaction at Ticketing](tjr-settings.html#automatically-end-transaction-at-ticketing-автоматическое-сохранение-бронирований-при-оформлении-билетов) или [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.html#automatically-end-transaction-and-redisplay-the-pnr-at-ticketing-автоматическое-сохранение-бронирований-и-повторное-их-открытие-при-оформлении-билетов), то после оформления билетов необходимо сохранить бронирование. Для этого нужно добавить в запрос элемент ```/AirTicketRQ/PostProcessing/EndTransaction```, а также указать значение поля Received From в качестве значения атрибута ```/AirTicketRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom```.

Сервис позволяет проверить успешность сохранения билетов и EMD в бронировании. Для этого требуется добавить элемент ```/AirTicketRQ/PostProcessing/GhostTicketCheck``` со следующими атрибутами:
- ```/@waitInterval``` — временной интервал между проверками в миллисекундах (от 1000 до 30000 миллисекунд)
- ```/@numAttempts``` — количество попыток проверок (от 1 до 6)

В случае оформления нескольких билетов или EMD в одном запросе, чтобы избежать проблем одновременного изменения бронирования (Simultaneous Changes) рекомендуется указать задержку между транзакциями в качестве значения атрибута ```/AirTicketRQ/PostProcessing/TicketingInterval/@waitInterval``` (задается в миллисекундах).

### Примеры

{{< details title="Пример запроса (оформление билетов в 1 транзакцию с наличной формой оплаты)" >}}
```XML
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.3.0" xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="QMRXLE"/>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP Type="CA"/>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <Commission Percent="1"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record EndNumber="3" Number="1"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnBackDatePrice="Q" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
    <TicketingInterval waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-24T03:31:55.402-05:00"/>
    <Warning timeStamp="2022-05-24T03:31:53.568-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    530852</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0331 QMRXLE TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000042</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>6079419628282</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:31:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>QMRXLE</Reservation>
    <FirstName>ANDREY</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">136287</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628283</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:31:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>QMRXLE</Reservation>
    <FirstName>EKATERINA</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">20919</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628280</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:31:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>QMRXLE</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">186823</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628281</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:31:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>QMRXLE</Reservation>
    <FirstName>ELENA MS</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">186823</TotalAmount>
  </Summary>
</AirTicketRS>
```
{{< /details >}}

-----

{{< details title="Пример запроса (оформление билетов в 3 транзакции с формой оплаты кредитной картой)" >}}
```XML
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.3.0" xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="ETOQVP"/>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP>
        <CC_Info>
          <PaymentCard Code="AX" ExpireDate="2027-09" ManualApprovalCode="1234" Number="371449635398431"/>
        </CC_Info>
      </BasicFOP>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <Commission Amount="100"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="1"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP>
        <CC_Info>
          <PaymentCard Code="AX" ExpireDate="2027-09" ManualApprovalCode="1234" Number="371449635398431"/>
        </CC_Info>
      </BasicFOP>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <Commission Amount="100"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="2"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP>
        <CC_Info>
          <PaymentCard Code="AX" ExpireDate="2027-09" ManualApprovalCode="1234" Number="371449635398431"/>
        </CC_Info>
      </BasicFOP>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <Commission Amount="0"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="3"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnBackDatePrice="Q" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
    <TicketingInterval waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-24T03:45:21.037-05:00"/>
    <Warning timeStamp="2022-05-24T03:45:06.597-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    373646    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0345 ETOQVP TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000043</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T03:45:12.508-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    136287    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0345 ETOQVP TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000044</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T03:45:18.439-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK     20919    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0345 ETOQVP TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000045</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>6079419628287</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ETOQVP</Reservation>
    <FirstName>EKATERINA</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">20919</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628284</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ETOQVP</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">186823</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628286</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ETOQVP</Reservation>
    <FirstName>ANDREY</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">136287</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628285</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ETOQVP</Reservation>
    <FirstName>ELENA MS</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">186823</TotalAmount>
  </Summary>
</AirTicketRS>
```
{{< /details >}}

-----

{{< details title="Пример запроса (оформление билетов и EMD разными транзакциями с безналичной формой оплаты)" >}}
```XML
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.3.0" xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="ESJWYE"/>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP Type="CK"/>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <Commission Percent="1"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <NameSelect NameNumber="1.1"/>
        <Record Number="1"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP Type="CK"/>
    </FOP_Qualifiers>
    <MiscQualifiers>
      <AirExtras Number="1"/>
      <Ticket Type="EMD"/>
    </MiscQualifiers>
  </Ticketing>
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnBackDatePrice="Q" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
    <TicketingInterval waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-24T03:49:39.313-05:00"/>
    <Warning timeStamp="2022-05-24T03:49:23.672-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    186823</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>AE ITEMS EXIST - USE WEMD ENTRY TO FULFILL</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0349 ESJWYE TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000046</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>6071883851155</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:49:00</LocalIssueDateTime>
    <DocumentType>EMD</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ESJWYE</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">35345</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419628288</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T11:49:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>ESJWYE</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">186823</TotalAmount>
  </Summary>
</AirTicketRS>
```
{{< /details >}}

-----

{{< details title="Пример запроса (оформление билетов в обмен)" >}}
```XML
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.3.0" xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="EAYRCG"/>
  <Ticketing>
    <MiscQualifiers>
      <Commission Percent="0"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="4" Reissue="true"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <MiscQualifiers>
      <Commission Percent="0"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="5" Reissue="true"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <MiscQualifiers>
      <Commission Percent="0"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="6" Reissue="true"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <Ticketing>
    <MiscQualifiers>
      <Commission Percent="0"/>
    </MiscQualifiers>
    <PricingQualifiers>
      <PriceQuote>
        <Record Number="7" Reissue="true"/>
      </PriceQuote>
    </PricingQualifiers>
  </Ticketing>
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnBackDatePrice="Q" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
    <TicketingInterval waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-24T09:01:20.618-05:00"/>
    <Warning timeStamp="2022-05-24T09:01:03.856-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    261028</Message>
        <Message>ETR EXCHANGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0901 EAYRCG TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000066</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T09:01:08.755-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    261028</Message>
        <Message>ETR EXCHANGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0901 EAYRCG TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000067</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T09:01:13.127-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    191562</Message>
        <Message>ETR EXCHANGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0901 EAYRCG TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000068</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T09:01:18.376-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK     44449</Message>
        <Message>ETR EXCHANGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0901 EAYRCG TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000069</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>6079419630757</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T17:01:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>EAYRCG</Reservation>
    <FirstName>ANDREY</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">55275</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419630758</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T17:01:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>EAYRCG</Reservation>
    <FirstName>EKATERINA</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">23530</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419630756</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T17:01:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>EAYRCG</Reservation>
    <FirstName>ELENA MS</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">74205</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6079419630755</DocumentNumber>
    <LocalIssueDateTime>2022-05-24T17:01:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>EAYRCG</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">74205</TotalAmount>
  </Summary>
</AirTicketRS>
```
{{< /details >}}
