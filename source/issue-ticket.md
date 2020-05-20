# Оформление билетов и EMD

-----

**Оглавление:**
<!-- toc -->

-----

## Алгоритм оформления билетов и EMD

{% imgsec "Схема", "0", "issue-ticket" %}./assets/svg/issue-ticket/issue-ticket.svg{% endimgsec %}

## Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В бронировании перед оформлением билетов и (или) EMD необходимо проверить:
- что сегменты подтверждены (статус ```HK``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/FlightSegment/@Status```) — в случае оформления билетов
- что сегментам присвоен локатор авиакомпании (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/FlightSegment/SupplierRef/@ID``` после ```DC[код авиакомпании]*```, например ```DCSU*ABCDEF```) — в случае оформления билетов
- что дополнительные услуги подтверждены (статус ```HD``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/Ancillaries/AncillaryService/@ActionCode```) — в случае оформления EMD

Кроме того, при оформлении билетов необходимо проверить наличие PQ (Price Quote, сохраненный расчет), а также то, что они подходит для выписки билетов:
1. Проверка наличия PQ. Каждому PQ в бронировании соответствует один элемент ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote``` в ответе на запрос TravelItineraryReadRQ. Номер PQ будет присутствовать в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/@RPH```.
2. Проверка статуса PQ. PQ может иметь один из двух статусов (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/MiscInformation/SignatureLine/@Status```):
    - ```ACTIVE``` — активный PQ, который можно использовать для оформления билетов
    - ```HISTORY``` — удаленный PQ, который нельзя использовать для оформления билетов
3. Проверка типа PQ. В системе могут быть два типа PQ:
    - стандартный PQ, который используется для оформления новых билетов
    - PQR (PQ Reissue), который содержит расчет для оформления билетов в обмен (см. [Обмен билетов](exchange-ticket.md)). PQR должны иметь значение ```Y``` в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/MiscInformation/SignatureLine/@PQR_Ind```.
4. Проверка применимости PQ. Рекомендуется перед оформлением билетов проверить соответствие между рейсами, сохраненными в PQ, с рейсами в бронировании. Также рекомендуется проверить соответствие между пассажирами, для которых созданы PQ, с пассажирами в бронировании. Это позволит избежать проблем в случае изменения расписания перевозчиком или, например, изменения PQ агентами в терминале.
5. Проверка актуальности PQ. PQ отражает стоимость бронирования на момент создания PQ. По прошествии времени стоимость выбранного перелета может меняться из-за изменения тарифов, прошедшего [тайм-лимита](timelimit.md), изменения курса валют или других причин. Поэтому при оформлении билетов рекомендуется использовать актуальные PQ. Дата и время создания PQ указаны в качестве значения атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/@StoredDateTime```. При этом алгоритм работы с системой может быть разным в зависимости от того, включена ли в PCC настройка [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta):
    - Если настройка отключена, то система при каждой попытке оформления билета производит перерасчет стоимости. Это означает, что если стоимость перелета изменилась между временем создания PQ и попыткой оформления билета, то билет будет оформлен с новой стоимостью. Поэтому если в PCC настройка отключена, рекомендуется снизить временной промежуток между созданием PQ и оформлением билетов до минимума. Для бронирования с устаревшим PQ рекомендуется выполнить [Перерасчет стоимости бронирований](reprice-booking.md).
    - Если настройка включена, то система не производит перерасчета стоимости во время оформления билета и использует сохраненный в PQ расчет (в случае соблюдения требований [тайм-лимита](timelimit.md)), однако только в том случае, если PQ был создан в тот же день, когда производится оформление билета (используется локальный часовой пояс для PCC).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="RVMZXV"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-27T05:34:51.176-06:00"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1434/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-27T14:34" TaxExempt="false" ValidatingCarrier="SU">
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
              <tir310:Text>2FRH 9LSC*AWT 1434/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-27T14:34" TaxExempt="false" ValidatingCarrier="SU">
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
              <tir310:Text>2FRH 9LSC*AWT 1434/27JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-27T14:34" TaxExempt="false" ValidatingCarrier="SU">
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
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-27T05:34:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCSU*ZABICV"/>
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
                <or110:AirlineRefId>DCSU*ZABICV</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T07:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T10:15:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1138</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T05:34:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-27T05:34:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCSU*ZABICV"/>
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
                <or110:AirlineRefId>DCSU*ZABICV</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T05:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1129</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-27T05:34:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="RVMZXV" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="9LSC" CreateDateTime="2020-01-27T05:34" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-27T05:34" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
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

