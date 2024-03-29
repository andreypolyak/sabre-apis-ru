---
title: Перерасчет стоимости бронирований
aliases:
    - /reprice
---

{{< toc >}}

## Введение

Перерасчет стоимости бронирования — это операция удаления старых элементов расчета (PQ) и создание новых с актуальной стоимостью бронирования.

Операция перерасчета стоимости бронирования может быть выполнена как перед моментом оформления билета, так и в любой другой момент, например:
- перед оформлением билета, если после создания PQ прошло продолжительное время (в случае отключенной настройки [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета))
- перед оформлением билета, если PQ был создан в прошлые сутки или ранее (в случае включенной настройки [Ticket from Stored Fare](tjr-settings.html#ticket-from-stored-fare-оформление-билетов-по-сохраненным-pq-без-перерасчета))
- для уведомления клиента об изменении стоимости бронирования
- в случае нарушения сроков [тайм-лимита](timelimit.html)
- и т.д.

## Алгоритм перерасчета стоимости бронирований

![](/sabre-apis-ru/assets/svg/reprice/reprice.svg)

## Чтение бронирования (TravelItineraryReadRQ)

{{< hint warning >}}
Для перерасчета стоимости бронирований в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{{< details title="Пример запроса" >}}
```XML
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="TGQYEK"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T04:59:49.752-05:00"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1259/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T12:59" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="184455" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="18041" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2700AU</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2816WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">174ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1216F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">6678GB</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4457UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="202496" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="8198.00"/>
                  <tir310:EquivFare Amount="368910"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="36082"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="404992"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1259/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T12:59" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="139095" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="8663" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2816WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">174ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1216F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4457UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="147758" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="3091.00"/>
                  <tir310:EquivFare Amount="139095"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8663"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="147758"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1259/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T12:59" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="404.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="18180" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4457" TaxCode="UB"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="22637" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="404.00"/>
                  <tir310:EquivFare Amount="18180"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="4457"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="22637"/>
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
          <tir310:EquivFare Amount="526185.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="49202.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="575387.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:59:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*MEDYVE"/>
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
                <or110:AirlineRefId>DCEY*MEDYVE</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T04:59:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:59:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*MEDYVE"/>
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
                <or110:AirlineRefId>DCEY*MEDYVE</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T04:59:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:59:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*MEDYVE"/>
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
                <or110:AirlineRefId>DCEY*MEDYVE</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T04:59:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T04:59:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*MEDYVE"/>
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
                <or110:AirlineRefId>DCEY*MEDYVE</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T04:59:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="TGQYEK" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="9LSC" CreateDateTime="2022-05-20T04:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-20T04:59" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="1"/>
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

## Удаление старых PQ (DeletePriceQuoteLLSRQ)

Перед тем как создать новые элементы расчета (PQ) необходимо удалить предыдущие. Для этого используется сервис [DeletePriceQuoteLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/delete_price_quote).

В запросе необходимо указать, что требуется удалить все PQ (значение ```true``` у атрибута ```/DeletePriceQuoteRQ/AirItineraryPricingInfo/Record/@All```).

{{< details title="Пример запроса" >}}
```XML
<DeletePriceQuoteRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <AirItineraryPricingInfo>
    <Record All="true"/>
  </AirItineraryPricingInfo>
</DeletePriceQuoteRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<DeletePriceQuoteRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T04:59:57-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="193513">PQD-ALL</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DeletePriceQuoteRS>
```
{{< /details >}}

## Создание новых PQ (OTA_AirPriceLLSRQ)

Стоимость перелета на момент выписки билета может отличаться от стоимости на момент создания бронирования из-за изменения тарифа или курса валют. Для этого перед оформлением билета рекомендуется произвести перерасчет стоимости бронирования при помощи сервиса [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary).

Запрос к сервису составляется по аналогии с заполнением элемента ```AirPrice``` сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.html#расчет-стоимости)) или элемента ```OTA_AirPriceRQ``` сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.html#расчет-стоимости)).

{{< details title="Пример запроса" >}}
```XML
<OTA_AirPriceRQ ReturnHostCommand="true" Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <PriceRequestInformation Retain="true">
    <OptionalQualifiers>
      <FlightQualifiers>
        <VendorPrefs>
          <Airline Code="EY"/>
        </VendorPrefs>
      </FlightQualifiers>
      <PricingQualifiers>
        <Brand>YF</Brand>
        <SpecificPenalty AdditionalInfo="true"/>
      </PricingQualifiers>
    </OptionalQualifiers>
  </PriceRequestInformation>
</OTA_AirPriceRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirPriceRS Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T05:00:03-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPAEY¥MP-I¥BRYF¥RQ</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <PriceQuote>
    <MiscInformation>
      <BaggageInfo>
        <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0DFAAEY</ExtendedSubCodeKey>
        </SubCodeProperties>
        <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0LNABEY</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
        </SubCodeProperties>
      </BaggageInfo>
      <HeaderInformation SolutionSequenceNmbr="1">
        <DepartureDate>2022-12-01</DepartureDate>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB13500/CHG AFT DEP UP TO RUB13500/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>ELECTRONIC TICKETING NOT VALID FOR INFANTS</Text>
        <ValidatingCarrier Code="EY"/>
      </HeaderInformation>
      <SolutionInformation SolutionSequenceNmbr="1">
        <BaseFareCurrencyCode>AUD</BaseFareCurrencyCode>
        <CurrencyCode>RUB</CurrencyCode>
        <GrandTotalBaseFareAmount>526185</GrandTotalBaseFareAmount>
        <GrandTotalEquivFareAmount>11693.00</GrandTotalEquivFareAmount>
        <GrandTotalTaxes>49202</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>575387</TotalAmount>
      </SolutionInformation>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>BSP</SettlementMethod>
        <Ticket CarrierCode="EY" Type="ETKTREQ" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>TCH</SettlementMethod>
        <Ticket CarrierCode="EY" Type="ETKTPREF" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
    </MiscInformation>
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="575387">
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">7</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
          <Construction Amount="3085.80" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="184455" CurrencyCode="RUB"/>
          <Taxes TotalAmount="18041">
            <Tax Amount="2700" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
            <Tax Amount="2816" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="174" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1216" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="6678" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
            <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="202496" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="2"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">7</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
          <Construction Amount="2326.85" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="139095" CurrencyCode="RUB"/>
          <Taxes TotalAmount="8663">
            <Tax Amount="2816" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="174" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1216" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="147758" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="1"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">10</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">10</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">5</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="404.00" CurrencyCode="AUD"/>
          <Construction Amount="303.57" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="18180" CurrencyCode="RUB"/>
          <Taxes TotalAmount="4457">
            <Tax Amount="4457" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="22637" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="1"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="13500" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
    </PricedItinerary>
  </PriceQuote>
</OTA_AirPriceRS>
```
{{< /details >}}

## Сохранение бронирования (EnhancedEndTransactionRQ)

Для сохранения изменений в бронировании необходимо отправить запрос к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction). В результате выполнения запроса все изменения в бронировании, выполненные в текущей сессии, будут сохранены, а бронирование закрыто.

В запросе необходимо указать:
- ```/EnhancedEndTransactionRQ/EndTransaction/@Ind``` — признак сохранения бронирования (значение ```true```)
- ```/EnhancedEndTransactionRQ/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

Дополнительно можно запросить проверку минимального стыковочного времени, указав значение ```true``` у атрибута ```/EnhancedEndTransactionRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку. Бронирование в этом случае сохранено не будет.

{{< details title="Пример запроса" >}}
```XML
<EnhancedEndTransactionRQ haltOnInvalidMCT="true" version="1.0.0" xmlns="http://services.sabre.com/sp/eet/v1">
  <EndTransaction Ind="true"/>
  <Source ReceivedFrom="API"/>
</EnhancedEndTransactionRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<EnhancedEndTransactionRS xmlns="http://services.sabre.com/sp/eet/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-20T05:00:16.176-05:00"/>
  </ApplicationResults>
  <ItineraryRef ID="TGQYEK">
    <Source CreateDateTime="2022-05-20T05:00"/>
  </ItineraryRef>
  <Text>OK 0500 TGQYEK</Text>
</EnhancedEndTransactionRS>
```
{{< /details >}}
