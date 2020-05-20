# Редактирование бронирований

-----

**Оглавление:**
<!-- toc -->

-----

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
    <Success timeStamp="2020-01-22T03:29:56.896-06:00"/>
  </ApplicationResults>
  <ItineraryRef ID="XMTKQG">
    <Source CreateDateTime="2020-01-22T03:29"/>
  </ItineraryRef>
  <Text>OK 0329 XMTKQG</Text>
</EnhancedEndTransactionRS>
{% endxmlsec %}

## Игнорирование бронирования (IgnoreTransactionLLSRQ)

В некоторых случаях существует необходимость игнорировать все изменения в бронировании, выполненные в текущей сессии. Для этого необходимо использовать сервис [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction).

{% xmlsec "Пример запроса", false %}
<IgnoreTransactionRQ ReturnHostCommand="true" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10"/>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<IgnoreTransactionRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-22T03:30:49-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="60ECF5">I</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</IgnoreTransactionRS>
{% endxmlsec %}

## Удаление элементов бронирования (UpdateReservationRQ)

*Для удаления элементов бронирования в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для удаления элементов бронирования используется сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary).

В запросе необходимо указать:

- ```/UpdateReservationRQ/RequestType``` — тип запроса. Всегда значение ```Stateless```
- ```/UpdateReservationRQ/ReturnOptions/@IncludeUpdateDetails``` — признак получения деталей изменения бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReturnOptions/@RetrievePNR``` — признак получения состояния бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReservationUpdateList/Locator``` — код бронирования
- ```/UpdateReservationRQ/ReservationUpdateList/ReceivedFrom/AgentName``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

Для удаления каждого элемента в бронировании необходимо добавить в запрос отдельный элемент ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem```, в котором необходимо указать идентификатор элемента бронирования и код типа операции — значение ```D``` (Delete, удаление). В таблице ниже указаны соответствие между элементами бронирования и элементом запроса к [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary), а также путь до идентификатора элемента бронирования в ответе на запрос к сервису [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) (см. [Чтение бронирований](get-booking.md)).

| Элемент бронирования | Путь до идентификатора элемента бронирования (```/@id```) и кода типа операции (```/@op```) в запросе к [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary) | Путь до идентификатора элемента бронирования в ответе на запрос к сервису [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) |
| -- | -- | -- | -- |
| Телефоны | ```ReservationUpdateItem/PhoneNumberUpdate``` | ```/TravelItineraryReadRS/TravelItinerary/CustomerInfo/ContactNumbers/ContactNumber/@Id``` |
| Адреса электронной почты | ```ReservationUpdateItem/EmailAddressUpdate``` | ```/TravelItineraryReadRS/TravelItinerary/CustomerInfo/PersonName/Email/@Id``` |
| Карты лояльности | ```ReservationUpdateItem/FrequentFlyerTSAPreCheckUpdate``` и ```ReservationUpdateItem/FrequentFlyerTSAPreCheckUpdate/Loyalty``` (указывается в обоих местах) | ```/TravelItineraryReadRS/TravelItinerary/CustomerInfo/CustLoyalty/@Id``` |
| SSR и OSI сообщения | ```ReservationUpdateItem/SpecialServiceRequestUpdate``` | ```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/@Id``` |
| Ремарки | ```ReservationUpdateItem/RemarkUpdate/``` | ```/TravelItineraryReadRS/TravelItinerary/RemarkInfo/Remark/@Id``` |

Сервис сам откроет бронирование, удалит все указанные в запросе элементы и сохранит бронирование.

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19">
  <RequestType>Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>BPTDKB</Locator>
    <ReservationUpdateItem>
      <PhoneNumberUpdate id="15" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <EmailAddressUpdate id="12" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <EmailAddressUpdate id="13" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="20" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="21" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="22" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="23" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="24" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <SpecialServiceRequestUpdate id="25" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <RemarkUpdate id="26" op="D"/>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>BPTDKB</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-04-16T08:34:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-04-16T08:34:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-04-16T08:34:35</stl19:UpdateTimestamp>
      <stl19:PNRSequence>3</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T05:20:00" Start="2020-09-01T07:45:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-09-08T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>4c46ce4b883a2357a20dc73aeb5d33a4aef1ac4e1351a371</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="18" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="19" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>SVO</stl19:Airport>
          <stl19:Departure>2020-09-01T07:45:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AER</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1138</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1138</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNCVAT</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T07:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T10:15:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1138</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T08:34:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AER</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>SVO</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1129</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1129</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNCVAT</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T05:20:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1129</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T08:34:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:FutureTicketing elementId="pnr-11" id="11" index="1">
          <stl19:Code>TAW</stl19:Code>
        </stl19:FutureTicketing>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:EmailAddresses/>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}

## Добавление элементов бронирования (UpdatePassengerNameRecordRQ)

Для добавления элементов бронирования используется сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record). UpdatePassengerNameRecordRQ является аналогом сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md)), однако в отличие от него требует указать код бронирования (```/UpdatePassengerNameRecordRQ/Itinerary/@id```), в которое необходимо добавить новые элементы.

Сервис сам откроет бронирование, добавит все указанные в запросе элементы и сохранит бронирование.

