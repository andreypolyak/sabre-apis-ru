# Бронирование мест в салоне

Для бронирования мест в салоне используется сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record).

В запросе необходимо указать:
- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/AirSeat/Seats/Seat``` — место в салоне (отдельный элемент для каждого места в салоне)
    ```/@NameNumber``` — номер пассажира
    ```/@Number``` — номер места
    ```/@SegmentNumber``` — номер сегмента в бронировании
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ/Source/@ReceivedFrom``` — значение поля Received From при сохранении бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

Для бронирования мест в салоне в другом PCC его можно указать в качестве значения атрибута ```/UpdatePassengerNameRecordRQ/@targetCity```.

*Обратите внимание на то, что для платных мест обязательно требуется оформление EMD. EMD должны быть оформлены в бронировании после оформления билетов. Процесс оформления EMD подробно описан в разделе [Оформление билетов и EMD](issue-ticket.md).*

{% xmlsec "Пример запроса", false %}
<UpdatePassengerNameRecordRQ haltOnAirPriceError="true" targetCity="2FRH" version="1.0.0" xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <Itinerary id="YKPIML"/>
  <SpecialReqDetails>
    <AirSeat>
      <Seats>
        <Seat NameNumber="1.1" Number="8A" SegmentNumber="1"/>
        <Seat NameNumber="2.1" Number="8B" SegmentNumber="1"/>
        <Seat NameNumber="3.1" Number="8C" SegmentNumber="1"/>
        <Seat NameNumber="1.1" Number="8A" SegmentNumber="2"/>
        <Seat NameNumber="2.1" Number="8B" SegmentNumber="2"/>
        <Seat NameNumber="3.1" Number="8C" SegmentNumber="2"/>
      </Seats>
    </AirSeat>
  </SpecialReqDetails>
  <PostProcessing>
    <EndTransaction>
      <Source ReceivedFrom="API"/>
    </EndTransaction>
    <RedisplayReservation/>
  </PostProcessing>
</UpdatePassengerNameRecordRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-23T08:59:38.335-06:00"/>
    <Warning timeStamp="2020-01-23T08:59:32.380-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-23T08:59:33.315-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-23T08:59:34.220-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-23T08:59:35.193-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-23T08:59:36.075-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-23T08:59:37.070-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">CreatePassengerNameRecordRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="YKPIML"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>EKATERINA</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1755/23JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-23T17:55" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="1555.00" CurrencyCode="EUR"/>
                  <EquivFare Amount="106520" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="17600" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">13700YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1349RI</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">449UH</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1261AE</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">84TP</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">168ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">589F6</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="124120" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3110.00"/>
                    <EquivFare Amount="213040"/>
                    <Taxes>
                      <Tax Amount="35200"/>
                    </Taxes>
                    <TotalFare Amount="248240"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLRTRU/YF/BLRTRU/YF"/>
                  <FareCalculation>
                    <Text>MOW EY AUH Q3.00 1005.47EY MOW Q3.00 710.36NUC1721.83END ROE0.903053</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLRTRU/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="68"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="BLRTRU/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="65"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="DME"/>
                  </FlightSegment>
                  <FareComponent Amount="100547" FareBasisCode="YLRTRU/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="AUH" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="71036" FareBasisCode="BLRTRU/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="MOW" Origin="AUH"/>
                    <Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="01.01">IVANOV/IVAN MR</PassengerData>
                <PassengerData NameNumber="02.01">IVANOVA/ELENA MS</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="2">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1755/23JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-23T17:55" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="1168.00" CurrencyCode="EUR"/>
                  <EquivFare Amount="80010" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="17600" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">13700YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1349RI</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">449UH</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1261AE</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">84TP</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">168ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">589F6</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="97610" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="1168.00"/>
                    <EquivFare Amount="80010"/>
                    <Taxes>
                      <Tax Amount="17600"/>
                    </Taxes>
                    <TotalFare Amount="97610"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLRTRUCH/YF/BLRTRUCH/YF"/>
                  <FareCalculation>
                    <Text>MOW EY AUH Q3.00 754.10EY MOW Q3.00 532.77NUC1292.87END ROE0.903053</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLRTRUCH/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="68"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="BLRTRUCH/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="65"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="DME"/>
                  </FlightSegment>
                  <FareComponent Amount="75410" FareBasisCode="YLRTRUCH/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="AUH" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="53277" FareBasisCode="BLRTRUCH/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="MOW" Origin="AUH"/>
                    <Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="CNN">
                <PassengerData NameNumber="03.01">IVANOV/ANDREY</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="3">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1755/23JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-23T17:55" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="161.00" CurrencyCode="EUR"/>
                  <EquivFare Amount="11030" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="2460" TaxCode="YQ"/>
                  </Taxes>
                  <TotalFare Amount="13490" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="161.00"/>
                    <EquivFare Amount="11030"/>
                    <Taxes>
                      <Tax Amount="2460"/>
                    </Taxes>
                    <TotalFare Amount="13490"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLRTRUIN/YF/BLRTRUIN/YF"/>
                  <FareCalculation>
                    <Text>MOW EY AUH Q3.00 100.54EY MOW Q3.00 71.03NUC177.57END ROE0.903053</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T12:40" FlightNumber="68" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLRTRUIN/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="68"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:25" FlightNumber="65" ResBookDesigCode="B" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="BLRTRUIN/YF"/>
                    <MarketingAirline Code="EY" FlightNumber="65"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="DME"/>
                  </FlightSegment>
                  <FareComponent Amount="10054" FareBasisCode="YLRTRUIN/YF" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="AUH" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T18:55" DepartureDateTime="09-01T12:40"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="7103" FareBasisCode="BLRTRUIN/YF" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="YF">
                    <Location Destination="MOW" Origin="AUH"/>
                    <Dates ArrivalDateTime="09-08T06:50" DepartureDateTime="09-08T02:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="INF">
                <PassengerData NameNumber="04.01">IVANOVA/EKATERINA</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="4439.00"/>
            <EquivFare Amount="304080.00"/>
            <Taxes>
              <Tax Amount="55260.00"/>
            </Taxes>
            <TotalFare Amount="359340.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="2295" ArrivalDateTime="09-01T18:55" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T12:40" ElapsedTime="05.15" FlightNumber="0068" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-23T08:55:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="321"/>
              <MarketingAirline Code="EY" FlightNumber="0068" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0068" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="DME"/>
              <SupplierRef ID="DCEY*HRPXWI"/>
              <UpdatedArrivalTime>09-01T18:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-01T12:40</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>DME</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>321</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>68</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>M</MealCode>
                  <ElapsedTime>315</ElapsedTime>
                  <AirMilesFlown>2295</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*HRPXWI</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-01T12:40:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-01T18:55:00</ArrivalDateTime>
                  <FlightNumber>68</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-23T08:55:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="2295" ArrivalDateTime="09-08T06:50" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:25" ElapsedTime="05.25" FlightNumber="0065" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="B" SegmentBookedDate="2020-01-23T08:55:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="DME"/>
              <Equipment AirEquipType="321"/>
              <MarketingAirline Code="EY" FlightNumber="0065" ResBookDesigCode="B">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0065" ResBookDesigCode="B">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*HRPXWI"/>
              <UpdatedArrivalTime>09-08T06:50</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:25</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>DME</ArrivalAirport>
                  <EquipmentType>321</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>65</MarketingFlightNumber>
                  <MarketingClassOfService>B</MarketingClassOfService>
                  <MealCode>M</MealCode>
                  <ElapsedTime>325</ElapsedTime>
                  <AirMilesFlown>2295</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*HRPXWI</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:25:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T06:50:00</ArrivalDateTime>
                  <FlightNumber>65</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-23T08:55:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="1" TicketingIndicator="0" id="28">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08A</PdcSeat>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0068</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="4">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="2" TicketingIndicator="0" id="31">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08B</PdcSeat>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0068</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="5">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200901" InterlineIndicator="N" LastTravelDate="200901" NameNumber="03.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="3" TicketingIndicator="0" id="34">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08C</PdcSeat>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0068</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="6">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="4" TicketingIndicator="0" id="37">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08A</PdcSeat>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0065</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="7">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="5" TicketingIndicator="0" id="40">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08B</PdcSeat>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0065</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="8">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="200908" InterlineIndicator="N" LastTravelDate="200908" NameNumber="03.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="N" SegmentIndicator="S" SequenceNumber="6" TicketingIndicator="0" id="43">
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="923"/>
                <TTLPrice Currency="RUB" Price="923"/>
                <OriginalBasePrice Currency="USD" Price="15.00"/>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="15.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="923"/>
                <TotalTTLPrice Currency="RUB" Price="923"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>08C</PdcSeat>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0065</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="9">
            <Seats>
              <Seat Changed="N" Id="27" NameNumber="01.01" Number="08A" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WM">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="DME"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="30" NameNumber="02.01" Number="08B" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="M">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="DME"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="33" NameNumber="03.01" Number="08C" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="AM">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="DME"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="36" NameNumber="01.01" Number="08A" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WM">
                <FlightSegment>
                  <DestinationLocation LocationCode="DME"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="39" NameNumber="02.01" Number="08B" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="M">
                <FlightSegment>
                  <DestinationLocation LocationCode="DME"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="42" NameNumber="03.01" Number="08C" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="AM">
                <FlightSegment>
                  <DestinationLocation LocationCode="DME"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
            </Seats>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="true" ID="YKPIML" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-23T08:55" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-23T08:59" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
      </ItineraryRef>
      <SpecialServiceInfo Id="9" RPH="001" Type="AFX">
        <Service SSR_Code="OSI">
          <PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</PersonName>
          <Text>AA INF</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="18" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="19" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
          <ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
            <FreeText>INF</FreeText>
            <FullText>AA INF</FullText>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>EKATERINA</FirstName>
            <ReferenceId>4</ReferenceId>
            <NameRefNumber>04.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0068</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>DME</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0065</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>DME</OffPoint>
              <ClassOfService>B</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM EY HK1/79851234567/RU</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>79851234567</PhoneNumber>
              <Language>RU</Language>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
              <Language>RU</Language>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>20NOV1980</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>IVAN</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>true</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>2234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15AUG2025</DocumentExpirationDate>
              <DateOfBirth>20JAN1980</DateOfBirth>
              <Gender>F</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>ELENA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>3234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>15JAN2012</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>ANDREY</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2019</DateOfBirth>
              <Gender>FI</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>EKATERINA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>true</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
          <Email comment="BC/" type="BC">
            <Address>AGENCY@AGENCY.COM</Address>
          </Email>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
          <Email comment="TO/" type="TO">
            <Address>CUSTOMER@CUSTOMER.COM</Address>
          </Email>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-ec8b98d7-996a-4036-89b5-33c1b35642e0" id="ec8b98d7-996a-4036-89b5-33c1b35642e0" type="APO">
          <AncillaryProduct Id="1">
            <XmlData>
              <AncillaryServiceData id="28">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOV</LastName>
                    <FirstName>IVAN MR</FirstName>
                    <ReferenceId>1</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>2</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08A</PdcSeat>
                <FirstTravelDate>200901</FirstTravelDate>
                <LastTravelDate>200901</LastTravelDate>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>68</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-a9e75c25-fcc9-4afc-87de-951318d142e9" id="a9e75c25-fcc9-4afc-87de-951318d142e9" type="APO">
          <AncillaryProduct Id="2">
            <XmlData>
              <AncillaryServiceData id="31">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOVA</LastName>
                    <FirstName>ELENA MS</FirstName>
                    <ReferenceId>2</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>2</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08B</PdcSeat>
                <FirstTravelDate>200901</FirstTravelDate>
                <LastTravelDate>200901</LastTravelDate>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>68</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-8d6eebcd-1172-4d75-9378-53cc92bfe2bc" id="8d6eebcd-1172-4d75-9378-53cc92bfe2bc" type="APO">
          <AncillaryProduct Id="3">
            <XmlData>
              <AncillaryServiceData id="34">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOV</LastName>
                    <FirstName>ANDREY</FirstName>
                    <ReferenceId>3</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>2</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>DME</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08C</PdcSeat>
                <FirstTravelDate>200901</FirstTravelDate>
                <LastTravelDate>200901</LastTravelDate>
                <PurchaseTimestamp>2020-08-30T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>68</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2020-09-01</DepartureDate>
                  <BoardPoint>DME</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-889a441b-b031-4b13-94fa-8e6c254c6b75" id="889a441b-b031-4b13-94fa-8e6c254c6b75" type="APO">
          <AncillaryProduct Id="4">
            <XmlData>
              <AncillaryServiceData id="37">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOV</LastName>
                    <FirstName>IVAN MR</FirstName>
                    <ReferenceId>1</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>3</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08A</PdcSeat>
                <FirstTravelDate>200908</FirstTravelDate>
                <LastTravelDate>200908</LastTravelDate>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>65</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-a31a31f4-86aa-4eaf-8f5c-932254b1cea4" id="a31a31f4-86aa-4eaf-8f5c-932254b1cea4" type="APO">
          <AncillaryProduct Id="5">
            <XmlData>
              <AncillaryServiceData id="40">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOVA</LastName>
                    <FirstName>ELENA MS</FirstName>
                    <ReferenceId>2</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>3</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08B</PdcSeat>
                <FirstTravelDate>200908</FirstTravelDate>
                <LastTravelDate>200908</LastTravelDate>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>65</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-79e9d246-62f5-480a-a4aa-d6ea74c4f34d" id="79e9d246-62f5-480a-a4aa-d6ea74c4f34d" type="APO">
          <AncillaryProduct Id="6">
            <XmlData>
              <AncillaryServiceData id="43">
                <NameAssociationList>
                  <NameAssociationTag>
                    <LastName>IVANOV</LastName>
                    <FirstName>ANDREY</FirstName>
                    <ReferenceId>3</ReferenceId>
                  </NameAssociationTag>
                </NameAssociationList>
                <SegmentAssociationList>
                  <SegmentAssociationId>3</SegmentAssociationId>
                </SegmentAssociationList>
                <CommercialName>ECONOMY STANDARD</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>N</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>DME</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>15.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>923</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>08C</PdcSeat>
                <FirstTravelDate>200908</FirstTravelDate>
                <LastTravelDate>200908</LastTravelDate>
                <PurchaseTimestamp>2020-09-06T00:00:00</PurchaseTimestamp>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>65</FlightNumber>
                  <ClassOfService>B</ClassOfService>
                  <DepartureDate>2020-09-08</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>DME</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
      </OpenReservationElements>
    </TravelItinerary>
  </TravelItineraryRead>
</UpdatePassengerNameRecordRS>
{% endxmlsec %}
