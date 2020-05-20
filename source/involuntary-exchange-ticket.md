# Вынужденный обмен билетов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Подробнее об условиях выполнения вынужденного обмена билетов см. в [Обмены и возвраты](exchanges-refunds.md#vinuzhdennii_obmen_biletov).

## Алгоритм вынужденного обмена билетов

{% imgsec "Схема", "0", "involuntary-exchange-ticket" %}./assets/svg/involuntary-exchange-ticket/involuntary-exchange-ticket.svg{% endimgsec %}

## Выбор стока (DesignatePrinterLLSRQ)

*Для вынужденного обмена билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

**Вынужденный обмен билетов всегда должен выполняться в том же PCC, где они были оформлены!**

Для того, чтобы указать сток, на котором должен быть оформлен новый билет, используется сервис [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Ticket/@CountryCode``` в запросе должен быть указан код стока. Сток для оформления нового билета должен совпадать со стоком, на котором был оформлен оригинальный билет. Код стока указан в ответе на запрос TravelItineraryReadRQ в поле ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/Ticketing/@eTicketNumber``` после номера билета.

Соответствие стоков и их кодов:

| Сток | Код стока |
| -- | -- |
| Сток BSP Россия | ```RU``` |
| Прямой сток Аэрофлота | ```1R``` |
| Прямой сток авиакомпании S7 или Уральских Авиалиний | ```1Y``` |
| Сток ТКП | ```1T``` |

{% xmlsec "Пример запроса", false %}
<DesignatePrinterRQ ReturnHostCommand="true" Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Printers>
    <Ticket CountryCode="RU"/>
  </Printers>
</DesignatePrinterRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<DesignatePrinterRS Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-02-02T10:39:01-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="4AFDEF">W*RU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
{% endxmlsec %}

## Выбор принтера (DesignatePrinterLLSRQ)

Перед вынужденным обменом билета в Sabre необходимо указать терминальный адрес принтера (PTRTA) в запросе к сервису [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

Подробнее о терминальных адресах принтеров см. раздел [Конфигурация Sabre](configuration.md#terminalnie_adresa_ta_lniata).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Hardcopy/@LNIATA``` в запросе должен быть указан терминальный адрес принтера (PTRTA).

{% xmlsec "Пример запроса", false %}
<DesignatePrinterRQ ReturnHostCommand="true" Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Printers>
    <Hardcopy LNIATA="B0DE83"/>
  </Printers>
</DesignatePrinterRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<DesignatePrinterRS Version="2.0.2" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-02-02T10:39:08-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="4AFDEF">PTR/B0DE83</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
{% endxmlsec %}

## Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="BPBEQK"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-02-02T10:39:14.731-06:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="31">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="58000" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040266"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="580"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="6008"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="58000" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040267"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="580"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="6008"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="42">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="43500" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040268"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="435"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="5704"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="48">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="0" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040269"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="0"/>
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
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
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
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-02-02T10:34:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCSU*JBLHKB"/>
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
                <or110:AirlineRefId>DCSU*JBLHKB</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T07:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T10:15:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1138</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-02-02T10:34:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-02-02T10:34:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
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
            <tir310:SupplierRef ID="DCSU*JBLHKB"/>
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
                <or110:AirlineRefId>DCSU*JBLHKB</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T05:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1129</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-02-02T10:34:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-02FEB-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 5555588040266-RU IVANO/I 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 5555588040267-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 5555588040268-RU IVANO/A 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 5555588040269-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="BPBEQK" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-02-02T10:34" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-02-02T10:34" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="26" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="35" RPH="002" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="44" RPH="003" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="50" RPH="004" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
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
    <tir310:SpecialServiceInfo Id="37" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5555588040266C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="38" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5555588040266C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="39" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5555588040267C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="40" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5555588040267C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="45" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5555588040268C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="46" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5555588040268C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="51" RPH="015" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/INF5555588040269C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="52" RPH="016" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/INF5555588040269C2</tir310:Text>
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
      <or110:OpenReservationElement elementId="pnr-37" id="37" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040266C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5555588040266C1</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-38" id="38" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040266C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040266C2</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-39" id="39" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040267C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5555588040267C1</or110:FullText>
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
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-40" id="40" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040267C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040267C2</or110:FullText>
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
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040268C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5555588040268C1</or110:FullText>
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
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-46" id="46" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5555588040268C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040268C2</or110:FullText>
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
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-51" id="51" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF5555588040269C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/INF5555588040269C1</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-52" id="52" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF5555588040269C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/INF5555588040269C2</or110:FullText>
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
        <tir310:Parent ref="pnr-2.1"/>
        <tir310:Child ref="pnr-31"/>
        <tir310:Child ref="pnr-33"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-4.2"/>
        <tir310:Child ref="pnr-32"/>
        <tir310:Child ref="pnr-34"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-6.3"/>
        <tir310:Child ref="pnr-42"/>
        <tir310:Child ref="pnr-43"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-8.4"/>
        <tir310:Child ref="pnr-48"/>
        <tir310:Child ref="pnr-49"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
{% endxmlsec %}

## Принятие изменений в расписании (EnhancedEndTransactionRQ)

Для принятия изменений в расписании в бронировании необходимо отправить запрос к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction). В результате выполнения запроса все изменения в бронировании, выполненные в текущей сессии, будут сохранены, а бронирование закрыто.

В запросе необходимо указать:
- ```/EnhancedEndTransactionRQ/EndTransaction/@Ind``` — признак сохранения бронирования (значение ```true```)
- ```/EnhancedEndTransactionRQ/EndTransaction/ScheduleChange/@Ind``` — признак принятия изменений в расписании бронирования (значение ```true```)
- ```/EnhancedEndTransactionRQ/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

Принятие изменений в расписании требуется только в тех случаях, когда в бронировании есть сегменты без статуса ```HK```, например, если была изменена даты вылета для рейса (статус сегмента ```TK```), рейс отменен (статус сегмента ```UN```) и перевозчик предложил альтернативный рейс (статус сегмента ```TK```).

Сервис выполняет следующие действия в открытом бронировании:
- удаляет неподтвержденные сегменты (```UN```, ```UC```, ```HX``` и др.)
- подтверждает сегменты с изменением времени вылета (меняет статус сегментов с ```TK``` на ```HK```)
- сохраняет бронирование и открывает его вновь

Подробнее см. в [Format Finder](https://formatfinder.sabre.com/Content/Queues/QueuesEndTransactionE.aspx?ItemID=f138117117e44e5282341adcbdf46a5b).

{% xmlsec "Пример запроса", false %}
<EnhancedEndTransactionRQ version="1.0.0" xmlns="http://services.sabre.com/sp/eet/v1">
  <EndTransaction Ind="true">
    <ScheduleChange Ind="true"/>
  </EndTransaction>
  <Source ReceivedFrom="API"/>
</EnhancedEndTransactionRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<EnhancedEndTransactionRS xmlns="http://services.sabre.com/sp/eet/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-02-02T10:39:20.457-06:00"/>
  </ApplicationResults>
  <ItineraryRef ID="BPBEQK">
    <Source CreateDateTime="2020-02-02T10:39"/>
  </ItineraryRef>
  <Text>OK 1039 BPBEQK</Text>
</EnhancedEndTransactionRS>
{% endxmlsec %}

## Отправка SSR (UpdatePassengerNameRecordRQ)

После бронирования новых сегментов необходимо повторно отправить все SSR, которые должны быть привязаны к новым сегментам. Для этого используется сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record).

*Обратите внимание на то, что повторно требуется отправить только те SSR, которые "привязываются" к сегментам (например, ```DOCS```, ```DOCO```, ```DOCA```, ```INFT```, ```CHLD```, ```CTCM```, ```CTCE``` и другие). SSR, которые не привязываются к сегментам (например, ```FOID```), а также OSI сообщения повторно отправлять не требуется.* 

В запросе необходимо указать:
- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/AdvancePassenger``` — SSR типа ```DOCS```, ```DOCO``` и ```DOCA``` (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.md#dobavlenie_pasportnih_dannih_i_otpravka_drugih_soobschenii_perevozchiku_ssr_i_osi))
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` — другие SSR (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.md#dobavlenie_pasportnih_dannih_i_otpravka_drugih_soobschenii_perevozchiku_ssr_i_osi))
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ/Source/@ReceivedFrom``` — значение поля Received From при сохранении бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

{% xmlsec "Пример запроса" %}
<UpdatePassengerNameRecordRQ haltOnAirPriceError="true" version="1.0.0" xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <Itinerary id="BPBEQK"/>
  <SpecialReqDetails>
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

{% xmlsec "Пример ответа" %}
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-02-02T10:39:40.969-06:00"/>
    <Warning timeStamp="2020-02-02T10:39:40.472-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="BPBEQK"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <AccountingInfo Id="31">
        <Airline Code="SU"/>
        <BaseFare Amount="58000" CurrencyCode="RUB"/>
        <DocumentInfo>
          <Document Number="5588040266"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="580"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="6008"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>D</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="32">
        <Airline Code="SU"/>
        <BaseFare Amount="58000" CurrencyCode="RUB"/>
        <DocumentInfo>
          <Document Number="5588040267"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="580"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="6008"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>D</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="42">
        <Airline Code="SU"/>
        <BaseFare Amount="43500" CurrencyCode="RUB"/>
        <DocumentInfo>
          <Document Number="5588040268"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="435"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="3.1">IVANOV ANDREY</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="5704"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>D</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="48">
        <Airline Code="SU"/>
        <BaseFare Amount="0" CurrencyCode="RUB"/>
        <DocumentInfo>
          <Document Number="5588040269"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="0"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="4.1">I IVANOVA EKATERINA</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="0"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>D</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
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
                <Text>2FRH 9LSC*AWT 1934/02FEB20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
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
                <Text>2FRH 9LSC*AWT 1934/02FEB20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="CNN">
                <PassengerData NameNumber="03.01">IVANOV/ANDREY</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="3">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1934/02FEB20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
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
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="55" IsPast="false" NumberInParty="03" ResBookDesigCode="T" SegmentBookedDate="2020-02-02T10:39:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AER"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="T">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="T">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <SupplierRef ID="DCSU*JBLHKB"/>
              <UpdatedArrivalTime>09-01T10:15</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-01T07:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="1">
                  <DepartureAirport>SVO</DepartureAirport>
                  <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
                  <DepartureTerminalCode>B</DepartureTerminalCode>
                  <ArrivalAirport>AER</ArrivalAirport>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1138</MarketingFlightNumber>
                  <MarketingClassOfService>T</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>150</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*JBLHKB</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-01T07:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-01T10:15:00</ArrivalDateTime>
                  <FlightNumber>1138</FlightNumber>
                  <ClassOfService>T</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-02-02T10:39:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="57" IsPast="false" NumberInParty="03" ResBookDesigCode="Q" SegmentBookedDate="2020-02-02T10:39:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Q">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Q">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AER"/>
              <SupplierRef ID="DCSU*JBLHKB"/>
              <UpdatedArrivalTime>09-08T05:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="2">
                  <DepartureAirport>AER</DepartureAirport>
                  <ArrivalAirport>SVO</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
                  <ArrivalTerminalCode>B</ArrivalTerminalCode>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1129</MarketingFlightNumber>
                  <MarketingClassOfService>Q</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>155</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*JBLHKB</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
                  <FlightNumber>1129</FlightNumber>
                  <ClassOfService>Q</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-02-02T10:39:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="T-02FEB-2FRH*AWT"/>
        <Ticketing RPH="02" eTicketNumber="TE 5555588040266-RU IVANO/I 2FRH*AWT 1934/02FEB*D">
          <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
        </Ticketing>
        <Ticketing RPH="03" eTicketNumber="TE 5555588040267-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
          <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
        </Ticketing>
        <Ticketing RPH="04" eTicketNumber="TE 5555588040268-RU IVANO/A 2FRH*AWT 1934/02FEB*D">
          <PersonName NameNumber="3.1">IVANOV ANDREY</PersonName>
        </Ticketing>
        <Ticketing RPH="05" eTicketNumber="TE 5555588040269-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
          <PersonName NameNumber="4.1">I IVANOVA EKATERINA</PersonName>
        </Ticketing>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="BPBEQK" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-02-02T10:34" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-02-02T10:39" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="7"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="26" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
        <Remark Id="35" RPH="002" Type="General">
          <Text>XXTAW/</Text>
        </Remark>
        <Remark Id="44" RPH="003" Type="General">
          <Text>XXTAW/</Text>
        </Remark>
        <Remark Id="50" RPH="004" Type="General">
          <Text>XXTAW/</Text>
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
      <SpecialServiceInfo Id="61" RPH="004" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="62" RPH="005" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="56" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="58" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="63" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="64" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="65" RPH="011" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="66" RPH="012" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="67" RPH="013" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="68" RPH="014" Type="GFX">
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
          <SegmentAssociation SegmentAssociationId="-1">
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
          <SegmentAssociation SegmentAssociationId="-1">
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
        <OpenReservationElement elementId="pnr-61" id="61" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="55" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
              <ClassOfService>T</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-62" id="62" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="57" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Q</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-55" id="55"/>
        <OpenReservationElement elementId="pnr-or-55" id="55"/>
        <OpenReservationElement elementId="pnr-or-57" id="57"/>
        <OpenReservationElement elementId="pnr-or-57" id="57"/>
        <OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="55" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
              <ClassOfService>T</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-58" id="58" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="57" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Q</ClassOfService>
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
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
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
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
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
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
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
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
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
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
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
        <OpenReservationElement elementId="pnr-63" id="63" type="SRVC">
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
        <OpenReservationElement elementId="pnr-64" id="64" type="SRVC">
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
        <OpenReservationElement elementId="pnr-65" id="65" type="SRVC">
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
        <OpenReservationElement elementId="pnr-66" id="66" type="SRVC">
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
        <OpenReservationElement elementId="pnr-67" id="67" type="SRVC">
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
        <OpenReservationElement elementId="pnr-68" id="68" type="SRVC">
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
      </OpenReservationElements>
      <AssociationMatrices>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-2.1"/>
          <Child ref="pnr-31"/>
          <Child ref="pnr-33"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-4.2"/>
          <Child ref="pnr-32"/>
          <Child ref="pnr-34"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-6.3"/>
          <Child ref="pnr-42"/>
          <Child ref="pnr-43"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-8.4"/>
          <Child ref="pnr-48"/>
          <Child ref="pnr-49"/>
        </AssociationMatrix>
      </AssociationMatrices>
    </TravelItinerary>
  </TravelItineraryRead>
</UpdatePassengerNameRecordRS>
{% endxmlsec %}

## Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="BPBEQK"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-02-02T10:39:50.288-06:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="31">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="58000" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040266"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="580"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="6008"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="58000" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040267"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="580"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="6008"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="42">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="43500" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040268"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="435"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="5704"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="48">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="0" CurrencyCode="RUB"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040269"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="0"/>
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
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
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
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
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
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="CNN">
              <tir310:PassengerData NameNumber="03.01">IVANOV/ANDREY</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuote RPH="3">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 1934/02FEB20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-02-02T19:34" TaxExempt="false" ValidatingCarrier="SU">
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
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
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
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="55" IsPast="false" NumberInParty="03" ResBookDesigCode="T" SegmentBookedDate="2020-02-02T10:39:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AER"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="T">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="T">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:SupplierRef ID="DCSU*JBLHKB"/>
            <tir310:UpdatedArrivalTime>09-01T10:15</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T07:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="4" sequence="1">
                <or110:DepartureAirport>SVO</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL B - DOMESTIC</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>B</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>AER</or110:ArrivalAirport>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1138</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>T</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>150</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*JBLHKB</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T07:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T10:15:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1138</or110:FlightNumber>
                <or110:ClassOfService>T</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-02-02T10:39:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="57" IsPast="false" NumberInParty="03" ResBookDesigCode="Q" SegmentBookedDate="2020-02-02T10:39:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Q">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Q">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AER"/>
            <tir310:SupplierRef ID="DCSU*JBLHKB"/>
            <tir310:UpdatedArrivalTime>09-08T05:20</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T02:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="5" sequence="2">
                <or110:DepartureAirport>AER</or110:DepartureAirport>
                <or110:ArrivalAirport>SVO</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL B - DOMESTIC</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>B</or110:ArrivalTerminalCode>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1129</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Q</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>155</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*JBLHKB</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T05:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1129</or110:FlightNumber>
                <or110:ClassOfService>Q</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-02-02T10:39:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-02FEB-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 5555588040266-RU IVANO/I 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 5555588040267-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 5555588040268-RU IVANO/A 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 5555588040269-RU IVANO/E 2FRH*AWT 1934/02FEB*D">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="BPBEQK" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-02-02T10:34" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-02-02T10:39" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="7"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="26" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="35" RPH="002" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="44" RPH="003" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="50" RPH="004" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
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
    <tir310:SpecialServiceInfo Id="61" RPH="004" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="62" RPH="005" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="56" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="58" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
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
    <tir310:SpecialServiceInfo Id="63" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="64" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="65" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="66" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="67" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="68" RPH="014" Type="GFX">
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
        <or110:SegmentAssociation SegmentAssociationId="-1">
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
        <or110:SegmentAssociation SegmentAssociationId="-1">
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
      <or110:OpenReservationElement elementId="pnr-61" id="61" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU KK1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="55" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>T</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-62" id="62" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU KK1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="57" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Q</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-55" id="55"/>
      <or110:OpenReservationElement elementId="pnr-or-55" id="55"/>
      <or110:OpenReservationElement elementId="pnr-or-57" id="57"/>
      <or110:OpenReservationElement elementId="pnr-or-57" id="57"/>
      <or110:OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 SVOAER1138T01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="55" SegmentAssociationId="4">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>T</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-58" id="58" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 AERSVO1129Q08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="57" SegmentAssociationId="5">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Q</or110:ClassOfService>
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
      <or110:OpenReservationElement elementId="pnr-63" id="63" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-64" id="64" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-65" id="65" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-66" id="66" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-67" id="67" type="SRVC">
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
      <or110:OpenReservationElement elementId="pnr-68" id="68" type="SRVC">
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
    <tir310:AssociationMatrices>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-2.1"/>
        <tir310:Child ref="pnr-31"/>
        <tir310:Child ref="pnr-33"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-4.2"/>
        <tir310:Child ref="pnr-32"/>
        <tir310:Child ref="pnr-34"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-6.3"/>
        <tir310:Child ref="pnr-42"/>
        <tir310:Child ref="pnr-43"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-8.4"/>
        <tir310:Child ref="pnr-48"/>
        <tir310:Child ref="pnr-49"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
{% endxmlsec %}

## Вынужденный обмен билета (TKT_ExchangeRQ)

Для вынужденного обмена билетов используется сервис [TKT_ExchangeRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/schedule_change).

В запросе необходимо указать:
- ```/ExchangeRQ/POS/STL:Company``` — код системы бронирования. Всегда ```1S```
- ```/ExchangeRQ/POS/STL:Pseudo``` — PCC, в котором производится обмен билета
- ```/ExchangeRQ/TransactionInfo/TicketingDocument/Number``` — номер билета (13 цифр)
- ```/ExchangeRQ/TransactionInfo/Options/Commission``` — размер комиссии в абсолютном значении
- ```/ExchangeRQ/TransactionInfo/Options/PNRSelect/Name``` — номер пассажира в бронировании, для которого производится обмен билета

Дополнительно в запросе можно указать:
- ```/ExchangeRQ/TransactionInfo/Options/TourCode``` — текст туркода для добавления в билет
- ```/ExchangeRQ/TransactionInfo/Options/Endorsement``` — текст для добавления в полe Endorsement билета

{% xmlsec "Пример запроса", false %}
<ExchangeRQ version="1.4.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0" xmlns:STL="http://www.sabre.com/ns/Ticketing/TTL/1.0">
  <POS>
    <STL:Company>1S</STL:Company>
    <STL:Pseudo>2FRH</STL:Pseudo>
  </POS>
  <TransactionInfo>
    <TicketingDocument>
      <Number>5555588040266</Number>
    </TicketingDocument>
    <Options>
      <Commission>599</Commission>
      <PNRSelect>
        <Name>1.1</Name>
      </PNRSelect>
    </Options>
  </TransactionInfo>
</ExchangeRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<ns2:ExchangeRS version="1.4.0" xmlns="http://www.sabre.com/ns/Ticketing/TTL/1.0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0">
  <ns2:Header messageID="TKTVLC750-6345-641438784-1580661622391-23541-arex" timeStamp="2020-02-02T10:40:00.000">
    <OrchestrationID>TKTVLC750-6345-641438784-1580661622391-23541-arex</OrchestrationID>
    <Results>
      <Success>
        <System>TKT-DS</System>
        <Source>AREX</Source>
      </Success>
    </Results>
  </ns2:Header>
  <ns2:TransactionInfo reservationAutoEndProcessed="true" reservationAutoRetrieveProcessed="false">
    <ns2:Message type="I">OK     64008</ns2:Message>
    <ns2:Message type="I">ETR EXCHANGE PROCESSED</ns2:Message>
    <ns2:Message type="I">OK 6.6</ns2:Message>
    <ns2:Message type="I">SCHEDULE CHANGE EXCHANGE COMPLETED</ns2:Message>
    <ns2:Message type="I">OK 1040 BPBEQK TTY REQ PEND</ns2:Message>
    <ns2:Message type="I">INVOICED                   - NUMBER 0000156</ns2:Message>
  </ns2:TransactionInfo>
</ns2:ExchangeRS>
{% endxmlsec %}

*Обратите внимание на то, что данный рекомендованный процесс возврата билетов разработан с учетом того, что в PCC, в котором производится возврат билетов включена настройка [Automatically End Transaction at Ticketing](tjr-settings.md#automatically_end_transaction_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_pri_oformlenii_biletov).*

*Если эта настройка не включена, то после отправки запроса на возврат билета необходимо сохранить бронирование при помощи запроса к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction) (см. [Редактирование бронирований](edit-booking.md)).*

*Если эта настройка не включена, но включена настройка [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.md#automatically_end_transaction_and_redisplay_the_pnr_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_i_povtornoe_ih_otkritie_pri_oformlenii_biletov), то сохранение и чтение бронирования после возврата билета не требуется, но может потребоваться игнорирование бронирования при помощи запроса к сервису [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction) (см. [Редактирование бронирований](edit-booking.md)).*
