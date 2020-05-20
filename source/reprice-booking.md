# Перерасчет стоимости бронирований

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Перерасчет стоимости бронирования — это операция удаления старых элементов расчета (PQ) и создание новых с актуальной стоимостью бронирования.

Операция перерасчета стоимости бронирования может быть выполнена как перед моментом оформления билета, так и в любой другой момент, например:
- перед оформлением билета, если после создания PQ прошло продолжительное время (в случае отключенной настройки [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta))
- перед оформлением билета, если PQ был создан в прошлые сутки или ранее (в случае включенной настройки [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta))
- для уведомления клиента об изменении стоимости бронирования
- в случае нарушения сроков [тайм-лимита](timelimit.md)
- и т.д.

## Алгоритм перерасчета стоимости бронирований

{% imgsec "Схема", "0", "reprice" %}./assets/svg/reprice/reprice.svg{% endimgsec %}

## Чтение бронирования (TravelItineraryReadRQ)

*Для перерасчета стоимости бронирований в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="ZNPGDD"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T04:10:48.101-06:00"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1307/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-27T13:07" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="58000" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="6008" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">5400YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">608RI</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="64008" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="116000"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="12016"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="128016"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>NON-REF/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/YCLR"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER29000SU MOW29000RUB58000END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
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
              <tir310:Text>2FRH 9LSC*AWT 1307/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-27T13:07" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="43500" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="5704" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">5400YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">304RI</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="49204" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="43500"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="5704"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="49204"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>NON-REF/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/CH25/YCLR/CH25"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER21750SU MOW21750RUB43500END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/CH25"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/CH25"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="CH25">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="CH25">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
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
              <tir310:Text>2FRH 9LSC*AWT 1307/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-27T13:07" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="0" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="0" TaxCode="TE"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="0" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="0"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="0"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="0"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/IN00/YCLR/IN00"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER0SU MOW0RUB0END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/IN00"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/IN00"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="IN00">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="IN00">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
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
          <tir310:BaseFare Amount="159500.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="17720.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="177220.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-27T04:07:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AER"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:SupplierRef ID="DCSU*ZNPGME"/>
            <tir310:UpdatedArrivalTime>09-01T10:15</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T07:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>SVO</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL B - DOMESTIC</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>B</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>AER</or110:ArrivalAirport>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1138</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>150</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*ZNPGME</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T07:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T10:15:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1138</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T04:07:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-27T04:07:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AER"/>
            <tir310:SupplierRef ID="DCSU*ZNPGME"/>
            <tir310:UpdatedArrivalTime>09-08T05:20</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T02:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>AER</or110:DepartureAirport>
                <or110:ArrivalAirport>SVO</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL B - DOMESTIC</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>B</or110:ArrivalTerminalCode>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1129</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>155</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*ZNPGME</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T05:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1129</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T04:07:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="ZNPGDD" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-27T04:07" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-27T04:07" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="26" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
    </tir310:RemarkInfo>
    <tir310:SpecialServiceInfo Id="9" RPH="001" Type="AFX">
      <tir310:Service SSR_Code="OSI">
        <tir310:PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</tir310:PersonName>
        <tir310:Text>AA INF</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="29" RPH="002" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="30" RPH="003" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="18" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="19" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
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
      <or110:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
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
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/79851234567/RU</or110:FreeText>
          <or110:FullText>CTCM SU HK1/79851234567/RU</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:Comment>COM/RU</or110:Comment>
          <or110:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or110:FreeText>
          <or110:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
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
    </tir310:OpenReservationElements>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
{% endxmlsec %}

## Удаление старых PQ (DeletePriceQuoteLLSRQ)

Перед тем как создать новые элементы расчета (PQ) необходимо удалить предыдущие. Для этого используется сервис [DeletePriceQuoteLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/delete_price_quote).

В запросе необходимо указать, что требуется удалить все PQ (значение ```true``` у атрибута ```/DeletePriceQuoteRQ/AirItineraryPricingInfo/Record/@All```).

{% xmlsec "Пример запроса", false %}
<DeletePriceQuoteRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <AirItineraryPricingInfo>
    <Record All="true"/>
  </AirItineraryPricingInfo>
</DeletePriceQuoteRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<DeletePriceQuoteRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T04:11:00-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="3ED2F1">PQD-ALL</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DeletePriceQuoteRS>
{% endxmlsec %}

## Создание новых PQ (OTA_AirPriceLLSRQ)

Стоимость перелета на момент выписки билета может отличаться от стоимости на момент создания бронирования из-за изменения тарифа или курса валют. Для этого перед оформлением билета рекомендуется произвести перерасчет стоимости бронирования при помощи сервиса [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary).

Запрос к сервису составляется по аналогии с заполнением элемента ```AirPrice``` сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md#raschet_stoimosti)) или элемента ```OTA_AirPriceRQ``` сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.md#raschet_stoimosti)).

