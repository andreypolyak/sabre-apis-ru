---
title: Бронирование мест в салоне
---

Для бронирования мест в салоне используется сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record).

В запросе необходимо указать:
- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/AirSeat/Seats/Seat``` — место в салоне (отдельный элемент для каждого места в салоне)
    ```/@NameNumber``` — номер пассажира
    ```/@Number``` — номер места
    ```/@SegmentNumber``` — номер сегмента в бронировании
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ/Source/@ReceivedFrom``` — значение поля Received From при сохранении бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

Для выполнения операции в другом PCC его можно указать в качестве значения атрибута ```/UpdatePassengerNameRecordRQ/@targetCity```.

Дополнительно можно запросить проверку минимального стыковочного времени, указав значение ```true``` у атрибута ```/UpdatePassengerNameRecordRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку. Бронирование в этом случае сохранено не будет.

{{< hint danger >}}
Обратите внимание на то, что для платных мест обязательно требуется оформление EMD. EMD должны быть оформлены в бронировании после оформления билетов. Процесс оформления EMD подробно описан в разделе [Оформление билетов и EMD](issue-ticket.html).
{{< /hint >}}

{{< details title="Пример запроса" >}}
```XML
<UpdatePassengerNameRecordRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.1.0" xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <Itinerary id="TGNUYC"/>
  <SpecialReqDetails>
    <AirSeat>
      <Seats>
        <Seat NameNumber="1.1" Number="20A" SegmentNumber="1"/>
        <Seat NameNumber="2.1" Number="20B" SegmentNumber="1"/>
        <Seat NameNumber="3.1" Number="20C" SegmentNumber="1"/>
        <Seat NameNumber="1.1" Number="20A" SegmentNumber="2"/>
        <Seat NameNumber="2.1" Number="20B" SegmentNumber="2"/>
        <Seat NameNumber="3.1" Number="20C" SegmentNumber="2"/>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-20T05:46:44.906-05:00"/>
    <Warning timeStamp="2022-05-20T05:46:37.569-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-20T05:46:38.393-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-20T05:46:39.330-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-20T05:46:40.945-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-20T05:46:41.842-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-20T05:46:42.756-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirSeatLLSRQ: PAYMENT REQUIRED OR SEAT IS SUBJECT TO CANCELLATION BY CARRIER</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="TGNUYC"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-3.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-5.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-7.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-9.4">
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="184455" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="18041" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2700AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6678GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="202496" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="8198.00"/>
                    <EquivFare Amount="368910"/>
                    <Taxes>
                      <Tax Amount="36082"/>
                    </Taxes>
                    <TotalFare Amount="404992"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="139095" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8663" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="147758" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3091.00"/>
                    <EquivFare Amount="139095"/>
                    <Taxes>
                      <Tax Amount="8663"/>
                    </Taxes>
                    <TotalFare Amount="147758"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="404.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="18180" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4457" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="22637" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="404.00"/>
                    <EquivFare Amount="18180"/>
                    <Taxes>
                      <Tax Amount="4457"/>
                    </Taxes>
                    <TotalFare Amount="22637"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
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
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
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
            <BaseFare Amount="11693.00"/>
            <EquivFare Amount="526185.00"/>
            <Taxes>
              <Tax Amount="49202.00"/>
            </Taxes>
            <TotalFare Amount="575387.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="O" Sequence="1"/>
              <Meal Code="R"/>
              <OperatingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SYD"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-02T06:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-01T23:25</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SYD</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>2463</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>R</MealCode>
                  <ElapsedTime>795</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-01T23:25:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T06:40:00</ArrivalDateTime>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="I" Sequence="2"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-02T14:10</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-02T10:35</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>LHR</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>25</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>455</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-02T10:35:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T14:10:00</ArrivalDateTime>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="781"/>
              <MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="O" Sequence="1"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-08T19:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T08:30</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="3">
                  <DepartureAirport>LHR</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>781</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>12</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>410</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
                  <FlightNumber>12</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SYD"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="I" Sequence="2"/>
              <OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-09T17:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T22:10</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="4">
                  <DepartureAirport>AUH</DepartureAirport>
                  <ArrivalAirport>SYD</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>464</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <ElapsedTime>825</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
                  <FlightNumber>464</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="5">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="1" TicketingIndicator="0" id="33">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="8960"/>
                <TTLPrice Currency="RUB" Price="8960"/>
                <OriginalBasePrice Currency="USD" Price="140.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="140.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="8960"/>
                <TotalTTLPrice Currency="RUB" Price="8960"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20A</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="6">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="2" TicketingIndicator="0" id="36">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="8960"/>
                <TTLPrice Currency="RUB" Price="8960"/>
                <OriginalBasePrice Currency="USD" Price="140.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="140.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="8960"/>
                <TotalTTLPrice Currency="RUB" Price="8960"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20B</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="7">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221201" InterlineIndicator="N" LastTravelDate="221202" NameNumber="03.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="3" TicketingIndicator="0" id="39">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="8960"/>
                <TTLPrice Currency="RUB" Price="8960"/>
                <OriginalBasePrice Currency="USD" Price="140.00"/>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="140.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="8960"/>
                <TotalTTLPrice Currency="RUB" Price="8960"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20C</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="8">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="4" TicketingIndicator="0" id="42">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="7680"/>
                <TTLPrice Currency="RUB" Price="7680"/>
                <OriginalBasePrice Currency="USD" Price="120.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="120.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="7680"/>
                <TotalTTLPrice Currency="RUB" Price="7680"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20A</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0025</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="9">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="5" TicketingIndicator="0" id="45">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="7680"/>
                <TTLPrice Currency="RUB" Price="7680"/>
                <OriginalBasePrice Currency="USD" Price="120.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="120.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="7680"/>
                <TotalTTLPrice Currency="RUB" Price="7680"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20B</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0025</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="10">
            <Ancillaries>
              <AncillaryService ActionCode="HD" BookingIndicator=" " CommisionIndicator="N" FareGuaranteedIndicator="T" FeeApplicationIndicator="4" FirstTravelDate="221202" InterlineIndicator="N" LastTravelDate="221202" NameNumber="03.01" NumberOfItems="1" RefundFormIndicator=" " RefundIndicator="R" SegmentIndicator="S" SequenceNumber="6" TicketingIndicator="0" id="48">
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="7680"/>
                <TTLPrice Currency="RUB" Price="7680"/>
                <OriginalBasePrice Currency="USD" Price="120.00"/>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice Currency="USD" Price="120.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="7680"/>
                <TotalTTLPrice Currency="RUB" Price="7680"/>
                <BookingSource>0</BookingSource>
                <PdcSeat>20C</PdcSeat>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>0025</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="11">
            <Seats>
              <Seat Changed="N" Id="32" NameNumber="01.01" Number="20A" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WLMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="SYD"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="35" NameNumber="02.01" Number="20B" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="LMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="SYD"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="38" NameNumber="03.01" Number="20C" SegmentNumber="0001" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="ALMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="AUH"/>
                  <OriginLocation LocationCode="SYD"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="41" NameNumber="01.01" Number="20A" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="WLMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="LHR"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="44" NameNumber="02.01" Number="20B" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="LMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="LHR"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
              <Seat Changed="N" Id="47" NameNumber="03.01" Number="20C" SegmentNumber="0002" SegmentStatus="KK" SmokingPreference="N" Status="HRS" Type="P" TypeTwo="ALMO">
                <FlightSegment>
                  <DestinationLocation LocationCode="LHR"/>
                  <OriginLocation LocationCode="AUH"/>
                </FlightSegment>
              </Seat>
            </Seats>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="true" ID="TGNUYC" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-20T05:45" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-20T05:46" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="30" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="20" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="26" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="27" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="28" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
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
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
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
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
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
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2022</DateOfBirth>
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
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>2463</FlightNumber>
              <DepartureDate>2022-12-01</DepartureDate>
              <BoardPoint>SYD</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0025</FlightNumber>
              <DepartureDate>2022-12-02</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>LHR</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-26" id="26" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-27" id="27" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
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
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
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
        <OpenReservationElement elementId="pnr-or-8adfdc53-52d3-417a-9ecd-a46456a7bf41" id="8adfdc53-52d3-417a-9ecd-a46456a7bf41" type="APO">
          <AncillaryProduct Id="1">
            <XmlData>
              <AncillaryServiceData id="33">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20A</PdcSeat>
                <FirstTravelDate>221201</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-006c132e-ff0c-45c6-82c1-30211022d2a9" id="006c132e-ff0c-45c6-82c1-30211022d2a9" type="APO">
          <AncillaryProduct Id="2">
            <XmlData>
              <AncillaryServiceData id="36">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20B</PdcSeat>
                <FirstTravelDate>221201</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-cb5c64a3-657a-4cff-ba09-419bec336522" id="cb5c64a3-657a-4cff-ba09-419bec336522" type="APO">
          <AncillaryProduct Id="3">
            <XmlData>
              <AncillaryServiceData id="39">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>2</SegmentNumber>
                <EquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>SYD</BoardPoint>
                <OffPoint>AUH</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>140.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>8960</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20C</PdcSeat>
                <FirstTravelDate>221201</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="16" sequence="1">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-01</DepartureDate>
                  <BoardPoint>SYD</BoardPoint>
                  <OffPoint>AUH</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-2e686ae0-eb61-47d6-8b60-4e016d22f11b" id="2e686ae0-eb61-47d6-8b60-4e016d22f11b" type="APO">
          <AncillaryProduct Id="4">
            <XmlData>
              <AncillaryServiceData id="42">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20A</PdcSeat>
                <FirstTravelDate>221202</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-189138d5-ae13-4e04-bfbc-2b1981be79ee" id="189138d5-ae13-4e04-bfbc-2b1981be79ee" type="APO">
          <AncillaryProduct Id="5">
            <XmlData>
              <AncillaryServiceData id="45">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20B</PdcSeat>
                <FirstTravelDate>221202</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
                  <MarketingCarrier>EY</MarketingCarrier>
                  <OperatingCarrier>EY</OperatingCarrier>
                </Segment>
              </AncillaryServiceData>
            </XmlData>
          </AncillaryProduct>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-f931d984-1105-4c01-bb7e-9aed0d83e47c" id="f931d984-1105-4c01-bb7e-9aed0d83e47c" type="APO">
          <AncillaryProduct Id="6">
            <XmlData>
              <AncillaryServiceData id="48">
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
                <CommercialName>ECONOMY SPACE</CommercialName>
                <RficCode>A</RficCode>
                <RficSubcode>0B5</RficSubcode>
                <SSRCode>SEAT</SSRCode>
                <OwningCarrierCode>EY</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <SegmentNumber>3</SegmentNumber>
                <EquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </EquivalentPrice>
                <TTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TTLPrice>
                <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
                <OriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </OriginalBasePrice>
                <RefundIndicator>R</RefundIndicator>
                <CommisionIndicator>N</CommisionIndicator>
                <InterlineIndicator>N</InterlineIndicator>
                <FeeApplicationIndicator>4</FeeApplicationIndicator>
                <PassengerTypeCode>CNN</PassengerTypeCode>
                <BoardPoint>AUH</BoardPoint>
                <OffPoint>LHR</OffPoint>
                <TotalOriginalBasePrice>
                  <Price>120.00</Price>
                  <Currency>USD</Currency>
                </TotalOriginalBasePrice>
                <TotalEquivalentPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalEquivalentPrice>
                <TotalTTLPrice>
                  <Price>7680</Price>
                  <Currency>RUB</Currency>
                </TotalTTLPrice>
                <NumberOfItems>1</NumberOfItems>
                <ActionCode>HD</ActionCode>
                <SegmentIndicator>S</SegmentIndicator>
                <RefundFormIndicator/>
                <FareGuaranteedIndicator>T</FareGuaranteedIndicator>
                <BookingSource>0</BookingSource>
                <TicketingIndicator>0</TicketingIndicator>
                <PdcSeat>20C</PdcSeat>
                <FirstTravelDate>221202</FirstTravelDate>
                <LastTravelDate>221202</LastTravelDate>
                <GroupCode>SA</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <PaperDocRequired>N</PaperDocRequired>
                <EMDConsummedAtIssuance/>
                <TaxExemption>N</TaxExemption>
                <ACSCount>0</ACSCount>
                <Segment id="17" sequence="2">
                  <AirlineCode>EY</AirlineCode>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2022-12-02</DepartureDate>
                  <BoardPoint>AUH</BoardPoint>
                  <OffPoint>LHR</OffPoint>
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
```
{{< /details >}}
