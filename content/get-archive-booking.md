---
title: Чтение бронирований из архива
---

{{< hint warning >}}
Для чтения бронирований из архива в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Через некоторое время после того, как проходит время вылета для всех сегментов в бронировании, оно попадает в архив. Бронирования, находящиеся в архиве, можно читать, но нельзя изменять.

Для чтения бронирований из архива используется сервис [Trip_SearchRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/search_for_itineraries).

В запросе необходимо указать:
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/LocatorCriteria/Locator/@Id``` — код бронирования (PNR Record Locator)
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/PosCriteria/@AnyBranch``` — признак поиска бронирования во всех PCC, с которыми у текущего PCC есть [Branch Access](configuration.html#доступ-в-другой-pcc-branch-access). Рекомендуется всегда указывать значение ```true```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@MaxItemsReturned``` — максимальное количество найденных бронирований. Рекомендуется всегда указывать значение ```1```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@ResponseFormat``` — формат ответа. Всегда значение ```STL```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@SearchType``` — тип поиска. Всегда значение ```INACTIVE```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@ViewName``` — вид ответа. Всегда значение ```PastDate-TN```

{{< details title="Пример запроса" >}}
```XML
<Trip_SearchRQ Version="4.5.0" xmlns="http://webservices.sabre.com/triprecord">
  <ReadRequests>
    <ReservationReadRequest>
      <LocatorCriteria>
        <Locator Id="AOQGNL"/>
      </LocatorCriteria>
      <PosCriteria AnyBranch="true"/>
      <ReturnOptions MaxItemsReturned="1" ResponseFormat="STL" SearchType="INACTIVE" ViewName="PastDate-TN"/>
    </ReservationReadRequest>
  </ReadRequests>
</Trip_SearchRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<Trip_SearchRS Target="Production" TimeStamp="2022-05-19T14:52:52" Version="4.5.0" xmlns="http://webservices.sabre.com/triprecord" xmlns:ns10="http://services.sabre.com/STL_Header/v02_00" xmlns:ns11="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns12="http://opentravel.org/common/v02" xmlns:ns13="http://www.sabre.com/eps/schemas" xmlns:ns14="http://tds.sabre.com/distribution" xmlns:ns15="http://webservices.sabre.com/servicesplatform/orr/rules/1.0.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns24="http://services.sabre.com/res/or/v1_14" xmlns:ns3="http://webservices.sabre.com/pnrbuilder" xmlns:ns4="http://webservices.sabre.com/sabreXML/2003/07" xmlns:ns5="http://tds.sabre.com/rules" xmlns:ns6="http://tds.sabre.com/itinerary" xmlns:ns7="http://services.sabre.com/res/orr/v0" xmlns:ns8="http://services.sabre.com/STL/v02" xmlns:ns9="http://www.sabre.com/ssg/des/v1" xmlns:or16="http://services.sabre.com/res/or/v1_6" xmlns:or17="http://services.sabre.com/res/or/v1_7" xmlns:or18="http://services.sabre.com/res/or/v1_8" xmlns:or19="http://services.sabre.com/res/or/v1_9" xmlns:stl114="http://webservices.sabre.com/pnrbuilder/v1_14" xmlns:stl115="http://webservices.sabre.com/pnrbuilder/v1_15" xmlns:stl119="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:tir37="http://services.sabre.com/res/tir/v3_7" xmlns:tir39="http://services.sabre.com/res/tir/v3_9">
  <Success>Success</Success>
  <ReservationsList NumberPages="1" NumberResults="1" TotalResults="1">
    <Reservations>
      <Reservation Locator="AOQGNL" PastDate="true" PurgeDate="2022-03-26T00:00:00">
        <stl19:GetReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
          <stl19:Reservation NumberInSegment="1" numberInParty="1" numberOfInfants="0">
            <stl19:BookingDetails>
              <stl19:RecordLocator>AOQGNL</stl19:RecordLocator>
              <stl19:CreationTimestamp>2022-03-09T03:24:00</stl19:CreationTimestamp>
              <stl19:SystemCreationTimestamp>2022-03-09T03:24:00</stl19:SystemCreationTimestamp>
              <stl19:CreationAgentID>HPA</stl19:CreationAgentID>
              <stl19:UpdateTimestamp>2022-03-09T16:59:52</stl19:UpdateTimestamp>
              <stl19:PNRSequence>6</stl19:PNRSequence>
              <stl19:FlightsRange End="2022-03-11T16:00:00" Start="2022-03-11T15:00:00"/>
              <stl19:DivideSplitDetails/>
              <stl19:EstimatedPurgeTimestamp>2022-03-26T00:00:00</stl19:EstimatedPurgeTimestamp>
              <stl19:UpdateToken>-6c3cd0764fa79706c7a90950cb569b15d9eafc8a484788ec</stl19:UpdateToken>
            </stl19:BookingDetails>
            <stl19:POS AirExtras="false" InhibitCode="U">
              <stl19:Source AgentDutyCode="*" AgentSine="HPA" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="LRQ" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
            </stl19:POS>
            <stl19:PassengerReservation>
              <stl19:Passengers>
                <stl19:Passenger elementId="pnr-7.1" id="7" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT">
                  <stl19:LastName>IVANOV</stl19:LastName>
                  <stl19:FirstName>IVAN MR</stl19:FirstName>
                  <stl19:SpecialRequests>
                    <stl19:TicketingRequest>
                      <stl19:TicketType>G</stl19:TicketType>
                      <stl19:ValidatingCarrier>JU</stl19:ValidatingCarrier>
                      <stl19:ActionCode>HK</stl19:ActionCode>
                      <stl19:NumberInParty>1</stl19:NumberInParty>
                      <stl19:BoardPoint>SVO</stl19:BoardPoint>
                      <stl19:OffPoint>BEG</stl19:OffPoint>
                      <stl19:ClassOfService>Y</stl19:ClassOfService>
                      <stl19:DateOfTravel>2022-03-11T00:00:00</stl19:DateOfTravel>
                      <stl19:TicketNumber>1159419628217C1</stl19:TicketNumber>
                    </stl19:TicketingRequest>
                  </stl19:SpecialRequests>
                  <stl19:Seats/>
                </stl19:Passenger>
              </stl19:Passengers>
              <stl19:Segments>
                <stl19:Poc>
                  <stl19:Airport>SVO</stl19:Airport>
                  <stl19:Departure>2022-03-11T15:00:00</stl19:Departure>
                </stl19:Poc>
                <stl19:Segment id="3" sequence="1">
                  <stl19:Air CodeShare="false" DayOfWeekInd="5" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="3" isPast="true" segmentAssociationId="2" sequence="1">
                    <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
                    <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
                    <stl19:ArrivalAirport>BEG</stl19:ArrivalAirport>
                    <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
                    <stl19:OperatingAirlineCode>JU</stl19:OperatingAirlineCode>
                    <stl19:OperatingAirlineShortName>AIR SERBIA</stl19:OperatingAirlineShortName>
                    <stl19:OperatingFlightNumber>0651</stl19:OperatingFlightNumber>
                    <stl19:EquipmentType>319</stl19:EquipmentType>
                    <stl19:MarketingAirlineCode>JU</stl19:MarketingAirlineCode>
                    <stl19:MarketingFlightNumber>0651</stl19:MarketingFlightNumber>
                    <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
                    <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
                    <stl19:MarriageGrp>
                      <stl19:Ind>0</stl19:Ind>
                      <stl19:Group>0</stl19:Group>
                      <stl19:Sequence>0</stl19:Sequence>
                    </stl19:MarriageGrp>
                    <stl19:Seats/>
                    <stl19:AirlineRefId>DCJU*CBKVGO</stl19:AirlineRefId>
                    <stl19:Eticket>true</stl19:Eticket>
                    <stl19:DepartureDateTime>2022-03-11T15:00:00</stl19:DepartureDateTime>
                    <stl19:ArrivalDateTime>2022-03-11T16:00:00</stl19:ArrivalDateTime>
                    <stl19:FlightNumber>0651</stl19:FlightNumber>
                    <stl19:ClassOfService>Y</stl19:ClassOfService>
                    <stl19:ActionCode>HX</stl19:ActionCode>
                    <stl19:NumberInParty>1</stl19:NumberInParty>
                    <stl19:SegmentSpecialRequests>
                      <stl19:GenericSpecialRequest id="13" msgType="S" type="G">
                        <stl19:Code>TKNE</stl19:Code>
                        <stl19:FreeText>JU HK1 SVOBEG0651Y11MAR/1159419628217C1</stl19:FreeText>
                        <stl19:ActionCode>HK</stl19:ActionCode>
                        <stl19:NumberInParty>1</stl19:NumberInParty>
                        <stl19:AirlineCode>JU</stl19:AirlineCode>
                        <stl19:TicketNumber>1159419628217</stl19:TicketNumber>
                        <stl19:FullText>TKNE JU HK1 SVOBEG0651Y11MAR/1159419628217C1</stl19:FullText>
                      </stl19:GenericSpecialRequest>
                    </stl19:SegmentSpecialRequests>
                    <stl19:inboundConnection>false</stl19:inboundConnection>
                    <stl19:outboundConnection>false</stl19:outboundConnection>
                    <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
                    <stl19:SegmentBookedDate>2022-03-09T03:24:00</stl19:SegmentBookedDate>
                    <stl19:Banner>MARKETED BY AIR SERBIA</stl19:Banner>
                    <stl19:Informational>false</stl19:Informational>
                  </stl19:Air>
                </stl19:Segment>
              </stl19:Segments>
              <stl19:TicketingInfo>
                <stl19:AlreadyTicketed elementId="pnr-12" id="12" index="1">
                  <stl19:Code>T-09MAR-2FRH*HPA</stl19:Code>
                </stl19:AlreadyTicketed>
                <stl19:ETicketNumber elementId="pnr-10" id="10" index="2">TE 1159419628217-RU IVANO/I 2FRH*HPA 1224/09MAR*I</stl19:ETicketNumber>
                <stl19:ETicketNumber elementId="pnr-15" id="15" index="3">TR 1159419628217-RU IVANO/I 2FRH*HPA 1225/09MAR*I</stl19:ETicketNumber>
                <stl19:TicketDetails elementId="pnr-10" id="10" index="2">
                  <stl19:OriginalTicketDetails>TE 1159419628217-RU IVANO/I 2FRH*HPA 1224/09MAR*I</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
                  <stl19:TicketNumber>1159419628217</stl19:TicketNumber>
                  <stl19:PassengerName>IVANO/I</stl19:PassengerName>
                  <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
                  <stl19:DutyCode>*</stl19:DutyCode>
                  <stl19:AgentSine>HPA</stl19:AgentSine>
                  <stl19:Timestamp>2022-03-09T12:24:00</stl19:Timestamp>
                  <stl19:PaymentType>*</stl19:PaymentType>
                </stl19:TicketDetails>
                <stl19:TicketDetails elementId="pnr-15" id="15" index="3">
                  <stl19:OriginalTicketDetails>TR 1159419628217-RU IVANO/I 2FRH*HPA 1225/09MAR*I</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>TR</stl19:TransactionIndicator>
                  <stl19:TicketNumber>1159419628217</stl19:TicketNumber>
                  <stl19:PassengerName>IVANO/I</stl19:PassengerName>
                  <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
                  <stl19:DutyCode>*</stl19:DutyCode>
                  <stl19:AgentSine>HPA</stl19:AgentSine>
                  <stl19:Timestamp>2022-03-09T12:25:00</stl19:Timestamp>
                  <stl19:PaymentType>*</stl19:PaymentType>
                </stl19:TicketDetails>
              </stl19:TicketingInfo>
              <stl19:ItineraryPricing/>
            </stl19:PassengerReservation>
            <stl19:ReceivedFrom>
              <stl19:Name>AP</stl19:Name>
            </stl19:ReceivedFrom>
            <stl19:PhoneNumbers>
              <stl19:PhoneNumber elementId="pnr-6" id="6" index="1">
                <stl19:CityCode>MOW</stl19:CityCode>
                <stl19:Number>9999999999-M</stl19:Number>
              </stl19:PhoneNumber>
            </stl19:PhoneNumbers>
            <stl19:Remarks>
              <stl19:Remark elementId="pnr-11" id="11" index="1" type="REG">
                <stl19:RemarkLines>
                  <stl19:RemarkLine>
                    <stl19:Text>XXTAW/</stl19:Text>
                  </stl19:RemarkLine>
                </stl19:RemarkLines>
              </stl19:Remark>
            </stl19:Remarks>
            <stl19:EmailAddresses/>
            <stl19:AccountingLines>
              <stl19:AccountingLine elementId="pnr-9" id="9" index="1">
                <stl19:FareApplication>ONE</stl19:FareApplication>
                <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
                <stl19:AirlineDesignator>JU</stl19:AirlineDesignator>
                <stl19:DocumentNumber>9419628217</stl19:DocumentNumber>
                <stl19:CommissionAmount>0</stl19:CommissionAmount>
                <stl19:BaseFare>55565</stl19:BaseFare>
                <stl19:TaxAmount>1810</stl19:TaxAmount>
                <stl19:GSTCode>C</stl19:GSTCode>
                <stl19:GSTAmount>0</stl19:GSTAmount>
                <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
                <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
                <stl19:TarriffBasis>F</stl19:TarriffBasis>
              </stl19:AccountingLine>
              <stl19:AccountingLine elementId="pnr-16" id="16" index="2">
                <stl19:TypeIndicator>R</stl19:TypeIndicator>
                <stl19:FareApplication>ONE</stl19:FareApplication>
                <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
                <stl19:AirlineDesignator>JU</stl19:AirlineDesignator>
                <stl19:DocumentNumber>9419628217</stl19:DocumentNumber>
                <stl19:CommissionAmount>0</stl19:CommissionAmount>
                <stl19:BaseFare>0</stl19:BaseFare>
                <stl19:TaxAmount>1230</stl19:TaxAmount>
                <stl19:GSTCode>C</stl19:GSTCode>
                <stl19:GSTAmount>0</stl19:GSTAmount>
                <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
                <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
                <stl19:NumberOfCoupons>1</stl19:NumberOfCoupons>
                <stl19:FullPartialExchangeIndicator>FULL</stl19:FullPartialExchangeIndicator>
                <stl19:OriginalInvoice/>
                <stl19:TarriffBasis>F</stl19:TarriffBasis>
              </stl19:AccountingLine>
            </stl19:AccountingLines>
            <stl19:GenericSpecialRequests id="19" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>MUST INSERT PAX CONTACT INFO WITH SSR CTCE AND SSR CTCM</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S MUST INSERT PAX CONTACT INFO WITH SSR CTCE AND SSR CTCM</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="20" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>OR SSR CTCR AS PER IATA RESO830D</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S OR SSR CTCR AS PER IATA RESO830D</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="22" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>ADTK BY 09MAR22 2359 LT HDQ OR JU SPACE WILL BE CXLD</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S ADTK BY 09MAR22 2359 LT HDQ OR JU SPACE WILL BE CXLD</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="24" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="25" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="26" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>ROBOT CANCEL - AUTO-CANCELED DUE TO LACK OF TICKET</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S ROBOT CANCEL - AUTO-CANCELED DUE TO LACK OF TICKET</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:GenericSpecialRequests id="27" msgType="S" type="A">
              <stl19:Code>OTHS</stl19:Code>
              <stl19:FreeText>CXLD AS TKTL EXPD - AIR SERBIA</stl19:FreeText>
              <stl19:AirlineCode>1S</stl19:AirlineCode>
              <stl19:FullText>OTHS 1S CXLD AS TKTL EXPD - AIR SERBIA</stl19:FullText>
            </stl19:GenericSpecialRequests>
            <stl19:History>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="6">
                  <stl19:HistoryTimestamp>2022-03-09T16:59:00</stl19:HistoryTimestamp>
                  <stl19:HomePCC>PLT</stl19:HomePCC>
                  <stl19:AgencyPCC>PLT</stl19:AgencyPCC>
                  <stl19:HistoryFrom>HDQBBJU092259 AB30AB8B-001 SYN</stl19:HistoryFrom>
                </stl19:Signature>
                <stl19:ItineraryHistory>
                  <stl19:AirSegment>
                    <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
                    <stl19:ArrivalAirport>BEG</stl19:ArrivalAirport>
                    <stl19:EquipmentType>319</stl19:EquipmentType>
                    <stl19:MarketingAirlineCode>JU</stl19:MarketingAirlineCode>
                    <stl19:MarketingFlightNumber>0651</stl19:MarketingFlightNumber>
                    <stl19:DepartureDateTime>2022-03-11T15:00:00</stl19:DepartureDateTime>
                    <stl19:ArrivalDateTime>2022-03-11T16:00:00</stl19:ArrivalDateTime>
                    <stl19:FlightNumber>0651</stl19:FlightNumber>
                    <stl19:ClassOfService>Y</stl19:ClassOfService>
                    <stl19:ActionCode>HX</stl19:ActionCode>
                    <stl19:NumberInParty>1</stl19:NumberInParty>
                    <stl19:HistoryAction>SC</stl19:HistoryAction>
                  </stl19:AirSegment>
                </stl19:ItineraryHistory>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION</stl19:FreeText>
                  <stl19:FullText>OTHS 1S HX CANCELED DUE TO SYSTEM OR PASSENGER ACTION</stl19:FullText>
                </stl19:FactHistory>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH</stl19:FreeText>
                  <stl19:FullText>OTHS 1S HX DELETE HX SEGS FROM PNR TO KEEP RES IN SYNCH</stl19:FullText>
                </stl19:FactHistory>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>ROBOT CANCEL - AUTO-CANCELED DUE TO LACK OF TICKET</stl19:FreeText>
                  <stl19:FullText>OTHS 1S ROBOT CANCEL - AUTO-CANCELED DUE TO LACK OF TICKET</stl19:FullText>
                </stl19:FactHistory>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>CXLD AS TKTL EXPD - AIR SERBIA</stl19:FreeText>
                  <stl19:FullText>OTHS 1S CXLD AS TKTL EXPD - AIR SERBIA</stl19:FullText>
                </stl19:FactHistory>
              </stl19:HistoryTransaction>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="5">
                  <stl19:HistoryTimestamp>2022-03-09T03:33:00</stl19:HistoryTimestamp>
                  <stl19:HomePCC>PLT</stl19:HomePCC>
                  <stl19:AgencyPCC>PLT</stl19:AgencyPCC>
                  <stl19:HistoryFrom>HDQBBJU090933 AB11F9D7-001 SSC</stl19:HistoryFrom>
                </stl19:Signature>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>ADTK BY 09MAR22 2359 LT HDQ OR JU SPACE WILL BE CXLD</stl19:FreeText>
                  <stl19:FullText>OTHS 1S ADTK BY 09MAR22 2359 LT HDQ OR JU SPACE WILL BE CXLD</stl19:FullText>
                </stl19:FactHistory>
              </stl19:HistoryTransaction>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="4">
                  <stl19:HistoryTimestamp>2022-03-09T03:27:00</stl19:HistoryTimestamp>
                  <stl19:HomePCC>PLT</stl19:HomePCC>
                  <stl19:AgencyPCC>PLT</stl19:AgencyPCC>
                  <stl19:HistoryFrom>HDQBBJU090927 AB184797-001 SSC</stl19:HistoryFrom>
                </stl19:Signature>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>MUST INSERT PAX CONTACT INFO WITH SSR CTCE AND SSR CTCM</stl19:FreeText>
                  <stl19:FullText>OTHS 1S MUST INSERT PAX CONTACT INFO WITH SSR CTCE AND SSR CTCM</stl19:FullText>
                </stl19:FactHistory>
                <stl19:FactHistory FactType="AA">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A4S</stl19:HistoryAction>
                  <stl19:Code>OTHS</stl19:Code>
                  <stl19:ActionId>1S</stl19:ActionId>
                  <stl19:FreeText>OR SSR CTCR AS PER IATA RESO830D</stl19:FreeText>
                  <stl19:FullText>OTHS 1S OR SSR CTCR AS PER IATA RESO830D</stl19:FullText>
                </stl19:FactHistory>
              </stl19:HistoryTransaction>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="3">
                  <stl19:HistoryTimestamp>2022-03-09T03:25:00</stl19:HistoryTimestamp>
                  <stl19:DutyCode>*</stl19:DutyCode>
                  <stl19:AgentSine>HPA</stl19:AgentSine>
                  <stl19:HomePCC>LRQ</stl19:HomePCC>
                  <stl19:AgencyPCC>2FRH</stl19:AgencyPCC>
                  <stl19:HistoryFrom>TKTEXCHANGEREFUNDRQ</stl19:HistoryFrom>
                </stl19:Signature>
                <stl19:TicketingHistory>
                  <stl19:OriginalTicketDetails>TR 1159419628217-RU IVANO/I 2FRH*HPA 1225/09MAR*I</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>TR</stl19:TransactionIndicator>
                  <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
                  <stl19:HistoryAction>A7</stl19:HistoryAction>
                </stl19:TicketingHistory>
                <stl19:AccountingLineHistory>
                  <stl19:HistoryAction>AAR</stl19:HistoryAction>
                  <stl19:AccountingLine>RJU$9419628217/      0/0/1230/C0/ONE/CA 1.1IVANOV IVAN MR/1/1/F/F</stl19:AccountingLine>
                </stl19:AccountingLineHistory>
              </stl19:HistoryTransaction>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="2">
                  <stl19:HistoryTimestamp>2022-03-09T03:24:00</stl19:HistoryTimestamp>
                  <stl19:DutyCode>*</stl19:DutyCode>
                  <stl19:AgentSine>HPA</stl19:AgentSine>
                  <stl19:HomePCC>LRQ</stl19:HomePCC>
                  <stl19:AgencyPCC>2FRH</stl19:AgencyPCC>
                  <stl19:HistoryFrom/>
                </stl19:Signature>
                <stl19:FactHistory FactType="GEN">
                  <stl19:Type>SSR</stl19:Type>
                  <stl19:HistoryAction>A3S</stl19:HistoryAction>
                  <stl19:Code>TKNE</stl19:Code>
                  <stl19:ActionId>JU</stl19:ActionId>
                  <stl19:ActionCode>HK</stl19:ActionCode>
                  <stl19:NumberInParty>1</stl19:NumberInParty>
                  <stl19:TicketNumber>1159419628217C1</stl19:TicketNumber>
                  <stl19:FreeText/>
                  <stl19:FullText>TKNE JU HK1 SVOBEG0651Y11MAR/1159419628217C1</stl19:FullText>
                </stl19:FactHistory>
                <stl19:TicketingHistory>
                  <stl19:OriginalTicketDetails>TAW/</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>TAW</stl19:TransactionIndicator>
                  <stl19:AgencyLocation/>
                  <stl19:HistoryAction>X7</stl19:HistoryAction>
                </stl19:TicketingHistory>
                <stl19:TicketingHistory>
                  <stl19:OriginalTicketDetails>T-09MAR-2FRH*HPA</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>T</stl19:TransactionIndicator>
                  <stl19:AgencyLocation/>
                  <stl19:HistoryAction>A7</stl19:HistoryAction>
                </stl19:TicketingHistory>
                <stl19:TicketingHistory>
                  <stl19:TktEntry>W$PQ1</stl19:TktEntry>
                  <stl19:HistoryAction>AT</stl19:HistoryAction>
                </stl19:TicketingHistory>
                <stl19:AccountingLineHistory>
                  <stl19:HistoryAction>AAC</stl19:HistoryAction>
                  <stl19:AccountingLine>JU$9419628217/      0/      55565/   1810/C0/ONE/CA 1.1IVANOV IVAN MR/1/F/E</stl19:AccountingLine>
                </stl19:AccountingLineHistory>
                <stl19:CommentHistory>
                  <stl19:HistoryAction>IN</stl19:HistoryAction>
                  <stl19:CommentText>VOICE NBR 0000024</stl19:CommentText>
                </stl19:CommentHistory>
              </stl19:HistoryTransaction>
              <stl19:HistoryTransaction>
                <stl19:Signature SequenceNbr="1">
                  <stl19:HistoryTimestamp>2022-03-09T03:24:00</stl19:HistoryTimestamp>
                  <stl19:DutyCode>*</stl19:DutyCode>
                  <stl19:AgentSine>HPA</stl19:AgentSine>
                  <stl19:HomePCC>LRQ</stl19:HomePCC>
                  <stl19:AgencyPCC>2FRH</stl19:AgencyPCC>
                  <stl19:HistoryFrom>AP</stl19:HistoryFrom>
                </stl19:Signature>
                <stl19:ItineraryHistory>
                  <stl19:AirSegment>
                    <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
                    <stl19:ArrivalAirport>BEG</stl19:ArrivalAirport>
                    <stl19:EquipmentType>319</stl19:EquipmentType>
                    <stl19:MarketingAirlineCode>JU</stl19:MarketingAirlineCode>
                    <stl19:MarketingFlightNumber>0651</stl19:MarketingFlightNumber>
                    <stl19:DepartureDateTime>2022-03-11T15:00:00</stl19:DepartureDateTime>
                    <stl19:ArrivalDateTime>2022-03-11T16:00:00</stl19:ArrivalDateTime>
                    <stl19:FlightNumber>0651</stl19:FlightNumber>
                    <stl19:ClassOfService>Y</stl19:ClassOfService>
                    <stl19:ActionCode>SS</stl19:ActionCode>
                    <stl19:NumberInParty>1</stl19:NumberInParty>
                    <stl19:HistoryAction>AS</stl19:HistoryAction>
                  </stl19:AirSegment>
                </stl19:ItineraryHistory>
                <stl19:TicketingHistory>
                  <stl19:OriginalTicketDetails>TAW/</stl19:OriginalTicketDetails>
                  <stl19:TransactionIndicator>TAW</stl19:TransactionIndicator>
                  <stl19:AgencyLocation/>
                  <stl19:HistoryAction>A7</stl19:HistoryAction>
                </stl19:TicketingHistory>
                <stl19:NameHistory>
                  <stl19:HistoryAction>AN</stl19:HistoryAction>
                  <stl19:NameSeqID>1</stl19:NameSeqID>
                  <stl19:LastName>IVANOV</stl19:LastName>
                  <stl19:FirstName>IVAN MR</stl19:FirstName>
                </stl19:NameHistory>
                <stl19:PhoneHistory>
                  <stl19:Location>M</stl19:Location>
                  <stl19:TJRCityCode>MOW</stl19:TJRCityCode>
                  <stl19:CityCode/>
                  <stl19:Extension/>
                  <stl19:Number>9999999999</stl19:Number>
                  <stl19:HistoryAction>A9</stl19:HistoryAction>
                </stl19:PhoneHistory>
                <stl19:PassengerDetailsHistory>
                  <stl19:HistoryAction>ADT</stl19:HistoryAction>
                  <stl19:NameID>1</stl19:NameID>
                  <stl19:PassengerDetailType/>
                  <stl19:PassengerDetails>
                    <stl19:PassengerType>
                      <stl19:PassengerType>ADT</stl19:PassengerType>
                    </stl19:PassengerType>
                  </stl19:PassengerDetails>
                </stl19:PassengerDetailsHistory>
              </stl19:HistoryTransaction>
            </stl19:History>
          </stl19:Reservation>
        </stl19:GetReservationRS>
      </Reservation>
    </Reservations>
  </ReservationsList>
</Trip_SearchRS>
```
{{< /details >}}