{% xmlsec "Пример запроса", false %}
<OTA_AirPriceRQ ReturnHostCommand="true" Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <PriceRequestInformation Retain="true">
    <OptionalQualifiers>
      <FlightQualifiers>
        <VendorPrefs>
          <Airline Code="SU"/>
        </VendorPrefs>
      </FlightQualifiers>
      <PricingQualifiers>
        <Brand>EC</Brand>
        <SpecificPenalty AdditionalInfo="true"/>
      </PricingQualifiers>
    </OptionalQualifiers>
  </PriceRequestInformation>
</OTA_AirPriceRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirPriceRS Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T04:11:09-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPASU¥MP-I¥BREC¥RQ</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <PriceQuote>
    <MiscInformation>
      <BaggageInfo>
        <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRY10KG 22LB 55L X 40W X 25H</CommercialNameofBaggageItemType>
          <DescriptionOne Code="10">
            <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="55">
            <Text>55CM LENGTH X 40CM WIDTH X 25CM HEIGHT</Text>
          </DescriptionTwo>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>08AACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
            <MaximumWeight Units="L">22</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0DFAASU</ExtendedSubCodeKey>
        </SubCodeProperties>
        <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>UPTO 22LB 10KG AND45LI 115LCM</CommercialNameofBaggageItemType>
          <DescriptionOne Code="10">
            <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="4U">
            <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          </DescriptionTwo>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0E3ACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
            <MaximumSize Units="I">45</MaximumSize>
            <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
            <MaximumWeight Units="L">22</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>UPTO50LB 23KG AND62LI 158LCM</CommercialNameofBaggageItemType>
          <DescriptionOne Code="23">
            <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="6U">
            <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          </DescriptionTwo>
          <EMD_Type>2</EMD_Type>
          <ExtendedSubCodeKey>0GOACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
            <MaximumSize Units="I">62</MaximumSize>
            <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
            <MaximumWeight Units="L">50</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
        </SubCodeProperties>
        <SubCodeProperties RPH="6" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>PREPAID BAGGAGE 23KG</CommercialNameofBaggageItemType>
          <DescriptionOne Code="23">
            <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
          </DescriptionOne>
          <EMD_Type>2</EMD_Type>
          <ExtendedSubCodeKey>0C3ACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
            <MaximumWeight Units="L">50</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
      </BaggageInfo>
      <HeaderInformation SolutionSequenceNmbr="1">
        <DepartureDate>2020-09-01</DepartureDate>
        <LastTicketingDate>08-27T23:59</LastTicketingDate>
        <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
        <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
        <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
        <Text>NON-REF/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-01P/SU</Text>
        <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
        <Text>25CM HEIGHT</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
        <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
        <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
        <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
        <Text>NON-REF/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-01P/SU</Text>
        <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
        <Text>25CM HEIGHT</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
        <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
        <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
        <Text>RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
        <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
        <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-NIL/SU</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>ELECTRONIC TICKETING NOT VALID FOR INFANTS</Text>
        <Text>01SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 27AUG/2359</Text>
        <ValidatingCarrier Code="SU"/>
      </HeaderInformation>
      <SolutionInformation SolutionSequenceNmbr="1">
        <BaseFareCurrencyCode>RUB</BaseFareCurrencyCode>
        <CurrencyCode>RUB</CurrencyCode>
        <GrandTotalEquivFareAmount>159500</GrandTotalEquivFareAmount>
        <GrandTotalTaxes>17720</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>177220</TotalAmount>
      </SolutionInformation>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>BSP</SettlementMethod>
        <Ticket CarrierCode="SU" Type="ETKTREQ" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
    </MiscInformation>
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="177220">
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-01P/SU</Text>
              <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
              <Text>25CM HEIGHT</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="58000" CurrencyCode="RUB"/>
          <Construction Amount="58000" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="6008">
            <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
            <Tax Amount="608" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="64008" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="2"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-01P/SU</Text>
              <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
              <Text>25CM HEIGHT</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="43500" CurrencyCode="RUB"/>
          <Construction Amount="43500" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="5704">
            <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
            <Tax Amount="304" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="49204" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="1"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>0</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER0SU MOW0RUB0END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="2FRH"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
              <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
              <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-NIL/SU</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="0" CurrencyCode="RUB"/>
          <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="0"/>
          <TotalFare Amount="0" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="1"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
    </PricedItinerary>
  </PriceQuote>
</OTA_AirPriceRS>
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
    <Success timeStamp="2020-01-27T04:11:16.961-06:00"/>
  </ApplicationResults>
  <ItineraryRef ID="ZNPGDD">
    <Source CreateDateTime="2020-01-27T04:11"/>
  </ItineraryRef>
  <Text>OK 0411 ZNPGDD</Text>
</EnhancedEndTransactionRS>
{% endxmlsec %}
