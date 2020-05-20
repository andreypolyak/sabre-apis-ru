# Отмена мест в салоне

-----

**Оглавление:**
<!-- toc -->

-----

## Алгоритм отмены мест в салоне

{% imgsec "Схема", "0", "cancel-air-seats" %}./assets/svg/cancel-air-seats/cancel-air-seats.svg{% endimgsec %}

## Чтение бронирования (TravelItineraryReadRQ)

*Для отмены мест в салоне в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

*Обратите внимание на то, что при [отмене бронирования](cancel-booking.md) также будут отменены ассоциированные с этими сегментами места в салоне. Указанные ниже рекомендации следует применять только в том случае, если нужно отменить места в салоне без отмены бронирования.*

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="ZNFUYA"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T03:15:26.869-06:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:CustomerInfo>
      <tir310:ContactNumbers>
        <tir310:ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
        <tir310:ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
      </tir310:ContactNumbers>
      <tir310:PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</tir310:Email>
        <tir310:GivenName>IVAN MR</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ELENA MS</tir310:GivenName>
        <tir310:Surname>IVANOVA</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ANDREY</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
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
              <tir310:Text>2FRH 9LSC*AWT 1214/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-27T12:14" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="1555.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="106520" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="17607" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">13700YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1349RI</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">449UH</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1264AE</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">85TP</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">170ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">590F6</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="124127" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="3110.00"/>
                  <tir310:EquivFare Amount="213040"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="35214"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="248254"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - EY</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLRTRU/YF/BLRTRU/YF"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW EY AUH Q3.00 1005.47EY MOW Q3.00 710.36NUC1721.83END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLRTRU/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="68"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="BLRTRU/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="65"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="100547" FareBasisCode="YLRTRU/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="AUH" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="71036" FareBasisCode="BLRTRU/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="MOW" Origin="AUH"/>
                  <tir310:Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
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
              <tir310:Text>2FRH 9LSC*AWT 1214/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-27T12:14" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="1168.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="80010" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="17607" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">13700YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1349RI</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">449UH</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1264AE</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">85TP</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">170ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">590F6</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="97617" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="1168.00"/>
                  <tir310:EquivFare Amount="80010"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="17607"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="97617"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - EY</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLRTRUCH/YF/BLRTRUCH/YF"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW EY AUH Q3.00 754.10EY MOW Q3.00 532.77NUC1292.87END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="YLRTRUCH/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="68"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="35K"/>
                  <tir310:FareBasis Code="BLRTRUCH/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="65"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="75410" FareBasisCode="YLRTRUCH/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="AUH" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="53277" FareBasisCode="BLRTRUCH/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="MOW" Origin="AUH"/>
                  <tir310:Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
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
              <tir310:Text>2FRH 9LSC*AWT 1214/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-27T12:14" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="161.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="11030" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="2460" TaxCode="YQ"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="13490" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="161.00"/>
                  <tir310:EquivFare Amount="11030"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="2460"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="13490"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAEY$RQ</tir310:Text>
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
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>NON ENDO/ REF</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YLRTRUIN/YF/BLRTRUIN/YF"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW EY AUH Q3.00 100.54EY MOW Q3.00 71.03NUC177.57END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="YLRTRUIN/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="68"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="10K"/>
                  <tir310:FareBasis Code="BLRTRUIN/YF"/>
                  <tir310:MarketingAirline Code="EY" FlightNumber="65"/>
                  <tir310:OriginLocation LocationCode="AUH"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="10054" FareBasisCode="YLRTRUIN/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="AUH" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="7103" FareBasisCode="BLRTRUIN/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                  <tir310:Location Destination="MOW" Origin="AUH"/>
                  <tir310:Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
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
          <tir310:BaseFare Amount="4439.00"/>
          <tir310:EquivFare Amount="304080.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="55281.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="359361.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="2295" ArrivalDateTime="09-01T18:55" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T12:40" ElapsedTime="05.15" FlightNumber="0068" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-27T03:14:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:Equipment AirEquipType="321"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="0068" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="M"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="0068" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="DME"/>
            <tir310:SupplierRef ID="DCEY*ZZCIJY"/>
            <tir310:UpdatedArrivalTime>09-01T18:55</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T12:40</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>DME</or110:DepartureAirport>
                <or110:ArrivalAirport>AUH</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL 3</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>3</or110:ArrivalTerminalCode>
                <or110:EquipmentType>321</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>68</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>M</or110:MealCode>
                <or110:ElapsedTime>315</or110:ElapsedTime>
                <or110:AirMilesFlown>2295</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ZZCIJY</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T12:40:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T18:55:00</or110:ArrivalDateTime>
                <or110:FlightNumber>68</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T03:14:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="2295" ArrivalDateTime="09-08T06:50" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:25" ElapsedTime="05.25" FlightNumber="0065" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="B" SegmentBookedDate="2020-01-27T03:14:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="DME"/>
            <tir310:Equipment AirEquipType="321"/>
            <tir310:MarketingAirline Code="EY" FlightNumber="0065" ResBookDesigCode="B">
              <tir310:Banner>MARKETED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="M"/>
            <tir310:OperatingAirline Code="EY" FlightNumber="0065" ResBookDesigCode="B">
              <tir310:Banner>OPERATED BY ETIHAD AIRWAYS</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="EY"/>
            <tir310:DisclosureCarrier Code="EY" DOT="false">
              <tir310:Banner>ETIHAD AIRWAYS</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
            <tir310:SupplierRef ID="DCEY*ZZCIJY"/>
            <tir310:UpdatedArrivalTime>09-08T06:50</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T02:25</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>AUH</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL 3</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>3</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>DME</or110:ArrivalAirport>
                <or110:EquipmentType>321</or110:EquipmentType>
                <or110:MarketingAirlineCode>EY</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>65</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>B</or110:MarketingClassOfService>
                <or110:MealCode>M</or110:MealCode>
                <or110:ElapsedTime>325</or110:ElapsedTime>
                <or110:AirMilesFlown>2295</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="EY" DOT="false">
                  <or110:Banner>ETIHAD AIRWAYS</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCEY*ZZCIJY</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:25:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T06:50:00</or110:ArrivalDateTime>
                <or110:FlightNumber>65</or110:FlightNumber>
                <or110:ClassOfService>B</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T03:14:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="01.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="1" TicketingIndicator="0" id="28">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>DME</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08A</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-08-30T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0068</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-01</tir310:DepartureDate>
                <tir310:BoardPoint>DME</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="02.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="2" TicketingIndicator="0" id="31">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>DME</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08B</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-08-30T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0068</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-01</tir310:DepartureDate>
                <tir310:BoardPoint>DME</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="5">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="03.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="3" TicketingIndicator="0" id="34">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>CNN</tir310:PassengerTypeCode>
              <tir310:BoardPoint>DME</tir310:BoardPoint>
              <tir310:OffPoint>AUH</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08C</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-08-30T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0068</tir310:FlightNumber>
                <tir310:ClassOfService>Y</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-01</tir310:DepartureDate>
                <tir310:BoardPoint>DME</tir310:BoardPoint>
                <tir310:OffPoint>AUH</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="6">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="01.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="4" TicketingIndicator="0" id="37">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>DME</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08A</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-09-06T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0065</tir310:FlightNumber>
                <tir310:ClassOfService>B</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-08</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>DME</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="7">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="02.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="5" TicketingIndicator="0" id="40">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>ADT</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>DME</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08B</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-09-06T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0065</tir310:FlightNumber>
                <tir310:ClassOfService>B</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-08</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>DME</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="8">
          <tir310:Ancillaries>
            <tir310:AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="03.01" NumberOfItems="1" RefundIndicator="N" SegmentIndicator="S" SequenceNumber="6" TicketingIndicator="0" id="43">
              <tir310:CommercialName>ECONOMY STANDARD</tir310:CommercialName>
              <tir310:RficCode>A</tir310:RficCode>
              <tir310:RficSubcode>0B5</tir310:RficSubcode>
              <tir310:OwningCarrierCode>EY</tir310:OwningCarrierCode>
              <tir310:Vendor>ATP</tir310:Vendor>
              <tir310:EMDType>2</tir310:EMDType>
              <tir310:EquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TTLPrice Currency="RUB" Price="923"/>
              <tir310:OriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:PassengerTypeCode>CNN</tir310:PassengerTypeCode>
              <tir310:BoardPoint>AUH</tir310:BoardPoint>
              <tir310:OffPoint>DME</tir310:OffPoint>
              <tir310:TotalOriginalBasePrice Currency="USD" Price="15.00"/>
              <tir310:TotalEquivalentPrice Currency="RUB" Price="923"/>
              <tir310:TotalTTLPrice Currency="RUB" Price="923"/>
              <tir310:BookingSource>0</tir310:BookingSource>
              <tir310:PdcSeat>08C</tir310:PdcSeat>
              <tir310:PurchaseTimestamp>2020-09-06T00:00:00</tir310:PurchaseTimestamp>
              <tir310:GroupCode>SA</tir310:GroupCode>
              <tir310:TicketUsedForEMDPricing>N</tir310:TicketUsedForEMDPricing>
              <tir310:TaxExemption>N</tir310:TaxExemption>
              <tir310:Segment>
                <tir310:AirlineCode>EY</tir310:AirlineCode>
                <tir310:FlightNumber>0065</tir310:FlightNumber>
                <tir310:ClassOfService>B</tir310:ClassOfService>
                <tir310:DepartureDate>2020-09-08</tir310:DepartureDate>
                <tir310:BoardPoint>AUH</tir310:BoardPoint>
                <tir310:OffPoint>DME</tir310:OffPoint>
              </tir310:Segment>
            </tir310:AncillaryService>
          </tir310:Ancillaries>
        </tir310:Item>
        <tir310:Item RPH="9">
          <tir310:Seats>
            <tir310:Seat Changed="N" Id="27" NameNumber="01.01" Number="08A" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WM">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="DME"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="30" NameNumber="02.01" Number="08B" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="M">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="DME"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="33" NameNumber="03.01" Number="08C" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="AM">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="AUH"/>
                <tir310:OriginLocation LocationCode="DME"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="36" NameNumber="01.01" Number="08A" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WM">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="DME"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="39" NameNumber="02.01" Number="08B" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="M">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="DME"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
            <tir310:Seat Changed="N" Id="42" NameNumber="03.01" Number="08C" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="AM">
              <tir310:FlightSegment>
                <tir310:DestinationLocation LocationCode="DME"/>
                <tir310:OriginLocation LocationCode="AUH"/>
              </tir310:FlightSegment>
            </tir310:Seat>
          </tir310:Seats>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="true" ID="ZNFUYA" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-27T03:14" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-27T03:15" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
    </tir310:ItineraryRef>
    <tir310:SpecialServiceInfo Id="9" RPH="001" Type="AFX">
      <tir310:Service SSR_Code="OSI">
        <tir310:PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</tir310:PersonName>
        <tir310:Text>AA INF</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="18" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="19" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:OpenReservationElements>
      <or110:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or110:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or110:FreeText>INF</or110:FreeText>
          <or110:FullText>AA INF</or110:FullText>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>EKATERINA</or110:FirstName>
          <or110:ReferenceId>4</or110:ReferenceId>
          <or110:NameRefNumber>04.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0068</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0065</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
            <or110:ClassOfService>B</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>1234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>15APR2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20FEB2019</or110:DateOfBirth>
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
      <or110:OpenReservationElement elementId="pnr-or-03d3b15e-aa22-454e-83d1-d58f8126d6c3" id="03d3b15e-aa22-454e-83d1-d58f8126d6c3" type="APO">
        <or110:AncillaryProduct Id="1">
          <or110:XmlData>
            <or110:AncillaryServiceData id="28">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>DME</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08A</or110:PdcSeat>
              <or110:FirstTravelDate>200901</or110:FirstTravelDate>
              <or110:LastTravelDate>200901</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-08-30T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0068</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2020-09-01</or110:DepartureDate>
                <or110:BoardPoint>DME</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-ccd331fb-a30c-4251-a8f8-4da1ec1df630" id="ccd331fb-a30c-4251-a8f8-4da1ec1df630" type="APO">
        <or110:AncillaryProduct Id="2">
          <or110:XmlData>
            <or110:AncillaryServiceData id="31">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>DME</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08B</or110:PdcSeat>
              <or110:FirstTravelDate>200901</or110:FirstTravelDate>
              <or110:LastTravelDate>200901</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-08-30T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0068</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2020-09-01</or110:DepartureDate>
                <or110:BoardPoint>DME</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-2260a749-c83b-4faa-822a-ebf2273147c2" id="2260a749-c83b-4faa-822a-ebf2273147c2" type="APO">
        <or110:AncillaryProduct Id="3">
          <or110:XmlData>
            <or110:AncillaryServiceData id="34">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>2</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>CNN</or110:PassengerTypeCode>
              <or110:BoardPoint>DME</or110:BoardPoint>
              <or110:OffPoint>AUH</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08C</or110:PdcSeat>
              <or110:FirstTravelDate>200901</or110:FirstTravelDate>
              <or110:LastTravelDate>200901</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-08-30T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0068</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2020-09-01</or110:DepartureDate>
                <or110:BoardPoint>DME</or110:BoardPoint>
                <or110:OffPoint>AUH</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-af35dfa6-0ed5-4cc3-86ba-e42a556c34ff" id="af35dfa6-0ed5-4cc3-86ba-e42a556c34ff" type="APO">
        <or110:AncillaryProduct Id="4">
          <or110:XmlData>
            <or110:AncillaryServiceData id="37">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>DME</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08A</or110:PdcSeat>
              <or110:FirstTravelDate>200908</or110:FirstTravelDate>
              <or110:LastTravelDate>200908</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-09-06T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0065</or110:FlightNumber>
                <or110:ClassOfService>B</or110:ClassOfService>
                <or110:DepartureDate>2020-09-08</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>DME</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-d8c9b233-8b28-4c90-b6d4-cf9ed1016f42" id="d8c9b233-8b28-4c90-b6d4-cf9ed1016f42" type="APO">
        <or110:AncillaryProduct Id="5">
          <or110:XmlData>
            <or110:AncillaryServiceData id="40">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>ADT</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>DME</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08B</or110:PdcSeat>
              <or110:FirstTravelDate>200908</or110:FirstTravelDate>
              <or110:LastTravelDate>200908</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-09-06T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0065</or110:FlightNumber>
                <or110:ClassOfService>B</or110:ClassOfService>
                <or110:DepartureDate>2020-09-08</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>DME</or110:OffPoint>
                <or110:MarketingCarrier>EY</or110:MarketingCarrier>
                <or110:OperatingCarrier>EY</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-d76bfa8c-789c-4aea-b732-6be62d872961" id="d76bfa8c-789c-4aea-b732-6be62d872961" type="APO">
        <or110:AncillaryProduct Id="6">
          <or110:XmlData>
            <or110:AncillaryServiceData id="43">
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
              <or110:CommercialName>ECONOMY STANDARD</or110:CommercialName>
              <or110:RficCode>A</or110:RficCode>
              <or110:RficSubcode>0B5</or110:RficSubcode>
              <or110:OwningCarrierCode>EY</or110:OwningCarrierCode>
              <or110:Vendor>ATP</or110:Vendor>
              <or110:EMDType>2</or110:EMDType>
              <or110:NewMiscIndicator>0</or110:NewMiscIndicator>
              <or110:SegmentNumber>3</or110:SegmentNumber>
              <or110:EquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:EquivalentPrice>
              <or110:TTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TTLPrice>
              <or110:PortionOfTravelIndicator>S</or110:PortionOfTravelIndicator>
              <or110:OriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:OriginalBasePrice>
              <or110:RefundIndicator>N</or110:RefundIndicator>
              <or110:CommisionIndicator>N</or110:CommisionIndicator>
              <or110:InterlineIndicator>N</or110:InterlineIndicator>
              <or110:FeeApplicationIndicator>4</or110:FeeApplicationIndicator>
              <or110:PassengerTypeCode>CNN</or110:PassengerTypeCode>
              <or110:BoardPoint>AUH</or110:BoardPoint>
              <or110:OffPoint>DME</or110:OffPoint>
              <or110:TotalOriginalBasePrice>
                <or110:Price>15.00</or110:Price>
                <or110:Currency>USD</or110:Currency>
              </or110:TotalOriginalBasePrice>
              <or110:TotalEquivalentPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalEquivalentPrice>
              <or110:TotalTTLPrice>
                <or110:Price>923</or110:Price>
                <or110:Currency>RUB</or110:Currency>
              </or110:TotalTTLPrice>
              <or110:NumberOfItems>1</or110:NumberOfItems>
              <or110:ActionCode>HD</or110:ActionCode>
              <or110:SegmentIndicator>S</or110:SegmentIndicator>
              <or110:BookingSource>0</or110:BookingSource>
              <or110:TicketingIndicator>0</or110:TicketingIndicator>
              <or110:PdcSeat>08C</or110:PdcSeat>
              <or110:FirstTravelDate>200908</or110:FirstTravelDate>
              <or110:LastTravelDate>200908</or110:LastTravelDate>
              <or110:PurchaseTimestamp>2020-09-06T00:00:00</or110:PurchaseTimestamp>
              <or110:GroupCode>SA</or110:GroupCode>
              <or110:TicketUsedForEMDPricing>N</or110:TicketUsedForEMDPricing>
              <or110:PaperDocRequired>N</or110:PaperDocRequired>
              <or110:EMDConsummedAtIssuance/>
              <or110:TaxExemption>N</or110:TaxExemption>
              <or110:ACSCount>0</or110:ACSCount>
              <or110:AncillaryPriceQuoteData PriceQuoteIdCompressed="false"/>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>EY</or110:AirlineCode>
                <or110:FlightNumber>0065</or110:FlightNumber>
                <or110:ClassOfService>B</or110:ClassOfService>
                <or110:DepartureDate>2020-09-08</or110:DepartureDate>
                <or110:BoardPoint>AUH</or110:BoardPoint>
                <or110:OffPoint>DME</or110:OffPoint>
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
{% endxmlsec %}

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

