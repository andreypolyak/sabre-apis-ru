---
title: Отмена дополнительных услуг
---

{{< hint warning >}}
Для отмены дополнительных услуг в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

{{< hint warning >}}
Обратите внимание на то, что при [отмене бронирования](cancel-booking.html) также будут отменены ассоциированные с этими сегментами дополнительные услуги. Указанные ниже рекомендации следует применять только в том случае, если нужно отменить дополнительные услуги без отмены бронирования.
{{< /hint >}}

Для отмены дополнительных услуг используется сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary).

#### Параметры запроса

В запросе необходимо указать:

- ```/UpdateReservationRQ/RequestType``` — тип запроса. Всегда значение ```Stateless```
- ```/UpdateReservationRQ/ReturnOptions/@IncludeUpdateDetails``` — признак получения деталей изменения бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReturnOptions/@RetrievePNR``` — признак получения состояния бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReservationUpdateList/Locator``` — код бронирования
- ```/UpdateReservationRQ/ReservationUpdateList/ReceivedFrom/AgentName``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

#### Отмена дополнительных услуг

В запросе для каждой дополнительной услуги, которую необходимо отменить, требуется указать:
- ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem/AncillaryServicesUpdate/@id``` — идентификатор дополнительной услуги, которую требуется отменить (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/Ancillaries/AncillaryService/@id``` ответа на запрос к сервису TravelItineraryReadRQ)
- ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem/AncillaryServicesUpdate/@op``` — код типа операции. Всегда значение ```D``` (Delete, удаление)

#### Пример

{{< details title="Пример запроса" >}}
```XML
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>QXQNGD</Locator>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate id="50" op="D"/>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate id="52" op="D"/>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<stl19:UpdateReservationRS xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>QXQNGD</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-01-23T07:00:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-01-23T07:00:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-01-23T08:46:42</stl19:UpdateTimestamp>
      <stl19:PNRSequence>6</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T06:50:00" Start="2020-09-01T12:40:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-10-23T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-f3b89014d3a3788e8cf81435267fd7c3052d254996099b3</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="18" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="19" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="20" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>CTCM EY HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="21" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="22" type="G">
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
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="25" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031885C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031885C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>INF6075588031888C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>INF6075588031888C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-27" id="27" index="1">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031885</stl19:DocumentNumber>
              <stl19:CommissionAmount>1065</stl19:CommissionAmount>
              <stl19:BaseFare>106520</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-29" id="29" index="2">TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-29" id="29" index="2">
              <stl19:OriginalTicketDetails>TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/I</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="23" type="G">
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
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031886C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031886C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-28" id="28" index="2">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031886</stl19:DocumentNumber>
              <stl19:CommissionAmount>1065</stl19:CommissionAmount>
              <stl19:BaseFare>106520</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOVA ELENA MS</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-30" id="30" index="3">TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-30" id="30" index="3">
              <stl19:OriginalTicketDetails>TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/E</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="24" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031887C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031887C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-38" id="38" index="3">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031887</stl19:DocumentNumber>
              <stl19:CommissionAmount>800</stl19:CommissionAmount>
              <stl19:BaseFare>80010</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOV ANDREY CHD</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-39" id="39" index="4">TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-39" id="39" index="4">
              <stl19:OriginalTicketDetails>TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/A</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
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
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-44" id="44" index="4">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031888</stl19:DocumentNumber>
              <stl19:CommissionAmount>110</stl19:CommissionAmount>
              <stl19:BaseFare>11030</stl19:BaseFare>
              <stl19:TaxAmount>2460</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOVA EKATERINA INF</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-45" id="45" index="5">TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-45" id="45" index="5">
              <stl19:OriginalTicketDetails>TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031888</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/E</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>DME</stl19:Airport>
          <stl19:Departure>2020-09-01T12:40:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>DME</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AUH</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>EY</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>ETIHAD AIRWAYS</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>0068</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>321</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>EY</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>0068</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCEY*YJJCAR</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T12:40:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T18:55:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>0068</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="18" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="33" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031885C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031885C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="35" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031886C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031886C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="41" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031887C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031887C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="47" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>INF6075588031</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-01-23T07:00:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY ETIHAD AIRWAYS</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="B" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AUH</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>DME</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>EY</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>ETIHAD AIRWAYS</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>0065</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>321</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>EY</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>0065</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>B</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>B</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCEY*YJJCAR</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:25:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T06:50:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>0065</stl19:FlightNumber>
            <stl19:ClassOfService>B</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="19" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="34" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031885C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031885C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="36" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031886C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031886C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="42" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031887C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031887C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="48" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/INF6075588031888C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>INF6075588031</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/INF6075588031888C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-01-23T07:00:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY ETIHAD AIRWAYS</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:AlreadyTicketed elementId="pnr-46" id="46" index="1">
          <stl19:Code>T-23JAN-2FRH*AWT</stl19:Code>
        </stl19:AlreadyTicketed>
        <stl19:ETicketNumber elementId="pnr-29" id="29" index="2">TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-30" id="30" index="3">TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-39" id="39" index="4">TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-45" id="45" index="5">TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
        <stl19:TicketDetails elementId="pnr-29" id="29" index="2">
          <stl19:OriginalTicketDetails>TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/I</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-30" id="30" index="3">
          <stl19:OriginalTicketDetails>TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/E</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-39" id="39" index="4">
          <stl19:OriginalTicketDetails>TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/A</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-45" id="45" index="5">
          <stl19:OriginalTicketDetails>TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031888</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/E</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
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
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-31" id="31" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>XXTAW/</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:AccountingLines>
      <stl19:AccountingLine elementId="pnr-27" id="27" index="1">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031885</stl19:DocumentNumber>
        <stl19:CommissionAmount>1065</stl19:CommissionAmount>
        <stl19:BaseFare>106520</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-28" id="28" index="2">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031886</stl19:DocumentNumber>
        <stl19:CommissionAmount>1065</stl19:CommissionAmount>
        <stl19:BaseFare>106520</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOVA ELENA MS</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-38" id="38" index="3">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031887</stl19:DocumentNumber>
        <stl19:CommissionAmount>800</stl19:CommissionAmount>
        <stl19:BaseFare>80010</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOV ANDREY CHD</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-44" id="44" index="4">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031888</stl19:DocumentNumber>
        <stl19:CommissionAmount>110</stl19:CommissionAmount>
        <stl19:BaseFare>11030</stl19:BaseFare>
        <stl19:TaxAmount>2460</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOVA EKATERINA INF</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
    </stl19:AccountingLines>
    <stl19:AssociationMatrices>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-2.1"/>
        <stl19:Child ref="pnr-27">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-29">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-4.2"/>
        <stl19:Child ref="pnr-28">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-30">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-6.3"/>
        <stl19:Child ref="pnr-38">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-39">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-8.4"/>
        <stl19:Child ref="pnr-44">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-45">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
    </stl19:AssociationMatrices>
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
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
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
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM EY HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
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
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
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
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
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
      <or114:OpenReservationElement elementId="pnr-33" id="33" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031885C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031885C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
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
      <or114:OpenReservationElement elementId="pnr-34" id="34" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031885C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031885C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-35" id="35" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031886C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031886C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-36" id="36" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031886C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031886C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-41" id="41" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031887C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031887C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031887C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031887C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-47" id="47" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/INF6075588031888C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
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
      <or114:OpenReservationElement elementId="pnr-48" id="48" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/INF6075588031888C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/INF6075588031888C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId=""/>
    <stl19:UpdateResult Status="SUCCESS" UpdateId=""/>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D" type="P"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item op="D" type="P"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
```
{{< /details >}}
