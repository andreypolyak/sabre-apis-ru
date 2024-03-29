---
title: Отмена мест в салоне
---

{{< toc >}}

## Алгоритм отмены мест в салоне

![](/sabre-apis-ru/assets/svg/cancel-air-seats/cancel-air-seats.svg)

## Чтение бронирования (TravelItineraryReadRQ)

{{< hint warning >}}
Для отмены мест в салоне в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

{{< hint warning >}}
Обратите внимание на то, что при [отмене бронирования](cancel-booking.html) также будут отменены ассоциированные с этими сегментами места в салоне. Указанные ниже рекомендации следует применять только в том случае, если нужно отменить места в салоне без отмены бронирования.
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
  <UniqueID ID="TGNUYC"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T05:46:56.728-05:00"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1345/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
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
              <tir310:Text>2FRH 9LSC*AWT 1345/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
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
              <tir310:Text>2FRH 9LSC*AWT 1345/20MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
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
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*BWJNXL"/>
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
                <or110:AirlineRefId>DCEY*BWJNXL</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T05:45:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*BWJNXL"/>
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
                <or110:AirlineRefId>DCEY*BWJNXL</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T05:45:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*BWJNXL"/>
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
                <or110:AirlineRefId>DCEY*BWJNXL</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T05:45:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*BWJNXL"/>
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
                <or110:AirlineRefId>DCEY*BWJNXL</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-20T05:45:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="5">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="01.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="1" TicketingIndicator="0" id="33">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TTLPrice Currency="RUB" Price="8960"/>
              <tir310:OriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>SYD</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="8960"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20A</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>2463</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-01</tir310:DepartureDate>
                <tir310:BoardPoint>SYD</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="6">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="02.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="2" TicketingIndicator="0" id="36">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TTLPrice Currency="RUB" Price="8960"/>
              <tir310:OriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>SYD</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="8960"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20B</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>2463</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-01</tir310:DepartureDate>
                <tir310:BoardPoint>SYD</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="7">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="03.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="3" TicketingIndicator="0" id="39">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TTLPrice Currency="RUB" Price="8960"/>
              <tir310:OriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:PassengerTypeCode>CNN</tir310:PassengerTypeCode>
              <tir310:BoardPoint>SYD</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="140.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="8960"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="8960"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20C</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>2463</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-01</tir310:DepartureDate>
                <tir310:BoardPoint>SYD</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="8">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="01.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="4" TicketingIndicator="0" id="42">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TTLPrice Currency="RUB" Price="7680"/>
              <tir310:OriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>LHR</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="7680"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20A</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0025</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-02</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>LHR</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="9">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="02.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="5" TicketingIndicator="0" id="45">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TTLPrice Currency="RUB" Price="7680"/>
              <tir310:OriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>LHR</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="7680"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20B</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0025</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-02</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>LHR</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="10">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="03.01" NumberOfItems="1" RefundIndicator="R" SegmentIndicator="S" SequenceNumber="6" TicketingIndicator="0" id="48">
              <tir310:CommercialName>ECONOMY SPACE</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:SSRCode>SEAT</tir310:SSRCode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TTLPrice Currency="RUB" Price="7680"/>
              <tir310:OriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:PassengerTypeCode>CNN</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>LHR</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="120.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="7680"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="7680"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>20C</tir310:PdcSeat>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0025</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2022-12-02</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>LHR</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="11">
          <tir310:Seats>
            <tir310:Seat Changed="N" Id="32" NameNumber="01.01" Number="20A" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WLMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="SYD"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="35" NameNumber="02.01" Number="20B" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="LMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="SYD"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="38" NameNumber="03.01" Number="20C" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="ALMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="SYD"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="41" NameNumber="01.01" Number="20A" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WLMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="LHR"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="44" NameNumber="02.01" Number="20B" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="LMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="LHR"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="47" NameNumber="03.01" Number="20C" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="ALMO">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="LHR"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
          </tir310:Seats>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="true" ID="TGNUYC" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="9LSC" CreateDateTime="2022-05-20T05:45" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-20T05:46" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
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
      <or110:OpenReservationElement elementId="pnr-or-2edc6d7e-39ba-4997-a388-67c5af892ce3" id="2edc6d7e-39ba-4997-a388-67c5af892ce3" type="APO">
        <or110:AncillaryProduct Id="1">
          <or110:XmlData>
            <or110:AncillaryServiceData id="33">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>2</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>SYD</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20A</or110:PdcSeat>
              <or110:FirstTravelDate>221201</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>2463</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-01</or110:DepartureDate>
                <or110:BoardPoint>SYD</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-56aa2cba-4232-4735-850a-5a5776be90ba" id="56aa2cba-4232-4735-850a-5a5776be90ba" type="APO">
        <or110:AncillaryProduct Id="2">
          <or110:XmlData>
            <or110:AncillaryServiceData id="36">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOVA</or110:LastName>
                  <or110:FirstName>ELENA MS</or110:FirstName>
                  <or110:ReferenceId>2</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>2</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>SYD</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20B</or110:PdcSeat>
              <or110:FirstTravelDate>221201</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>2463</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-01</or110:DepartureDate>
                <or110:BoardPoint>SYD</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-9ad24333-d80a-4fc7-b1e4-983f2853407b" id="9ad24333-d80a-4fc7-b1e4-983f2853407b" type="APO">
        <or110:AncillaryProduct Id="3">
          <or110:XmlData>
            <or110:AncillaryServiceData id="39">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>ANDREY</or110:FirstName>
                  <or110:ReferenceId>3</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>2</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>CNN</or110:PassengerTypeCode>
              <or110:BoardPoint>SYD</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>140.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>8960</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20C</or110:PdcSeat>
              <or110:FirstTravelDate>221201</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>2463</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-01</or110:DepartureDate>
                <or110:BoardPoint>SYD</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-9bd4a6b5-c95c-49dc-b112-73d0980a1647" id="9bd4a6b5-c95c-49dc-b112-73d0980a1647" type="APO">
        <or110:AncillaryProduct Id="4">
          <or110:XmlData>
            <or110:AncillaryServiceData id="42">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>3</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>LHR</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20A</or110:PdcSeat>
              <or110:FirstTravelDate>221202</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0025</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-02</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>LHR</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-a4046cd0-dd2a-4416-a515-88142cd2709b" id="a4046cd0-dd2a-4416-a515-88142cd2709b" type="APO">
        <or110:AncillaryProduct Id="5">
          <or110:XmlData>
            <or110:AncillaryServiceData id="45">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOVA</or110:LastName>
                  <or110:FirstName>ELENA MS</or110:FirstName>
                  <or110:ReferenceId>2</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>3</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>LHR</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20B</or110:PdcSeat>
              <or110:FirstTravelDate>221202</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0025</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-02</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>LHR</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-bac47a0f-01c7-4b37-be16-c5ac7f15972a" id="bac47a0f-01c7-4b37-be16-c5ac7f15972a" type="APO">
        <or110:AncillaryProduct Id="6">
          <or110:XmlData>
            <or110:AncillaryServiceData id="48">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>ANDREY</or110:FirstName>
                  <or110:ReferenceId>3</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationId>3</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:CommercialName>ECONOMY SPACE</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:SSRCode>SEAT</or110:SSRCode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>R</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>CNN</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>LHR</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>120.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>7680</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:FareGuaranteedIndicator>T</or110:FareGuaranteedIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>20C</or110:PdcSeat>
              <or110:FirstTravelDate>221202</or110:FirstTravelDate>
              <or110:LastTravelDate>221202</or110:LastTravelDate>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0025</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-12-02</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>LHR</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
    </tir310:OpenReservationElements>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