{% xmlsec "Пример запроса", false %}
<AirSeatCancelRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Seats>
    <Seat All="true"/>
  </Seats>
</AirSeatCancelRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<AirSeatCancelRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T03:15:37-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="38D9EF">4GXALL</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</AirSeatCancelRS>
{% endxmlsec %}

## Сохранение бронирования (EnhancedEndTransactionRQ)

Для сохранения изменений в бронировании необходимо отправить запрос к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction). В результате выполнения запроса все изменения в бронировании, выполненные в текущей сессии, будут сохранены, а бронирование закрыто.

В запросе необходимо указать:
- ```/EnhancedEndTransactionRQ/EndTransaction/@Ind``` — признак сохранения бронирования (значение ```true```)
- ```/EnhancedEndTransactionRQ/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

{% xmlsec "Пример запроса", false %}
<EnhancedEndTransactionRQ version="1.0.0" xmlns="http://services.sabre.com/sp/eet/v1">
  <EndTransaction Ind="true"/>
  <Source ReceivedFrom="API"/>
</EnhancedEndTransactionRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<EnhancedEndTransactionRS xmlns="http://services.sabre.com/sp/eet/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-27T03:16:19.901-06:00"/>
  </ApplicationResults>
  <ItineraryRef ID="ZNFUYA">
    <Source CreateDateTime="2020-01-27T03:16"/>
  </ItineraryRef>
  <Text>OK 0316 ZNFUYA</Text>
</EnhancedEndTransactionRS>
{% endxmlsec %}
