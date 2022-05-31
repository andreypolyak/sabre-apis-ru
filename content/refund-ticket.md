---
title: Возврат билетов
---

{{< toc >}}

## Введение

Подробнее об условиях выполнения возвратов билетов см. [Обмены и возвраты](exchanges-refunds.html#добровольный-возврат-билетов).

## Алгоритм возврата билетов

![](/sabre-apis-ru/assets/svg/refund-ticket/refund-ticket.svg)

## Выбор стока (DesignatePrinterLLSRQ)

{{< hint warning >}}
Для возврата билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

{{< hint danger >}}
Возврат билетов всегда должен выполняться в том же PCC, где они были оформлены!
{{< /hint >}}

В Sabre существует возможность оформления билетов на разных платформах или стоках. Для того чтобы указать сток, на котором будет произведена выписка билета, используется сервис [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Ticket/@CountryCode``` в запросе должен быть указан код стока.

Соответствие стоков и их кодов:

| Сток | Код стока |
| -- | -- |
| Сток BSP Россия | ```RU``` |
| Сток BSP Казахстан | ```KZ``` |
| Прямой сток Аэрофлота | ```1R``` |
| Прямой сток других авиакомпаний | ```1Y``` |
| Сток ТКП | ```1T``` |

{{< details title="Пример запроса" >}}
```XML
<DesignatePrinterRQ ReturnHostCommand="true" Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Printers>
    <Ticket CountryCode="RU"/>
  </Printers>
</DesignatePrinterRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<DesignatePrinterRS Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T05:41:15-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="5355EB">W*RU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

## Выбор принтера (DesignatePrinterLLSRQ)

Перед оформление билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в запросе к сервису [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

Подробнее о терминальных адресах принтеров см. раздел [Конфигурация Sabre](configuration.html#терминальные-адреса-ta-lniata).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Hardcopy/@LNIATA``` в запросе должен быть указан терминальный адрес принтера (PTRTA).

{{< details title="Пример запроса" >}}
```XML
<DesignatePrinterRQ ReturnHostCommand="true" Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Printers>
    <Hardcopy LNIATA="B0DE83"/>
  </Printers>
</DesignatePrinterRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<DesignatePrinterRS Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T05:41:18-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="5355EB">PTR/B0DE83</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

## Чтение бронирования (TravelItineraryReadRQ)

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
  <UniqueID ID="WISIYP"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T05:41:22.499-05:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="30">
      <tir310:Airline Code="JU"/>
      <tir310:BaseFare Amount="61735"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419630703"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="617"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4282"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="31">
      <tir310:Airline Code="JU"/>
      <tir310:BaseFare Amount="61735"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419630704"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="617"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4282"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="JU"/>
      <tir310:BaseFare Amount="46425"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419630705"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="464"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4282"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="33">
      <tir310:Airline Code="JU"/>
      <tir310:BaseFare Amount="6650"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419630706"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="67"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="0"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
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
              <tir310:Text>2FRH 9LSC*AWT 1340/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAJU¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-24T13:40" TaxExempt="false" ValidatingCarrier="JU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="1012.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="61735" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4282" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">732YR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2170RI</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">274LG</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1046RS</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">60RF</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="66017" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="2024.00"/>
                  <tir310:EquivFare Amount="123470"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8564"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="132034"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAJU$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - JU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>VALID ON JU ONLY</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YNBRRU/YNBRRU"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW JU BEG Q4.38 550.16JU MOW Q4.38 550.16NUC1109.08END ROE0.912448</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T21:50" FlightNumber="655" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRU"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="655"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:10" FlightNumber="654" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRU"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="654"/>
                  <tir310:OriginLocation LocationCode="BEG"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="55016" FareBasisCode="YNBRRU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="BEG" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T23:50" DepartureDateTime="09-01T21:50"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="55016" FareBasisCode="YNBRRU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="BEG"/>
                  <tir310:Dates ArrivalDateTime="09-08T21:05" DepartureDateTime="09-08T17:10"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1340/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAJU¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-24T13:40" TaxExempt="false" ValidatingCarrier="JU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="761.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="46425" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4282" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">732YR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2170RI</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">274LG</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1046RS</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">60RF</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="50707" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="761.00"/>
                  <tir310:EquivFare Amount="46425"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="4282"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="50707"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAJU$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - JU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>VALID ON JU ONLY</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YNBRRUCH75/YNBRRUCH75"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW JU BEG Q4.38 412.62JU MOW Q4.38 412.62NUC834.00END ROE0.912448</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T21:50" FlightNumber="655" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRUCH75"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="655"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:10" FlightNumber="654" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRUCH75"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="654"/>
                  <tir310:OriginLocation LocationCode="BEG"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="41262" FareBasisCode="YNBRRUCH75" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="BEG" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T23:50" DepartureDateTime="09-01T21:50"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="41262" FareBasisCode="YNBRRUCH75" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="BEG"/>
                  <tir310:Dates ArrivalDateTime="09-08T21:05" DepartureDateTime="09-08T17:10"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1340/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAJU¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-24T13:40" TaxExempt="false" ValidatingCarrier="JU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="109.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="6650" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="0" TaxCode="TE"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="6650" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="109.00"/>
                  <tir310:EquivFare Amount="6650"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="0"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="6650"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAJU$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - JU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="SYSTEM_ENDORSEMENT">
                    <tir310:Text>VALID ON JU ONLY</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YNBRRUIN10/YNBRRUIN10"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW JU BEG Q4.38 55.01JU MOW Q4.38 55.01NUC118.78END ROE0.912448</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T21:50" FlightNumber="655" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRUIN10"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="655"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:10" FlightNumber="654" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="NIL"/>
                  <tir310:FareBasis Code="YNBRRUIN10"/>
                  <tir310:MarketingAirline Code="JU" FlightNumber="654"/>
                  <tir310:OriginLocation LocationCode="BEG"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2022-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2022-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="5501" FareBasisCode="YNBRRUIN10" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="BEG" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T23:50" DepartureDateTime="09-01T21:50"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="5501" FareBasisCode="YNBRRUIN10" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="JU" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="BEG"/>
                  <tir310:Dates ArrivalDateTime="09-08T21:05" DepartureDateTime="09-08T17:10"/>
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
          <tir310:BaseFare Amount="2894.00"/>
          <tir310:EquivFare Amount="176545.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="12846.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="189391.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="1074" ArrivalDateTime="09-01T23:50" CodeShare="false" DayOfWeekInd="4" DepartureDateTime="2022-09-01T21:50" ElapsedTime="03.00" FlightNumber="0655" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T05:40:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="BEG" Terminal="TERMINAL 2" TerminalCode="2"/>
            <tir310:Equipment AirEquipType="319"/>
            <tir310:MarketingAirline Code="JU" FlightNumber="0655" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AIR SERBIA</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="G"/>
            <tir310:OperatingAirline Code="JU" FlightNumber="0655" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AIR SERBIA</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="JU"/>
            <tir310:DisclosureCarrier Code="JU" DOT="false">
              <tir310:Banner>AIR SERBIA</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="SVO" Terminal="TERMINAL D - DOMESTIC/INTL" TerminalCode="D"/>
            <tir310:SupplierRef ID="DCJU*WISIIQ"/>
            <tir310:UpdatedArrivalTime>09-01T23:50</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T21:50</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>SVO</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL D - DOMESTIC/INTL</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>D</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>BEG</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL 2</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>2</or110:ArrivalTerminalCode>
                <or110:EquipmentType>319</or110:EquipmentType>
                <or110:MarketingAirlineCode>JU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>655</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>G</or110:MealCode>
                <or110:ElapsedTime>180</or110:ElapsedTime>
                <or110:AirMilesFlown>1074</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="JU" DOT="false">
                  <or110:Banner>AIR SERBIA</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCJU*WISIIQ</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-09-01T21:50:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-09-01T23:50:00</or110:ArrivalDateTime>
                <or110:FlightNumber>655</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T05:40:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="1074" ArrivalDateTime="09-08T21:05" CodeShare="false" DayOfWeekInd="4" DepartureDateTime="2022-09-08T17:10" ElapsedTime="02.55" FlightNumber="0654" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T05:40:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="SVO" Terminal="TERMINAL D - DOMESTIC/INTL" TerminalCode="D"/>
            <tir310:Equipment AirEquipType="319"/>
            <tir310:MarketingAirline Code="JU" FlightNumber="0654" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AIR SERBIA</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="G"/>
            <tir310:OperatingAirline Code="JU" FlightNumber="0654" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AIR SERBIA</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="JU"/>
            <tir310:DisclosureCarrier Code="JU" DOT="false">
              <tir310:Banner>AIR SERBIA</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="BEG" Terminal="TERMINAL 2" TerminalCode="2"/>
            <tir310:SupplierRef ID="DCJU*WISIIQ"/>
            <tir310:UpdatedArrivalTime>09-08T21:05</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T17:10</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>BEG</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL 2</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>2</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>SVO</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL D - DOMESTIC/INTL</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>D</or110:ArrivalTerminalCode>
                <or110:EquipmentType>319</or110:EquipmentType>
                <or110:MarketingAirlineCode>JU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>654</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>G</or110:MealCode>
                <or110:ElapsedTime>175</or110:ElapsedTime>
                <or110:AirMilesFlown>1074</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="JU" DOT="false">
                  <or110:Banner>AIR SERBIA</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCJU*WISIIQ</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2022-09-08T17:10:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2022-09-08T21:05:00</or110:ArrivalDateTime>
                <or110:FlightNumber>654</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:ScheduleChangeIndicator>false</or110:ScheduleChangeIndicator>
                <or110:SegmentBookedDate>2022-05-24T05:40:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-24MAY-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 1159419630703-RU IVANO/I 2FRH*AWT 1340/24MAY*I">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 1159419630704-RU IVANO/E 2FRH*AWT 1340/24MAY*I">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 1159419630705-RU IVANO/A 2FRH*AWT 1340/24MAY*I">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 1159419630706-RU IVANO/E 2FRH*AWT 1340/24MAY*I">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="WISIYP" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-24T05:40" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-24T05:40" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="38" RPH="001" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
    </tir310:RemarkInfo>
    <tir310:SpecialServiceInfo Id="28" RPH="001" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>JU KK1 SVOBEG0655Y01SEP/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="29" RPH="002" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>JU KK1 BEGSVO0654Y08SEP/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="18" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="19" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 SVOBEG0655Y01SEP/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 BEGSVO0654Y08SEP/IVANOVA/EKATERINA/20FEB22</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="40" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SVOBEG0655Y01SEP/1159419630703C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="41" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 BEGSVO0654Y08SEP/1159419630703C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="42" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 SVOBEG0655Y01SEP/1159419630704C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="43" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 BEGSVO0654Y08SEP/1159419630704C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="44" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 SVOBEG0655Y01SEP/1159419630705C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="45" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 BEGSVO0654Y08SEP/1159419630705C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="46" RPH="015" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SVOBEG0655Y01SEP/INF1159419630706C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="47" RPH="016" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="JU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 BEGSVO0654Y08SEP/INF1159419630706C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:OpenReservationElements>
      <or110:OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="JU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22 </or110:FreeText>
          <or110:FullText>INFT JU KK1 SVOBEG0655Y01SEP/IVANOVA/EKATERINA/20FEB22 </or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>KK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="JU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22 </or110:FreeText>
          <or110:FullText>INFT JU KK1 BEGSVO0654Y08SEP/IVANOVA/EKATERINA/20FEB22 </or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>KK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FreeText>
          <or110:FullText>DOCS JU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS JU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FreeText>
          <or110:FullText>DOCS JU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS JU HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="JU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT JU NN1 SVOBEG0655Y01SEP/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="JU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB22</or110:FreeText>
          <or110:FullText>INFT JU NN1 BEGSVO0654Y08SEP/IVANOVA/EKATERINA/20FEB22</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/79851234567/RU</or110:FreeText>
          <or110:FullText>CTCM JU HK1/79851234567/RU</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:Comment>COM/RU</or110:Comment>
          <or110:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or110:FreeText>
          <or110:FullText>CTCE JU HK1/CUSTOMER//CUSTOMER.COM/RU</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-40" id="40" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630703C1</or110:FreeText>
          <or110:FullText>TKNE JU HK1 SVOBEG0655Y01SEP/1159419630703C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-41" id="41" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630703C2</or110:FreeText>
          <or110:FullText>TKNE JU HK1 BEGSVO0654Y08SEP/1159419630703C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630704C1</or110:FreeText>
          <or110:FullText>TKNE JU HK1 SVOBEG0655Y01SEP/1159419630704C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-43" id="43" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630704C2</or110:FreeText>
          <or110:FullText>TKNE JU HK1 BEGSVO0654Y08SEP/1159419630704C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-44" id="44" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630705C1</or110:FreeText>
          <or110:FullText>TKNE JU HK1 SVOBEG0655Y01SEP/1159419630705C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/1159419630705C2</or110:FreeText>
          <or110:FullText>TKNE JU HK1 BEGSVO0654Y08SEP/1159419630705C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-46" id="46" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF1159419630706C1</or110:FreeText>
          <or110:FullText>TKNE JU HK1 SVOBEG0655Y01SEP/INF1159419630706C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0655</or110:FlightNumber>
            <or110:DepartureDate>2022-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>BEG</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-47" id="47" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="JU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF1159419630706C2</or110:FreeText>
          <or110:FullText>TKNE JU HK1 BEGSVO0654Y08SEP/INF1159419630706C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>JU</or110:CarrierCode>
            <or110:FlightNumber>0654</or110:FlightNumber>
            <or110:DepartureDate>2022-09-08</or110:DepartureDate>
            <or110:BoardPoint>BEG</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
            <or110:BookingStatus>HK</or110:BookingStatus>
          </or110:AirSegment>
        </or110:SegmentAssociation>
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
      <or110:OpenReservationElement elementId="pnr-or-344bb9b4-d58a-44ac-a125-83face42c579" id="344bb9b4-d58a-44ac-a125-83face42c579" type="APO">
        <or110:AncillaryProduct Id="1">
          <or110:XmlData>
            <or110:AncillaryServiceData id="25">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationTag>
                  <or110:CarrierCode>JU</or110:CarrierCode>
                  <or110:FlightNumber>0655</or110:FlightNumber>
                  <or110:DepartureDate>2022-09-01</or110:DepartureDate>
                  <or110:BoardPoint>SVO</or110:BoardPoint>
                  <or110:OffPoint>BEG</or110:OffPoint>
                  <or110:ClassOfService>Y</or110:ClassOfService>
                  <or110:BookingStatus>HK</or110:BookingStatus>
                </or110:SegmentAssociationTag>
                <or110:SegmentAssociationId>2</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:RficSubcode>SSR</or110:RficSubcode>
              <or110:SSRCode>INFT</or110:SSRCode>
              <or110:ProductText>IVANOVA/EKATERINA/20FEB22</or110:ProductText>
              <or110:OwningCarrierCode>JU</or110:OwningCarrierCode>
              <or110:InventoryControlledIndicator>true</or110:InventoryControlledIndicator>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>JU</or110:AirlineCode>
                <or110:FlightNumber>0655</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-09-01</or110:DepartureDate>
                <or110:BoardPoint>SVO</or110:BoardPoint>
                <or110:OffPoint>BEG</or110:OffPoint>
                <or110:MarketingCarrier>JU</or110:MarketingCarrier>
                <or110:OperatingCarrier>JU</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-4b8453fa-a0ea-4adb-bffe-2a3602e06433" id="4b8453fa-a0ea-4adb-bffe-2a3602e06433" type="APO">
        <or110:AncillaryProduct Id="2">
          <or110:XmlData>
            <or110:AncillaryServiceData id="27">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationTag>
                  <or110:CarrierCode>JU</or110:CarrierCode>
                  <or110:FlightNumber>0654</or110:FlightNumber>
                  <or110:DepartureDate>2022-09-08</or110:DepartureDate>
                  <or110:BoardPoint>BEG</or110:BoardPoint>
                  <or110:OffPoint>SVO</or110:OffPoint>
                  <or110:ClassOfService>Y</or110:ClassOfService>
                  <or110:BookingStatus>HK</or110:BookingStatus>
                </or110:SegmentAssociationTag>
                <or110:SegmentAssociationId>3</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:RficSubcode>SSR</or110:RficSubcode>
              <or110:SSRCode>INFT</or110:SSRCode>
              <or110:ProductText>IVANOVA/EKATERINA/20FEB22</or110:ProductText>
              <or110:OwningCarrierCode>JU</or110:OwningCarrierCode>
              <or110:InventoryControlledIndicator>true</or110:InventoryControlledIndicator>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>JU</or110:AirlineCode>
                <or110:FlightNumber>0654</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2022-09-08</or110:DepartureDate>
                <or110:BoardPoint>BEG</or110:BoardPoint>
                <or110:OffPoint>SVO</or110:OffPoint>
                <or110:MarketingCarrier>JU</or110:MarketingCarrier>
                <or110:OperatingCarrier>JU</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
    </tir310:OpenReservationElements>
    <tir310:AssociationMatrices>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-3.1"/>
        <tir310:Child ref="pnr-30"/>
        <tir310:Child ref="pnr-34"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-5.2"/>
        <tir310:Child ref="pnr-31"/>
        <tir310:Child ref="pnr-35"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-7.3"/>
        <tir310:Child ref="pnr-32"/>
        <tir310:Child ref="pnr-36"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-9.4"/>
        <tir310:Child ref="pnr-33"/>
        <tir310:Child ref="pnr-37"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
```
{{< /details >}}

## Возврат билета (TKT_RefundRQ)

Для возврата билета также используется сервис [TKT_RefundRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/auto_price_air_refunds).

В запросе необходимо указать:
- ```/RefundRQ/POS/STL:Company``` — код системы бронирования. Всегда ```1S```
- ```/RefundRQ/POS/STL:Pseudo``` — PCC, в котором производится возврат билета
- ```/RefundRQ/TransactionInfo/@requestType``` — тип запроса. Всегда ```Fulfill```
- ```/RefundRQ/TransactionInfo/TicketingDocument/Number``` — номер билета (13 цифр)

{{< details title="Пример запроса" >}}
```XML
<RefundRQ version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0" xmlns:STL="http://services.sabre.com/STL/v01">
  <POS>
    <STL:Company>1S</STL:Company>
    <STL:Pseudo>2FRH</STL:Pseudo>
  </POS>
  <TransactionInfo requestType="Fulfill">
    <TicketingDocument>
      <Number>1159419630703</Number>
    </TicketingDocument>
  </TransactionInfo>
</RefundRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<RefundRS version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0">
  <Header messageID="TKTVLC750-16707-2046706948-1653388889545-153468-arex" version="1.1.0">
    <STL:OrchestrationID xmlns:STL="http://services.sabre.com/STL/v01">TKTVLC750-16707-2046706948-1653388889545-153468-arex</STL:OrchestrationID>
    <STL:Results xmlns:STL="http://services.sabre.com/STL/v01">
      <STL:Success>
        <STL:System>TKT-WS</STL:System>
        <STL:Source>AREX</STL:Source>
      </STL:Success>
    </STL:Results>
  </Header>
  <Ticket number="1159419630703" type="TKT">
    <Details>
      <LocalIssueDate>2022-05-24T13:40:00</LocalIssueDate>
      <IssueLocation>2FRH</IssueLocation>
      <Reservation>WISIYP</Reservation>
      <AgencyIdentifier>96188116</AgencyIdentifier>
      <ValidatingCarrier>JU</ValidatingCarrier>
    </Details>
    <Traveler firstName="IVAN MR" lastName="IVANOV" type="ADT"/>
    <ServiceCoupon number="1" status="OK">
      <StartLocation>SVO</StartLocation>
      <EndLocation>BEG</EndLocation>
      <StartDate>2022-09-01</StartDate>
      <StartTime>21:50:00</StartTime>
      <MarketingFlightNumber carrierCode="JU">655</MarketingFlightNumber>
      <BookingClass>Y</BookingClass>
      <FareBasis>YNBRRU</FareBasis>
    </ServiceCoupon>
    <ServiceCoupon number="2" status="OK">
      <StartLocation>BEG</StartLocation>
      <EndLocation>SVO</EndLocation>
      <StartDate>2022-09-08</StartDate>
      <StartTime>17:10:00</StartTime>
      <MarketingFlightNumber carrierCode="JU">654</MarketingFlightNumber>
      <BookingClass>Y</BookingClass>
      <FareBasis>YNBRRU</FareBasis>
    </ServiceCoupon>
    <Payment type="CA">
      <Amount currencyCode="RUB" decimalPlaces="0">66017</Amount>
      <Remarks>CA</Remarks>
    </Payment>
  </Ticket>
  <PriceInfo>
    <Refund fareNonRefundable="true" priceType="System" taxesNonRefundable="false">
      <BaseFareInfo currencyCode="EUR" decimalPlaces="2">
        <DocumentAmount>0.00</DocumentAmount>
        <UsedAmount>0.00</UsedAmount>
      </BaseFareInfo>
      <FareInfo currencyCode="RUB" decimalPlaces="0">
        <DocumentAmount>0</DocumentAmount>
        <NonRefundableAmount>0</NonRefundableAmount>
        <UsedAmount>0</UsedAmount>
        <TotalFeesAmount>0</TotalFeesAmount>
        <CalculatedAmount>0</CalculatedAmount>
        <RefundAmount>0</RefundAmount>
      </FareInfo>
      <TaxInfo currencyCode="RUB" decimalPlaces="0">
        <Tax code="YR">
          <DocumentAmount>732</DocumentAmount>
          <NonRefundableAmount>732</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>0</CalculatedAmount>
          <RefundAmount>0</RefundAmount>
        </Tax>
        <Tax code="RI">
          <DocumentAmount>2170</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>2170</CalculatedAmount>
          <RefundAmount>2170</RefundAmount>
        </Tax>
        <Tax code="LG">
          <DocumentAmount>274</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>274</CalculatedAmount>
          <RefundAmount>274</RefundAmount>
        </Tax>
        <Tax code="RS">
          <DocumentAmount>1046</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>1046</CalculatedAmount>
          <RefundAmount>1046</RefundAmount>
        </Tax>
        <Tax code="RF">
          <DocumentAmount>60</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>60</CalculatedAmount>
          <RefundAmount>60</RefundAmount>
        </Tax>
        <TotalTaxRefundAmount>3550</TotalTaxRefundAmount>
      </TaxInfo>
      <CommissionInfo>
        <Commission>
          <Percent>1.0</Percent>
        </Commission>
      </CommissionInfo>
    </Refund>
    <GrandTotal currencyCode="RUB" decimalPlaces="0">3550</GrandTotal>
  </PriceInfo>
  <TransactionInfo fulfilled="true" reservationAutoEndProcessed="true">
    <Message type="I">REFUND TRANSACTION PROCESSED</Message>
    <Message type="I">REFUND ACCOUNTING DATA CREATED IN ACTIVE PNR</Message>
    <Message type="I">ETR REFUND TRANSACTION PROCESSED</Message>
    <Message type="I">OK 0541 WISIYP</Message>
    <Payment type="CA">
      <Amount currencyCode="RUB" decimalPlaces="0">3550</Amount>
      <Remarks>CA</Remarks>
    </Payment>
  </TransactionInfo>
</RefundRS>
```
{{< /details >}}

{{< hint danger >}}
Обратите внимание на то, что данный рекомендованный процесс возврата билетов разработан с учетом того, что в PCC, в котором производится возврат билетов включена настройка [Automatically End Transaction at Ticketing](tjr-settings.html#automatically-end-transaction-at-ticketing-автоматическое-сохранение-бронирований-при-оформлении-билетов).

Если эта настройка не включена, то после отправки запроса на возврат билета необходимо сохранить бронирование при помощи запроса к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction) (см. [Редактирование бронирований](edit-booking.html)).

Если эта настройка не включена, но включена настройка [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.html#automatically-end-transaction-and-redisplay-the-pnr-at-ticketing-автоматическое-сохранение-бронирований-и-повторное-их-открытие-при-оформлении-билетов), то сохранение и чтение бронирования после возврата билета не требуется, но может потребоваться игнорирование бронирования при помощи запроса к сервису [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction) (см. [Редактирование бронирований](edit-booking.html)).
{{< /hint >}}