{% xmlsec "Пример запроса", false %}
<UpdatePassengerNameRecordRQ haltOnAirPriceError="true" targetCity="2FRH" version="1.0.0" xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <Itinerary id="XRYLLG"/>
  <TravelItineraryAddInfo>
    <AgencyInfo>
      <Ticketing TicketType="7TAW"/>
    </AgencyInfo>
    <CustomerInfo>
      <ContactNumbers>
        <ContactNumber Phone="79851234567" PhoneUseType="M"/>
      </ContactNumbers>
      <Email Address="customer@customer.com" NameNumber="1.1" Type="TO"/>
      <Email Address="agency@agency.com" Type="BC"/>
    </CustomerInfo>
  </TravelItineraryAddInfo>
  <SpecialReqDetails>
    <AddRemark>
      <RemarkInfo>
        <Remark Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
    </AddRemark>
    <SpecialService>
      <SpecialServiceInfo>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-11-20" Number="1234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="1980-11-20" DocumentHolder="true" Gender="M" NameNumber="1.1">
            <GivenName>IVAN</GivenName>
            <MiddleName>IVANOVICH</MiddleName>
            <Surname>IVANOV</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-08-15" Number="2234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="1980-01-20" DocumentHolder="false" Gender="F" NameNumber="2.1">
            <GivenName>ELENA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-11-20" Number="3234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="2012-01-15" DocumentHolder="false" Gender="M" NameNumber="3.1">
            <GivenName>ANDREY</GivenName>
            <MiddleName>IVANOVICH</MiddleName>
            <Surname>IVANOV</Surname>
          </PersonName>
        </AdvancePassenger>
        <AdvancePassenger SegmentNumber="A">
          <Document ExpirationDate="2025-04-15" Number="1234567890" Type="P">
            <IssueCountry>RU</IssueCountry>
            <NationalityCountry>RU</NationalityCountry>
          </Document>
          <PersonName DateOfBirth="2019-02-20" DocumentHolder="false" Gender="FI" NameNumber="1.1">
            <GivenName>EKATERINA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <Service SSR_Code="CTCM">
          <PersonName NameNumber="1.1"/>
          <Text>79851234567/RU</Text>
        </Service>
        <Service SSR_Code="CTCE">
          <PersonName NameNumber="1.1"/>
          <Text>CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
    </SpecialService>
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
    <Success timeStamp="2020-01-22T04:36:18.638-06:00"/>
    <Warning timeStamp="2020-01-22T04:36:18.115-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="XRYLLG"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="35" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
          <Email Comment="BC/" Id="34" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="33" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
          <Email Comment="BC/" Id="34" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
          <Email Comment="BC/" Id="34" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
          <Email Comment="BC/" Id="34" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>EKATERINA</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1320/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-22T13:20" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="58000" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="6008" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">608RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="64008" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="116000"/>
                    <Taxes>
                      <Tax Amount="12016"/>
                    </Taxes>
                    <TotalFare Amount="128016"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/YCLR"/>
                  <FareCalculation>
                    <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
                <Text>2FRH 9LSC*AWT 1320/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-22T13:20" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="43500" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="5704" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">304RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="49204" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="43500"/>
                    <Taxes>
                      <Tax Amount="5704"/>
                    </Taxes>
                    <TotalFare Amount="49204"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/CH25/YCLR/CH25"/>
                  <FareCalculation>
                    <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
                <Text>2FRH 9LSC*AWT 1320/22JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-22T13:20" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="0" TaxCode="TE"/>
                  </Taxes>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="0"/>
                    <Taxes>
                      <Tax Amount="0"/>
                    </Taxes>
                    <TotalFare Amount="0"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/IN00/YCLR/IN00"/>
                  <FareCalculation>
                    <Text>MOW SU AER0SU MOW0RUB0END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
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
            <BaseFare Amount="159500.00"/>
            <Taxes>
              <Tax Amount="17720.00"/>
            </Taxes>
            <TotalFare Amount="177220.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-22T04:20:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AER"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <SupplierRef ID="DCSU*XRYPHR"/>
              <UpdatedArrivalTime>09-01T10:15</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-01T07:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SVO</DepartureAirport>
                  <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
                  <DepartureTerminalCode>B</DepartureTerminalCode>
                  <ArrivalAirport>AER</ArrivalAirport>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1138</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>150</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*XRYPHR</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-01T07:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-01T10:15:00</ArrivalDateTime>
                  <FlightNumber>1138</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-22T04:20:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-22T04:20:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AER"/>
              <SupplierRef ID="DCSU*XRYPHR"/>
              <UpdatedArrivalTime>09-08T05:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AER</DepartureAirport>
                  <ArrivalAirport>SVO</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
                  <ArrivalTerminalCode>B</ArrivalTerminalCode>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1129</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>155</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*XRYPHR</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
                  <FlightNumber>1129</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-22T04:20:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="XRYLLG" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-22T04:20" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-22T04:36" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="4"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="42" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="9" RPH="001" Type="AFX">
        <Service SSR_Code="OSI">
          <PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</PersonName>
          <Text>AA INF</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="002" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="30" RPH="003" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="18" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="19" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="36" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="37" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="38" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="39" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="40" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="41" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
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
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
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
        <OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
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
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
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
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
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
        <OpenReservationElement elementId="pnr-36" id="36" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM SU HK1/79851234567/RU</FullText>
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
        <OpenReservationElement elementId="pnr-37" id="37" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
        <OpenReservationElement elementId="pnr-38" id="38" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
        <OpenReservationElement elementId="pnr-39" id="39" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
        <OpenReservationElement elementId="pnr-40" id="40" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
        <OpenReservationElement elementId="pnr-41" id="41" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
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
        <OpenReservationElement elementId="pnr-34" id="34" type="PSG_DETAILS_MAIL">
          <Email comment="BC/" type="BC">
            <Address>AGENCY@AGENCY.COM</Address>
          </Email>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-33" id="33" type="PSG_DETAILS_MAIL">
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
      </OpenReservationElements>
    </TravelItinerary>
  </TravelItineraryRead>
</UpdatePassengerNameRecordRS>
{% endxmlsec %}