```
{{< /details >}}

## Отмена мест в салоне (AirSeatCancelLLSRQ)

Для отмены забронированных мест в салоне используется сервис [AirSeatCancelLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/cancel_air_seat). 

В запросе необходимо указать на выбор:
- для удаления всех забронированных мест:
    - ```/AirSeatCancelRQ/Seats/Seat/@All``` — значение ```true```
- для удаления всех забронированных мест на рейсах определенного перевозчика:
    - ```/AirSeatCancelRQ/Seats/Seat/VendorPrefs/Airline/@Code``` — код перевозчика
- для удаления всех забронированных мест на определенном сегменте: 
    - ```/AirSeatCancelRQ/Seats/Seat/@SegmentNumber``` — номер сегмента в бронировании
- для удаления определенного забронированного места на определенном сегменте: 
    - ```/AirSeatCancelRQ/Seats/Seat/@SegmentNumber``` — номер сегмента в бронировании
    - ```/AirSeatCancelRQ/Seats/Seat/@SeatNumber``` — номер места
- для удаления определенного забронированного места для определенного пассажира: 
    - ```/AirSeatCancelRQ/Seats/Seat/@SegmentNumber``` — номер сегмента в бронировании
    - ```/AirSeatCancelRQ/Seats/Seat/@NameNumber``` — номер пассажира в бронировании

{{< details title="Пример запроса" >}}
```XML
<AirSeatCancelRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Seats>
    <Seat All="true"/>
  </Seats>
</AirSeatCancelRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<AirSeatCancelRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-20T05:47:04-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52D84B">4GXALL</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</AirSeatCancelRS>
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
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-20T05:47:11.462-05:00"/>
  </ApplicationResults>
  <ItineraryRef ID="TGNUYC">
    <Source CreateDateTime="2022-05-20T05:47"/>
  </ItineraryRef>
  <Text>OK 0547 TGNUYC</Text>
</EnhancedEndTransactionRS>
```
{{< /details >}}
