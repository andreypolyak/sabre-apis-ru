---
title: Войдирование билетов и EMD
---

{{< toc >}}

## Введение

Sabre позволяет войдировать (аннулировать) билет или EMD до конца того дня, в который он был оформлен (конец дня определяется по времени, установленному для PCC, в котором он был оформлен). При этом перевозчики могут накладывать дополнительные ограничения на правила войдирования.

В системе предусмотрено два варианта войдирования билетов и EMD:
- стандартное войдирование билетов и EMD, которое рекомендуется производить во всех возможных случаях
- войдирование несохраненных в бронировании билетов и EMD. Этот вариант войдирования рекомендуется применять только в тех случаях, когда при сохранении бронирования после оформления билетов и EMD произошла ошибка и билеты или EMD не сохранились в бронировании, но были оформлены (см. [Оформление билетов и EMD](issue-ticket.html))

## Войдирование билетов и EMD

### Алгоритм войдирования билетов и EMD

![](/sabre-apis-ru/assets/svg/void-ticket/void-ticket[PNR].svg)

### Выбор стока (DesignatePrinterLLSRQ)

{{< hint warning >}}
Для войдирования билетов и EMD в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

{{< hint danger >}}
Войдирование билетов и EMD всегда должно выполняться в том же PCC, где они были оформлены!
{{< /hint >}}