## Оформление билетов и EMD (AirTicketRQ)

Для оформления билетов или EMD используется сервис [AirTicketRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket).

Ниже указаны обязательные и необязательные элементы и атрибуты запроса к сервису:

### Переход в другой PCC

Для оформления билета или EMD в другом PCC (т.е. не в iPCC, в котором была создана сессия или токен) необходимо указать его в качестве значения атрибута ```/AirTicketRQ/@targetCity```.

*Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.md).*

### Выбор стока

В Sabre существует возможность оформления билетов и EMD на разных платформах или стоках. Для того, чтобы указать сток, на котором будет произведена выписка билета или EMD, необходимо указать его в качестве значения атрибута ```/AirTicketRQ/DesignatePrinter/Printers/Ticket/@CountryCode```.

Соответствие стоков и их кодов:

| Сток | Код стока |
| -- | -- |
| Сток BSP Россия | ```RU``` |
| Прямой сток Аэрофлота | ```1R``` |
| Прямой сток других авиакомпаний | ```1Y``` |
| Сток ТКП | ```1T``` |

### Выбор принтера

Перед оформление билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в качестве значения атрибута ```/AirTicketRQ/DesignatePrinter/Printers/Hardcopy/@LNIATA```.

Подробнее о терминальных адресах принтеров см. раздел [Конфигурация Sabre](configuration.md#terminalnie_adresa_ta_lniata).

### Чтение бронирования

Код бронирования (PNR Record Locator), в котором необходимо произвести оформление билета или EMD, указывается в качестве значения атрибута ```/AirTicketRQ/Itinerary/@ID```.

### Оформление билетов и EMD

Сервис AirTicketRQ позволяет одну или несколько инструкций по оформлению билетов или EMD в последовательно расположенных элементах ```/AirTicketRQ/Ticketing```. Инструкции будут выполнены последовательно: одна за другой. В случае, если в PCC, в котором производится оформление билетов или EMD, не включены настройки [Automatically End Transaction at Ticketing](tjr-settings.md#automatically_end_transaction_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_pri_oformlenii_biletov) или [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.md#automatically_end_transaction_and_redisplay_the_pnr_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_i_povtornoe_ih_otkritie_pri_oformlenii_biletov), то все инструкции будут выполнены без промежуточного сохранения бронирования, а бронирование может быть сохранено только при пост-обработке (см. ниже). Если одна из указанных настроек включена, то после выполнения каждой инструкции оформления билетов или EMD бронирование будет сохранено и вновь открыто.

В одном запросе в разных инструкциях могут быть оформлены одновременно и билеты и EMD.

Ниже представлены элементы, которые могут быть указаны в каждой инструкции оформления билета или EMD:

#### Выбор форм оплаты

Подробнее о выборе форм оплаты в Sabre см. в [Выбор форм оплаты](fop.md).

В Sabre при оформлении билета или EMD можно указать одну или несколько форм оплаты. Возможные варианты форм оплаты:

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

*Обратите внимание на то, что двойная форма оплаты возможна только для билетов!*

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

*Обратите внимание на то, что в случае использования первой стратегии, при наличии в бронировании нескольких пассажиров одной категории и при включенной настройке [Price Retention Ticketing Alert](tjr-settings.md#price_retention_ticketing_alert_preduprezhdenie_ob_izmenenii_stoimosti_biletov) при попытке оформить билет будет вызвано предупреждение. Для решения этой проблемы необходимо выполнить одно из действий:*
- *отключить настройку Price Retention Ticketing Alert*
- *использовать другую стратегию оформления билетов*
- *игнорировать предупреждения, указав ```true``` в качестве значения атрибута ```/AirTicketRQ/PostProcessing/@acceptPriceChanges```*

#### Особенности оформления билетов в обмен

При оформлении билета или билетов в обмен после [сохранения маски расчета стоимости обмена](exchange-ticket.md) (PQR) необходимо указать:
- величину комиссии в процентах (```/AirTicketRQ/Ticketing/MiscQualifiers/Commission/@Percent```) или абсолютных значениях (```/@Amount```)
- номер PQR, по которому будет производиться оформление билета в обмен (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/Record/@Number```), а также признак использования PQR (```/AirTicketRQ/Ticketing/PricingQualifiers/PriceQuote/Record/@Reissue``` со значением ```true```)

**Форму оплаты указывать не требуется, поскольку она уже была указана в PQR при расчете стоимости обмена.** 

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

Номер дополнительной услуги в бронировании может быть получен в атрибуте ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ReservationItems/Item/Ancillaries/AncillaryService/@SequenceNumber``` из ответа на запрос TravelItineraryReadRQ.

### Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/AirTicketRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку следующего вида:

{% xmlsec "Нарушение правил минимального стыковочного времени", true %}
<SystemSpecificResults>
  <Message code="ERR.SP.BUSINESS_ERROR">Invalid connect time between air segments - please verify itinerary</Message>
  <Message code="ERR.SP.PROVIDER_ERROR">SabreCommandLLSRQ: INVALID CONNECT TIME SEGS 1 AND 2 - MINIMUM IS 60 MINUTES VERIFY ANY REMAINING SEGS</Message>
</SystemSpecificResults>
{% endxmlsec %}

Билеты и EMD в этом случае оформлены не будут.

### Пост-обработка

Сервис позволяет указать в запросе условия обработки различных предупреждений системы при оформлении билетов:
- ```/AirTicketRQ/PostProcessing/@acceptNegotiatedFare``` — обработка предупреждения, возникающего при попытке оформить билет по приватному тарифу при включенной настройке [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta), но выключенной настройке [Allow Ticket CAT 35 IT/BT PQ Fare](tjr-settings.md#allow_ticket_cat_35_itbt_pq_fare_oformlenie_biletov_po_sohranennim_v_pq_privatnim_tarifam_bez_pererascheta). Возможные варианты заполнения:
    - ```true``` — оформление билета по публичному тарифу
    - ```false``` — отмена процесса оформления билета
- ```/AirTicketRQ/PostProcessing/@acceptPriceChanges``` — обработка предупреждения, возникающего при не соответствии стоимости билета сохраненной в PQ и фактической стоимости билета при включенной настройке [Price Retention Ticketing Alert](tjr-settings.md#price_retention_ticketing_alert_preduprezhdenie_ob_izmenenii_stoimosti_biletov). Возможные варианты заполнения:
    - ```true``` — оформление билета по новой цене
    - ```false``` — отмена процесса оформления билета
- ```/AirTicketRQ/PostProcessing/@actionOnPQExpired``` — обработка предупреждения, возникающего при попытке оформления билета по устаревшей PQ при включенной настройке [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta). Возможные варианты заполнения:
    - ```R``` — выполнить перерасчет стоимости и оформить билет по актуальной стоимости
    - ```O``` — оформить билет по сохраненному PQ без перерасчета (в этом случае гарантия Sabre не сохранится)
    - ```Q``` — отмена процесса оформления билета

При оформлении EMD указанные выше атрибуты можно не указывать.

В случае, если в PCC, в котором производится оформление билетов или EMD, не включены настройки [Automatically End Transaction at Ticketing](tjr-settings.md#automatically_end_transaction_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_pri_oformlenii_biletov) или [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.md#automatically_end_transaction_and_redisplay_the_pnr_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_i_povtornoe_ih_otkritie_pri_oformlenii_biletov), то после оформления билетов необходимо сохранить бронирование. Для этого нужно добавить в запрос элемент ```/AirTicketRQ/PostProcessing/EndTransaction```, а также указать значение поля Received From в качестве значения атрибута ```/AirTicketRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom```.

Сервис позволяет проверить успешность сохранения билетов и EMD в бронировании. Для этого требуется добавить элемент ```/AirTicketRQ/PostProcessing/GhostTicketCheck``` со следующими атрибутами:
- ```/@waitInterval``` — временной интервал между проверками в миллисекундах (от 1000 до 30000 миллисекунд)
- ```/@numAttempts``` — количество попыток проверок (от 1 до 6)

### Примеры

{% xmlsec "Пример запроса (оформление билетов в 1 транзакцию с наличной формой оплаты)", false %}
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.2.1" xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="RVMZXV"/>
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
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-27T05:35:20.513-06:00"/>
    <Warning timeStamp="2020-01-27T05:35:13.662-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: MULTI PQ PROCESSING STARTED</Message>
        <Message>PQ1</Message>
        <Message>OK    128016</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>PQ2</Message>
        <Message>OK     49204</Message>
        <Message>PQ3</Message>
        <Message>OK         0</Message>
        <Message>MULTI PQ PROCESSING COMPLETED</Message>
        <Message>OK 0535 RVMZXV TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000135</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>5555588040211</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:35:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVMZXV</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">64008</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040212</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:35:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVMZXV</Reservation>
    <FirstName>ELENA MS</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">64008</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040213</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:35:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVMZXV</Reservation>
    <FirstName>ANDREY</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">49204</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040214</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:35:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVMZXV</Reservation>
    <FirstName>EKATERINA</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">0</TotalAmount>
  </Summary>
</AirTicketRS>
{% endxmlsec %}

-----

{% xmlsec "Пример запроса (оформление билетов в 3 транзакции с формой оплаты кредитной картой)", false %}
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.2.1" xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="HPKJKI"/>
  <Ticketing>
    <FOP_Qualifiers>
      <BasicFOP>
        <CC_Info>
          <PaymentCard Code="AX" ExpireDate="2020-09" ManualApprovalCode="1234" Number="371449635398431"/>
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
          <PaymentCard Code="AX" ExpireDate="2020-09" ManualApprovalCode="1234" Number="371449635398431"/>
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
          <PaymentCard Code="AX" ExpireDate="2020-09" ManualApprovalCode="1234" Number="371449635398431"/>
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
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-27T05:45:24.455-06:00"/>
    <Warning timeStamp="2020-01-27T05:45:18.380-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    128016    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0545 HPKJKI TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000136</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-27T05:45:20.811-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK     49204    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0545 HPKJKI TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000137</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-27T05:45:23.273-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK         0    1234</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0545 HPKJKI TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000138</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>5555588040215</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>HPKJKI</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">64008</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040216</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>HPKJKI</Reservation>
    <FirstName>ELENA MS</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">64008</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040218</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>HPKJKI</Reservation>
    <FirstName>EKATERINA</FirstName>
    <LastName>IVANOVA</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">0</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>5555588040217</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:45:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>HPKJKI</Reservation>
    <FirstName>ANDREY</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">49204</TotalAmount>
  </Summary>
</AirTicketRS>
{% endxmlsec %}

-----

{% xmlsec "Пример запроса (оформление билетов и EMD разными транзакциями с безналичной формой оплаты)", false %}
<AirTicketRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.2.1" xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <DesignatePrinter>
    <Printers>
      <Hardcopy LNIATA="B0DE83"/>
      <Ticket CountryCode="RU"/>
    </Printers>
  </DesignatePrinter>
  <Itinerary ID="RVNDMF"/>
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
  <PostProcessing acceptNegotiatedFare="true" acceptPriceChanges="true" actionOnPQExpired="Q">
    <GhostTicketCheck numAttempts="6" waitInterval="1000"/>
  </PostProcessing>
</AirTicketRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1_2_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-27T05:49:40.462-06:00"/>
    <Warning timeStamp="2020-01-27T05:49:34.044-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">AirTicketLLSRQ: OK    124127</Message>
        <Message>ETR MESSAGE PROCESSED</Message>
        <Message>AE ITEMS EXIST - USE WEMD ENTRY TO FULFILL</Message>
        <Message>OK 6.6</Message>
        <Message>OK 0549 RVNDMF TTY REQ PEND</Message>
        <Message>INVOICED                   - NUMBER 0000139</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <Summary committed="true">
    <DocumentNumber>6071853532625</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:49:00</LocalIssueDateTime>
    <DocumentType>EMD</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVNDMF</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">20790</TotalAmount>
  </Summary>
  <Summary committed="true">
    <DocumentNumber>6075588040219</DocumentNumber>
    <LocalIssueDateTime>2020-01-27T14:49:00</LocalIssueDateTime>
    <DocumentType>TKT</DocumentType>
    <IssuingLocation>2FRH</IssuingLocation>
    <Reservation>RVNDMF</Reservation>
    <FirstName>IVAN MR</FirstName>
    <LastName>IVANOV</LastName>
    <TotalAmount currencyCode="RUB" decimalPlace="0">124127</TotalAmount>
  </Summary>
</AirTicketRS>
{% endxmlsec %}