Для того чтобы указать сток, на котором должен быть войдирован билет или EMD, используется сервис [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Ticket/@CountryCode``` в запросе должен быть указан код стока. Сток для войдирования билета должен совпадать со стоком, на котором он был оформлен. Код стока указан в ответе на запрос [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) в поле ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/Ticketing/@eTicketNumber``` после номера билета.

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
    <stl:Success timeStamp="2022-05-24T03:34:52-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="715B8B">W*RU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

### Выбор принтера (DesignatePrinterLLSRQ)

Перед войдированием билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в запросе к сервису [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

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
    <stl:Success timeStamp="2022-05-24T03:34:58-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="715B8B">PTR/B0DE83</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

### Чтение бронирования (TravelItineraryReadRQ)

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
  <UniqueID ID="QMRXLE"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:35:05.108-05:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="170110"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628280"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1701"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="16713"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="33">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="170110"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628281"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1701"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="16713"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="34">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="128280"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628282"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1283"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="8007"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="35">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="16770"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628283"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="168"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4149"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="170110" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="16713" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2490AU</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">6216GB</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="186823" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="8198.00"/>
                  <tir310:EquivFare Amount="340220"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="33426"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="373646"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="128280" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="8007" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="136287" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="3091.00"/>
                  <tir310:EquivFare Amount="128280"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8007"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="136287"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="404.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="16770" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4149" TaxCode="UB"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="20919" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="404.00"/>
                  <tir310:EquivFare Amount="16770"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="4149"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="20919"/>
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
          <tir310:EquivFare Amount="485270.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="45582.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="530852.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-24MAY-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 6079419628280-RU IVANO/I 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 6079419628281-RU IVANO/E 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 6079419628282-RU IVANO/A 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 6079419628283-RU IVANO/E 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="QMRXLE" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-24T03:30" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-24T03:31" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="2"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="30" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="40" RPH="002" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
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
    <tir310:SpecialServiceInfo Id="42" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628280C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="43" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628280C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="44" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628280C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="45" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628280C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="46" RPH="015" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628281C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="47" RPH="016" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628281C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="48" RPH="017" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628281C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="49" RPH="018" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628281C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="50" RPH="019" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628282C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="51" RPH="020" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628282C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="52" RPH="021" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628282C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="53" RPH="022" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628282C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="54" RPH="023" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/INF6079419628283C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="55" RPH="024" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/INF6079419628283C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="56" RPH="025" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/INF6079419628283C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="57" RPH="026" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/INF6079419628283C4</tir310:Text>
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
      <or110:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628280C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-43" id="43" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628280C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-44" id="44" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628280C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628280C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-46" id="46" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628281C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-47" id="47" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628281C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-48" id="48" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628281C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-49" id="49" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628281C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-50" id="50" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628282C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-51" id="51" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628282C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-52" id="52" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628282C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-53" id="53" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628282C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-54" id="54" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/INF6079419628283C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-55" id="55" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/INF6079419628283C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/INF6079419628283C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-57" id="57" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/INF6079419628283C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
    </tir310:OpenReservationElements>
    <tir310:AssociationMatrices>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-3.1"/>
        <tir310:Child ref="pnr-32"/>
        <tir310:Child ref="pnr-36"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-5.2"/>
        <tir310:Child ref="pnr-33"/>
        <tir310:Child ref="pnr-37"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-7.3"/>
        <tir310:Child ref="pnr-34"/>
        <tir310:Child ref="pnr-38"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-9.4"/>
        <tir310:Child ref="pnr-35"/>
        <tir310:Child ref="pnr-39"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
```
{{< /details >}}

### Войдирование билета или EMD (VoidTicketLLSRQ)

Для войдирование билета или EMD используется сервис [VoidTicketLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/void_air_ticket).

В запросе необходимо указать:
- ```/VoidTicketRQ/@NumResponses``` — всегда значение ```99```
- ```/VoidTicketRQ/Ticketing/@RPH``` — порядковый номер билета в бронировании (значение атрибута ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/Ticketing/@RPH``` в ответе на запрос к сервису TravelItineraryReadRQ)

{{< details title="Пример запроса" >}}
```XML
<VoidTicketRQ NumResponses="99" ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Ticketing RPH="2"/>
</VoidTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<VoidTicketRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:35:13-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="715B8B">WV2</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
    <stl:Warning type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:Message>REENT IF 6079419628280 IS TO BE VOIDED-0028</stl:Message>
        <stl:ShortText>WARN.SWS.HOST.INTERMEDIATE_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Warning>
  </stl:ApplicationResults>
</VoidTicketRS>
```
{{< /details >}}

### Подтверждение войдирования билета или EMD (VoidTicketLLSRQ)

Для подтверждения войдирование билета или EMD используется сервис [VoidTicketLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/void_air_ticket).

В запросе необходимо указать:
- ```/VoidTicketRQ/@NumResponses``` — всегда значение ```99```
- ```/VoidTicketRQ/Ticketing/@RPH``` — порядковый номер билета в бронировании

{{< details title="Пример запроса" >}}
```XML
<VoidTicketRQ NumResponses="99" ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Ticketing RPH="2"/>
</VoidTicketRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<VoidTicketRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:35:23-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="715B8B">WV2</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <Text>OK 6.6 VOID MSG SENT IF WITHIN BSP APPROVED GUIDELINES</Text>
  <Text>OK 0335 QMRXLE</Text>
</VoidTicketRS>
```
{{< /details >}}

{{< hint danger >}}
Обратите внимание на то, что данный рекомендованный процесс войдирования билетов и EMD разработан с учетом того, что в PCC, в котором производится оформление билетов включена настройка [Automatically End Transaction at Ticketing](tjr-settings.html#automatically-end-transaction-at-ticketing-автоматическое-сохранение-бронирований-при-оформлении-билетов).

Если эта настройка не включена, то после отправки повторного запроса на подтверждение войдирования билета или EMD необходимо сохранить бронирование при помощи запроса к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction) (см. [Редактирование бронирований](edit-booking.html)).

Если эта настройка не включена, но включена настройка [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.html#automatically-end-transaction-and-redisplay-the-pnr-at-ticketing-автоматическое-сохранение-бронирований-и-повторное-их-открытие-при-оформлении-билетов), то сохранение и чтение бронирования после войдирования билетов или EMD не требуется, но может потребоваться игнорирование бронирования при помощи запроса к сервису [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction) (см. [Редактирование бронирований](edit-booking.html)).
{{< /hint >}}

## Войдирование несохраненных в бронировании билетов и EMD

### Алгоритм войдирования несохраненных в бронировании билетов и EMD

![](/sabre-apis-ru/assets/svg/void-ticket/void-ticket[noPNR].svg)

### Выбор стока (DesignatePrinterLLSRQ)

{{< hint warning >}}
Для войдирования билетов и EMD в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

{{< hint danger >}}
Войдирование билетов и EMD всегда должно выполняться в том же PCC, где они были оформлены!
{{< /hint >}}

Для того чтобы указать сток, на котором должен быть войдирован билет или EMD, используется сервис [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Ticket/@CountryCode``` в запросе должен быть указан код стока. Сток для войдирования билета должен совпадать со стоком, на котором он был оформлен. Код стока указан в ответе на запрос [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) в поле ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/Ticketing/@eTicketNumber``` после номера билета.

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
    <stl:Success timeStamp="2022-05-24T03:38:38-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52DB93">W*RU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

### Выбор принтера (DesignatePrinterLLSRQ)

Перед войдированием билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в запросе к сервису [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

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
    <stl:Success timeStamp="2022-05-24T03:38:45-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52DB93">PTR/B0DE83</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
```
{{< /details >}}

### Чтение бронирования (TravelItineraryReadRQ)

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
  <UniqueID ID="QMRXLE"/>
</TravelItineraryReadRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:38:50.884-05:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="170110"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628280"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1701"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="16713"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="33">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="170110"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628281"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1701"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="16713"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="34">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="128280"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628282"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="1283"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="8007"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="35">
      <tir310:Airline Code="EY"/>
      <tir310:BaseFare Amount="16770"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="9419628283"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="168"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4149"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="170110" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="16713" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2490AU</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">6216GB</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="186823" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="8198.00"/>
                  <tir310:EquivFare Amount="340220"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="33426"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="373646"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="128280" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="8007" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">2598WY</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">158ZR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">1102F6</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">4149UB</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="136287" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="3091.00"/>
                  <tir310:EquivFare Amount="128280"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8007"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="136287"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1130/24MAY22</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-24T11:30" TaxExempt="false" ValidatingCarrier="EY">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="404.00" CurrencyCode="AUD"/>
                <tir310:EquivFare Amount="16770" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4149" TaxCode="UB"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="20919" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="404.00"/>
                  <tir310:EquivFare Amount="16770"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="4149"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="20919"/>
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
          <tir310:EquivFare Amount="485270.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="45582.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="530852.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="3">
          <tir310:FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="4">
          <tir310:FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T03:31:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCEY*ESBSGT"/>
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
                <or110:AirlineRefId>DCEY*ESBSGT</or110:AirlineRefId>
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
                <or110:SegmentBookedDate>2022-05-24T03:31:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-24MAY-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 6079419628280-RU IVANO/I 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 6079419628281-RU IVANO/E 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 6079419628282-RU IVANO/A 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 6079419628283-RU IVANO/E 2FRH*AWT 1131/24MAY*I">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing eTicketNumber="TV 6079419628280-RU  *VOID* 2FRH*AWT 1135/24MAY*E">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="QMRXLE" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-24T03:30" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-24T03:35" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="30" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="40" RPH="002" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
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
    <tir310:SpecialServiceInfo Id="42" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628280C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="43" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628280C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="44" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628280C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="45" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628280C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="46" RPH="015" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628281C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="47" RPH="016" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628281C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="48" RPH="017" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628281C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="49" RPH="018" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628281C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="50" RPH="019" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/6079419628282C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="51" RPH="020" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/6079419628282C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="52" RPH="021" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/6079419628282C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="53" RPH="022" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/6079419628282C4</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="54" RPH="023" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SYDAUH2463Y01DEC/INF6079419628283C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="55" RPH="024" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHLHR0025Y02DEC/INF6079419628283C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="56" RPH="025" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 LHRAUH0012Y08DEC/INF6079419628283C3</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="57" RPH="026" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="EY"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AUHSYD0464Y08DEC/INF6079419628283C4</tir310:Text>
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
      <or110:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628280C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-43" id="43" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628280C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-44" id="44" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628280C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628280C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628280C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-46" id="46" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628281C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-47" id="47" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628281C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-48" id="48" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628281C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-49" id="49" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628281C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628281C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-50" id="50" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/6079419628282C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-51" id="51" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/6079419628282C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-52" id="52" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419628282C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-53" id="53" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6079419628282C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419628282C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-54" id="54" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C1</or110:FreeText>
          <or110:FullText>TKNE EY HK1 SYDAUH2463Y01DEC/INF6079419628283C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>2463</or110:FlightNumber>
            <or110:DepartureDate>2022-12-01</or110:DepartureDate>
            <or110:BoardPoint>SYD</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-55" id="55" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C2</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHLHR0025Y02DEC/INF6079419628283C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0025</or110:FlightNumber>
            <or110:DepartureDate>2022-12-02</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>LHR</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C3</or110:FreeText>
          <or110:FullText>TKNE EY HK1 LHRAUH0012Y08DEC/INF6079419628283C3</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="18" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0012</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>LHR</or110:BoardPoint>
            <or110:OffPoint>AUH</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-57" id="57" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6079419628283C4</or110:FreeText>
          <or110:FullText>TKNE EY HK1 AUHSYD0464Y08DEC/INF6079419628283C4</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="19" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>EY</or110:CarrierCode>
            <or110:FlightNumber>0464</or110:FlightNumber>
            <or110:DepartureDate>2022-12-08</or110:DepartureDate>
            <or110:BoardPoint>AUH</or110:BoardPoint>
            <or110:OffPoint>SYD</or110:OffPoint>
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
    </tir310:OpenReservationElements>
    <tir310:AssociationMatrices>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-3.1"/>
        <tir310:Child ref="pnr-32"/>
        <tir310:Child ref="pnr-36"/>
        <tir310:Child ref="pnr-59"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-5.2"/>
        <tir310:Child ref="pnr-33"/>
        <tir310:Child ref="pnr-37"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-7.3"/>
        <tir310:Child ref="pnr-34"/>
        <tir310:Child ref="pnr-38"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-9.4"/>
        <tir310:Child ref="pnr-35"/>
        <tir310:Child ref="pnr-39"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
```
{{< /details >}}

### Чтение маски билета или EMD (SabreCommandLLSRQ)

Для чтения маски билета или EMD требуется отправить терминальную команду с использованием сервиса [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Формат терминальной команды для просмотра маски билета: ```WETR*T[номер билета]```, например ```WETR*T0155689784560```.

Формат терминальной команды для просмотра маски EMD: ```WEMD*T[номер билета]```, например ```WEMD*T0155689784560```.

{{< details title="Пример запроса" >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand>WETR*T6079419628282</HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<SabreCommandLLSRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:39:20-05:00">
      <stl:SystemSpecificResults/>
    </stl:Success>
  </stl:ApplicationResults>
  <Response>ELECTRONIC TICKET RECORD                          CRS CODE:0011
INV:                  CUST:                          PNR:QMRXLE
TKT:6079419628282     ISSUED:24MAY22   PCC:2FRH   IATA:96188116
NAME:IVANOV/ANDREY                                             
NAME REF:P3234567890                                           
FORM OF PAYMENT                        FCI: 0                  
1    CASH                                                      
CPN  A/L  FLT  CLS DATE   BRDOFF  TIME  ST F/B             STAT
1    EY   2463  Y  01DEC  SYDAUH 1125P  OK YLWF2AUCH       OPEN
                                NVB:01DEC   NVA:01DEC   BAG:35K
2    EY   25    Y  02DEC  AUHLHR 1035A  OK YLWF2AUCH       OPEN
                                NVB:02DEC   NVA:02DEC   BAG:35K
3    EY   12    Y  08DEC  LHRAUH  830A  OK YLXF2AUCH       OPEN
                                NVB:08DEC   NVA:08DEC   BAG:35K
4    EY   464   Y  08DEC  AUHSYD 1010P  OK YLXF2AUCH       OPEN
                                NVB:08DEC   NVA:08DEC   BAG:35K
                                                               
FARE     AUD3091.00                                            
TOTAL      RUB136287     EQUIVALENT FARE PAID         RUB128280
                                                               
FARE CALCULATION                                               
SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54N
UC2326.85END ROE1.328146                                       
                                                               
TAX BREAKDOWN                                                  
TAX      2598WY TAX       158ZR TAX      1102F6 TAX      4149UB
                                                               
ENDORSEMENT                                                    
BSR41.5                                                        
NON ENDO/ REF                                                  </Response>
</SabreCommandLLSRS>
```
{{< /details >}}

### Войдирование билета или EMD (SabreCommandLLSRQ)

Для войдирования билета или EMD требуется отправить терминальную команду с использованием сервиса [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Формат терминальной команды для войдирования билета: ```WETRV```.

Формат терминальной команды для войдирования EMD: ```WEMDV```.

{{< details title="Пример запроса" >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand>WETRV</HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<SabreCommandLLSRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:39:27-05:00">
      <stl:SystemSpecificResults/>
    </stl:Success>
  </stl:ApplicationResults>
  <Response>REENTER IF 6079419628282 IS TO BE VOIDED-0551</Response>
</SabreCommandLLSRS>
```
{{< /details >}}

### Подтверждение войдирования билета или EMD (SabreCommandLLSRQ)

Для подтверждения войдирования билета или EMD требуется отправить терминальную команду с использованием сервиса [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Формат терминальной команды для подтверждения войдирования билета: ```WETRV```.

Формат терминальной команды для подтверждения войдирования EMD: ```WEMDV```.

{{< details title="Пример запроса" >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand>WETRV</HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<SabreCommandLLSRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-24T03:39:33-05:00">
      <stl:SystemSpecificResults/>
    </stl:Success>
  </stl:ApplicationResults>
  <Response>OK 6.6 VOID MSG SENT IF WITHIN BSP APPROVED GUIDELINES</Response>
</SabreCommandLLSRS>
```
{{< /details >}}

{{< hint danger >}}
Обратите внимание на то, что данный рекомендованный процесс войдирования билетов и EMD разработан с учетом того, что в PCC, в котором производится оформление билетов включена настройка [Automatically End Transaction at Ticketing](tjr-settings.html#automatically-end-transaction-at-ticketing-автоматическое-сохранение-бронирований-при-оформлении-билетов).

Если эта настройка не включена, то после отправки повторного запроса на подтверждение войдирования билета или EMD необходимо сохранить бронирование при помощи запроса к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction) (см. [Редактирование бронирований](edit-booking.html)).

Если эта настройка не включена, но включена настройка [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.html#automatically-end-transaction-and-redisplay-the-pnr-at-ticketing-автоматическое-сохранение-бронирований-и-повторное-их-открытие-при-оформлении-билетов), то сохранение и чтение бронирования после войдирования билетов или EMD не требуется, но может потребоваться игнорирование бронирования при помощи запроса к сервису [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction) (см. [Редактирование бронирований](edit-booking.html)).
{{< /hint >}}

