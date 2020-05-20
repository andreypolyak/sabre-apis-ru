# Возврат билетов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Подробнее об условиях выполнения возвратов билетов см. в [Обмены и возвраты](exchanges-refunds.md#dobrovolnii_vozvrat_biletov).

## Алгоритм возврата билетов

{% imgsec "Схема", "0", "refund-ticket" %}./assets/svg/refund-ticket/refund-ticket.svg{% endimgsec %}

## Выбор стока (DesignatePrinterLLSRQ)

*Для возврата билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

**Возврат билетов всегда должен выполняться в том же PCC, где они были оформлены!**

В Sabre существует возможность оформления билетов на разных платформах или стоках. Для того, чтобы указать сток, на котором будет произведена выписка билета, используется сервис [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

В качестве значения атрибута ```/DesignatePrinterRQ/Printers/Ticket/@CountryCode``` в запросе должен быть указан код стока.

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
    <stl:Success timeStamp="2020-01-31T07:50:30-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="480EFF">W*RU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
{% endxmlsec %}

## Выбор принтера (DesignatePrinterLLSRQ)

Перед оформление билета или EMD в Sabre необходимо указать терминальный адрес принтера (PTRTA) в запросе к сервису [DesignatePrinterLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/designate_printer).

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
    <stl:Success timeStamp="2020-01-31T07:50:38-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="480EFF">PTR/B0DE83</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</DesignatePrinterRS>
{% endxmlsec %}

## Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса" %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="CTKCTF"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-31T07:50:45.562-06:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="30">
      <tir310:Airline Code="B2"/>
      <tir310:BaseFare Amount="28915"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040252"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="289"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="1279"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="31">
      <tir310:Airline Code="B2"/>
      <tir310:BaseFare Amount="28915"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040253"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="289"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="1279"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="41">
      <tir310:Airline Code="B2"/>
      <tir310:BaseFare Amount="21735"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040254"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="217"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="1123"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>F</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="47">
      <tir310:Airline Code="B2"/>
      <tir310:BaseFare Amount="2900"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="5588040255"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="29"/>
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
              <tir310:Text>2FRH 9LSC*AWT 1649/31JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAB2¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-31T16:49" TaxExempt="false" ValidatingCarrier="B2">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="419.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="28915" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="1279" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">966YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">313B8</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="30194" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="838.00"/>
                  <tir310:EquivFare Amount="57830"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="2558"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="60388"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAB2$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - B2</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YFLX2/YFLX2"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW B2 MSQ Q11.07 220.91B2 MOW Q11.07 220.91NUC463.96END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T05:40" FlightNumber="954" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="954"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:35" FlightNumber="955" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="955"/>
                  <tir310:OriginLocation LocationCode="MSQ"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="22091" FareBasisCode="YFLX2" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="B2" TicketDesignator="">
                  <tir310:Location Destination="MSQ" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T07:00" DepartureDateTime="09-01T05:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="22091" FareBasisCode="YFLX2" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="B2" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="MSQ"/>
                  <tir310:Dates ArrivalDateTime="09-08T18:55" DepartureDateTime="09-08T17:35"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 07FEB/1649</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 07FEB</tir310:ResTicketingRestrictions>
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
              <tir310:Text>2FRH 9LSC*AWT 1649/31JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAB2¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-31T16:49" TaxExempt="false" ValidatingCarrier="B2">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="315.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="21735" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="1123" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">966YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">157B8</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="22858" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="315.00"/>
                  <tir310:EquivFare Amount="21735"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="1123"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="22858"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAB2$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - B2</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YFLX2/CH25/YFLX2/CH25"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW B2 MSQ Q8.30 165.68B2 MOW Q8.30 165.68NUC347.96END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T05:40" FlightNumber="954" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2/CH25"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="954"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:35" FlightNumber="955" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2/CH25"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="955"/>
                  <tir310:OriginLocation LocationCode="MSQ"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="16568" FareBasisCode="YFLX2/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="B2" TicketDesignator="CH25">
                  <tir310:Location Destination="MSQ" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T07:00" DepartureDateTime="09-01T05:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="16568" FareBasisCode="YFLX2/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="B2" TicketDesignator="CH25">
                  <tir310:Location Destination="MOW" Origin="MSQ"/>
                  <tir310:Dates ArrivalDateTime="09-08T18:55" DepartureDateTime="09-08T17:35"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 07FEB/1649</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 07FEB</tir310:ResTicketingRestrictions>
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
              <tir310:Text>2FRH 9LSC*AWT 1649/31JAN20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPAB2¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-31T16:49" TaxExempt="false" ValidatingCarrier="B2">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="42.00" CurrencyCode="EUR"/>
                <tir310:EquivFare Amount="2900" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="0" TaxCode="TE"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="2900" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="42.00"/>
                  <tir310:EquivFare Amount="2900"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="0"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="2900"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPAB2$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - B2</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YFLX2/IN90/YFLX2/IN90"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW B2 MSQ Q1.10 22.09B2 MOW Q1.10 22.09NUC46.38END ROE0.903053</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T05:40" FlightNumber="954" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2/IN90"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="954"/>
                  <tir310:OriginLocation LocationCode="DME"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T17:35" FlightNumber="955" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YFLX2/IN90"/>
                  <tir310:MarketingAirline Code="B2" FlightNumber="955"/>
                  <tir310:OriginLocation LocationCode="MSQ"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2021-09-01</tir310:NotValidAfter>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="DME"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="2209" FareBasisCode="YFLX2/IN90" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="B2" TicketDesignator="IN90">
                  <tir310:Location Destination="MSQ" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T07:00" DepartureDateTime="09-01T05:40"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="2209" FareBasisCode="YFLX2/IN90" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="B2" TicketDesignator="IN90">
                  <tir310:Location Destination="MOW" Origin="MSQ"/>
                  <tir310:Dates ArrivalDateTime="09-08T18:55" DepartureDateTime="09-08T17:35"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 07FEB/1649</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 07FEB</tir310:ResTicketingRestrictions>
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
          <tir310:BaseFare Amount="1195.00"/>
          <tir310:EquivFare Amount="82465.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="3681.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="86146.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="0428" ArrivalDateTime="09-01T07:00" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T05:40" ElapsedTime="01.20" FlightNumber="0954" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-31T07:49:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="MSQ"/>
            <tir310:Equipment AirEquipType="735"/>
            <tir310:MarketingAirline Code="B2" FlightNumber="0954" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY BELAVIA</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="B2" FlightNumber="0954" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY BELAVIA</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="B2"/>
            <tir310:DisclosureCarrier Code="B2" DOT="false">
              <tir310:Banner>BELAVIA</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="DME"/>
            <tir310:SupplierRef ID="DCB2*JUCAVU"/>
            <tir310:UpdatedArrivalTime>09-01T07:00</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T05:40</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>DME</or110:DepartureAirport>
                <or110:ArrivalAirport>MSQ</or110:ArrivalAirport>
                <or110:EquipmentType>735</or110:EquipmentType>
                <or110:MarketingAirlineCode>B2</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>954</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>80</or110:ElapsedTime>
                <or110:AirMilesFlown>428</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="B2" DOT="false">
                  <or110:Banner>BELAVIA</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCB2*JUCAVU</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T05:40:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T07:00:00</or110:ArrivalDateTime>
                <or110:FlightNumber>954</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-31T07:49:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0428" ArrivalDateTime="09-08T18:55" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T17:35" ElapsedTime="01.20" FlightNumber="0955" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-31T07:49:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="DME"/>
            <tir310:Equipment AirEquipType="733"/>
            <tir310:MarketingAirline Code="B2" FlightNumber="0955" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY BELAVIA</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="B2" FlightNumber="0955" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY BELAVIA</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="B2"/>
            <tir310:DisclosureCarrier Code="B2" DOT="false">
              <tir310:Banner>BELAVIA</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="MSQ"/>
            <tir310:SupplierRef ID="DCB2*JUCAVU"/>
            <tir310:UpdatedArrivalTime>09-08T18:55</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T17:35</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>MSQ</or110:DepartureAirport>
                <or110:ArrivalAirport>DME</or110:ArrivalAirport>
                <or110:EquipmentType>733</or110:EquipmentType>
                <or110:MarketingAirlineCode>B2</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>955</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>80</or110:ElapsedTime>
                <or110:AirMilesFlown>428</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="B2" DOT="false">
                  <or110:Banner>BELAVIA</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCB2*JUCAVU</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T17:35:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T18:55:00</or110:ArrivalDateTime>
                <or110:FlightNumber>955</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-01-31T07:49:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-31JAN-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 6285588040252-RU IVANO/I 2FRH*AWT 1649/31JAN*I">
        <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 6285588040253-RU IVANO/E 2FRH*AWT 1649/31JAN*I">
        <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 6285588040254-RU IVANO/A 2FRH*AWT 1649/31JAN*I">
        <tir310:PersonName NameNumber="3.1">IVANOV ANDREY</tir310:PersonName>
      </tir310:Ticketing>
      <tir310:Ticketing RPH="05" eTicketNumber="TE 6285588040255-RU IVANO/E 2FRH*AWT 1649/31JAN*I">
        <tir310:PersonName NameNumber="4.1">I IVANOVA EKATERINA</tir310:PersonName>
      </tir310:Ticketing>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="CTKCTF" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-31T07:49" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-31T07:49" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="34" RPH="001" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="43" RPH="002" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="49" RPH="003" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
    </tir310:RemarkInfo>
    <tir310:SpecialServiceInfo Id="9" RPH="001" Type="AFX">
      <tir310:Service SSR_Code="OSI">
        <tir310:PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</tir310:PersonName>
        <tir310:Text>AA INF</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="28" RPH="002" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>B2 KK1 DMEMSQ0954Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="29" RPH="003" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>B2 KK1 MSQDME0955Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="18" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 DMEMSQ0954Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="19" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 MSQDME0955Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="36" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 DMEMSQ0954Y01SEP/6285588040252C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="37" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 MSQDME0955Y08SEP/6285588040252C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="38" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 DMEMSQ0954Y01SEP/6285588040253C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="39" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 MSQDME0955Y08SEP/6285588040253C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="44" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 DMEMSQ0954Y01SEP/6285588040254C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="45" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 MSQDME0955Y08SEP/6285588040254C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="50" RPH="015" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 DMEMSQ0954Y01SEP/INF6285588040255C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="51" RPH="016" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="B2"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 MSQDME0955Y08SEP/INF6285588040255C2</tir310:Text>
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
      <or110:OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="B2" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT B2 KK1 DMEMSQ0954Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="B2" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT B2 KK1 MSQDME0955Y08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
        <or110:ServiceRequest actionCode="NN" airlineCode="B2" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT B2 NN1 DMEMSQ0954Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
        <or110:ServiceRequest actionCode="NN" airlineCode="B2" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT B2 NN1 MSQDME0955Y08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/79851234567/RU</or110:FreeText>
          <or110:FullText>CTCM B2 HK1/79851234567/RU</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:Comment>COM/RU</or110:Comment>
          <or110:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or110:FreeText>
          <or110:FullText>CTCE B2 HK1/CUSTOMER//CUSTOMER.COM/RU</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FreeText>
          <or110:FullText>DOCS B2 HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS B2 HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FreeText>
          <or110:FullText>DOCS B2 HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FullText>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS B2 HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
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
      <or110:OpenReservationElement elementId="pnr-36" id="36" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040252C1</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 DMEMSQ0954Y01SEP/6285588040252C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-37" id="37" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040252C2</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 MSQDME0955Y08SEP/6285588040252C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040253C1</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 DMEMSQ0954Y01SEP/6285588040253C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-39" id="39" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040253C2</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 MSQDME0955Y08SEP/6285588040253C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-44" id="44" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040254C1</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 DMEMSQ0954Y01SEP/6285588040254C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/6285588040254C2</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 MSQDME0955Y08SEP/6285588040254C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-50" id="50" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6285588040255C1</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 DMEMSQ0954Y01SEP/INF6285588040255C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0954</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>DME</or110:BoardPoint>
            <or110:OffPoint>MSQ</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-51" id="51" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="B2" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/INF6285588040255C2</or110:FreeText>
          <or110:FullText>TKNE B2 HK1 MSQDME0955Y08SEP/INF6285588040255C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>B2</or110:CarrierCode>
            <or110:FlightNumber>0955</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>MSQ</or110:BoardPoint>
            <or110:OffPoint>DME</or110:OffPoint>
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
      <or110:OpenReservationElement elementId="pnr-or-2755b13c-ea6d-4bd8-b253-938c7f4f82be" id="2755b13c-ea6d-4bd8-b253-938c7f4f82be" type="APO">
        <or110:AncillaryProduct Id="1">
          <or110:XmlData>
            <or110:AncillaryServiceData id="19">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationTag>
                  <or110:CarrierCode>B2</or110:CarrierCode>
                  <or110:FlightNumber>0954</or110:FlightNumber>
                  <or110:DepartureDate>2020-09-01</or110:DepartureDate>
                  <or110:BoardPoint>DME</or110:BoardPoint>
                  <or110:OffPoint>MSQ</or110:OffPoint>
                  <or110:ClassOfService>Y</or110:ClassOfService>
                  <or110:BookingStatus>HK</or110:BookingStatus>
                </or110:SegmentAssociationTag>
                <or110:SegmentAssociationId>2</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:RficSubcode>SSR</or110:RficSubcode>
              <or110:SSRCode>INFT</or110:SSRCode>
              <or110:ProductText>IVANOVA/EKATERINA/20FEB19</or110:ProductText>
              <or110:OwningCarrierCode>B2</or110:OwningCarrierCode>
              <or110:InventoryControlledIndicator>true</or110:InventoryControlledIndicator>
              <or110:Segment id="16" sequence="1">
                <or110:AirlineCode>B2</or110:AirlineCode>
                <or110:FlightNumber>0954</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2020-09-01</or110:DepartureDate>
                <or110:BoardPoint>DME</or110:BoardPoint>
                <or110:OffPoint>MSQ</or110:OffPoint>
                <or110:MarketingCarrier>B2</or110:MarketingCarrier>
                <or110:OperatingCarrier>B2</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-38125a91-0c6c-4ffc-994a-db2ada4b0794" id="38125a91-0c6c-4ffc-994a-db2ada4b0794" type="APO">
        <or110:AncillaryProduct Id="2">
          <or110:XmlData>
            <or110:AncillaryServiceData id="21">
              <or110:NameAssociationList>
                <or110:NameAssociationTag>
                  <or110:LastName>IVANOV</or110:LastName>
                  <or110:FirstName>IVAN MR</or110:FirstName>
                  <or110:ReferenceId>1</or110:ReferenceId>
                </or110:NameAssociationTag>
              </or110:NameAssociationList>
              <or110:SegmentAssociationList>
                <or110:SegmentAssociationTag>
                  <or110:CarrierCode>B2</or110:CarrierCode>
                  <or110:FlightNumber>0955</or110:FlightNumber>
                  <or110:DepartureDate>2020-09-08</or110:DepartureDate>
                  <or110:BoardPoint>MSQ</or110:BoardPoint>
                  <or110:OffPoint>DME</or110:OffPoint>
                  <or110:ClassOfService>Y</or110:ClassOfService>
                  <or110:BookingStatus>HK</or110:BookingStatus>
                </or110:SegmentAssociationTag>
                <or110:SegmentAssociationId>3</or110:SegmentAssociationId>
              </or110:SegmentAssociationList>
              <or110:RficSubcode>SSR</or110:RficSubcode>
              <or110:SSRCode>INFT</or110:SSRCode>
              <or110:ProductText>IVANOVA/EKATERINA/20FEB19</or110:ProductText>
              <or110:OwningCarrierCode>B2</or110:OwningCarrierCode>
              <or110:InventoryControlledIndicator>true</or110:InventoryControlledIndicator>
              <or110:Segment id="17" sequence="2">
                <or110:AirlineCode>B2</or110:AirlineCode>
                <or110:FlightNumber>0955</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:DepartureDate>2020-09-08</or110:DepartureDate>
                <or110:BoardPoint>MSQ</or110:BoardPoint>
                <or110:OffPoint>DME</or110:OffPoint>
                <or110:MarketingCarrier>B2</or110:MarketingCarrier>
                <or110:OperatingCarrier>B2</or110:OperatingCarrier>
              </or110:Segment>
            </or110:AncillaryServiceData>
          </or110:XmlData>
        </or110:AncillaryProduct>
      </or110:OpenReservationElement>
    </tir310:OpenReservationElements>
    <tir310:AssociationMatrices>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-2.1"/>
        <tir310:Child ref="pnr-30"/>
        <tir310:Child ref="pnr-32"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-4.2"/>
        <tir310:Child ref="pnr-31"/>
        <tir310:Child ref="pnr-33"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-6.3"/>
        <tir310:Child ref="pnr-41"/>
        <tir310:Child ref="pnr-42"/>
      </tir310:AssociationMatrix>
      <tir310:AssociationMatrix>
        <tir310:Name>PersonIDType</tir310:Name>
        <tir310:Parent ref="pnr-8.4"/>
        <tir310:Child ref="pnr-47"/>
        <tir310:Child ref="pnr-48"/>
      </tir310:AssociationMatrix>
    </tir310:AssociationMatrices>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
{% endxmlsec %}

## Возврат билета (TKT_RefundRQ)

Для возврата билета также используется сервис [TKT_RefundRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/auto_price_air_refunds). Обратите внимание на то, что возврат билета является **платной операцией**. 

В запросе необходимо указать:
- ```/RefundRQ/POS/STL:Company``` — код системы бронирования. Всегда ```1S```
- ```/RefundRQ/POS/STL:Pseudo``` — PCC, в котором производится возврат билета
- ```/RefundRQ/TransactionInfo/@requestType``` — тип запроса. Всегда ```Fulfill```
- ```/RefundRQ/TransactionInfo/TicketingDocument/Number``` — номер билета (13 цифр)

{% xmlsec "Пример запроса" %}
<RefundRQ version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0" xmlns:STL="http://services.sabre.com/STL/v01">
  <POS>
    <STL:Company>1S</STL:Company>
    <STL:Pseudo>2FRH</STL:Pseudo>
  </POS>
  <TransactionInfo requestType="Fulfill">
    <TicketingDocument>
      <Number>6285588040252</Number>
    </TicketingDocument>
  </TransactionInfo>
</RefundRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<RefundRS version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0">
  <Header messageID="TKTVLC750-6345-641438784-1580478656845-22213-arex" version="1.1.0">
    <STL:OrchestrationID xmlns:STL="http://services.sabre.com/STL/v01">TKTVLC750-6345-641438784-1580478656845-22213-arex</STL:OrchestrationID>
    <STL:Results xmlns:STL="http://services.sabre.com/STL/v01">
      <STL:Success>
        <STL:System>TKT-WS</STL:System>
        <STL:Source>AREX</STL:Source>
      </STL:Success>
    </STL:Results>
  </Header>
  <Ticket number="6285588040252" type="TKT">
    <Details>
      <LocalIssueDate>2020-01-31T16:49:00</LocalIssueDate>
      <IssueLocation>2FRH</IssueLocation>
      <Reservation>CTKCTF</Reservation>
      <AgencyIdentifier>99999992</AgencyIdentifier>
      <ValidatingCarrier>B2</ValidatingCarrier>
    </Details>
    <Traveler firstName="IVAN MR" lastName="IVANOV" type="ADT"/>
    <ServiceCoupon number="1" status="OK">
      <StartLocation>DME</StartLocation>
      <EndLocation>MSQ</EndLocation>
      <StartDate>2020-09-01</StartDate>
      <StartTime>05:40:00</StartTime>
      <MarketingFlightNumber carrierCode="B2">954</MarketingFlightNumber>
      <BookingClass>Y</BookingClass>
      <FareBasis>YFLX2</FareBasis>
    </ServiceCoupon>
    <ServiceCoupon number="2" status="OK">
      <StartLocation>MSQ</StartLocation>
      <EndLocation>DME</EndLocation>
      <StartDate>2020-09-08</StartDate>
      <StartTime>17:35:00</StartTime>
      <MarketingFlightNumber carrierCode="B2">955</MarketingFlightNumber>
      <BookingClass>Y</BookingClass>
      <FareBasis>YFLX2</FareBasis>
    </ServiceCoupon>
    <Payment type="CA">
      <Amount currencyCode="RUB" decimalPlaces="0">30194</Amount>
      <Remarks>CA</Remarks>
    </Payment>
  </Ticket>
  <PriceInfo>
    <Refund fareNonRefundable="false" priceType="System" taxesNonRefundable="false">
      <BaseFareInfo currencyCode="EUR" decimalPlaces="2">
        <DocumentAmount>419.00</DocumentAmount>
        <UsedAmount>0.00</UsedAmount>
      </BaseFareInfo>
      <FareInfo currencyCode="RUB" decimalPlaces="0">
        <DocumentAmount>28915</DocumentAmount>
        <NonRefundableAmount>0</NonRefundableAmount>
        <UsedAmount>0</UsedAmount>
        <TotalFeesAmount>0</TotalFeesAmount>
        <CalculatedAmount>28915</CalculatedAmount>
        <RefundAmount>28915</RefundAmount>
      </FareInfo>
      <TaxInfo currencyCode="RUB" decimalPlaces="0">
        <Tax code="YQ">
          <DocumentAmount>966</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>966</CalculatedAmount>
          <RefundAmount>966</RefundAmount>
        </Tax>
        <Tax code="B8">
          <DocumentAmount>313</DocumentAmount>
          <NonRefundableAmount>0</NonRefundableAmount>
          <UsedAmount>0</UsedAmount>
          <CalculatedAmount>313</CalculatedAmount>
          <RefundAmount>313</RefundAmount>
        </Tax>
        <TotalTaxRefundAmount>1279</TotalTaxRefundAmount>
      </TaxInfo>
      <CommissionInfo>
        <Commission>
          <Percent>1.0</Percent>
        </Commission>
      </CommissionInfo>
    </Refund>
    <GrandTotal currencyCode="RUB" decimalPlaces="0">30194</GrandTotal>
  </PriceInfo>
  <TransactionInfo fulfilled="true" reservationAutoEndProcessed="true">
    <Message type="I">REFUND TRANSACTION PROCESSED</Message>
    <Message type="I">REFUND ACCOUNTING DATA CREATED IN ACTIVE PNR</Message>
    <Message type="I">ETR REFUND TRANSACTION PROCESSED</Message>
    <Message type="I">OK 0750 CTKCTF</Message>
    <Payment type="CA">
      <Amount currencyCode="RUB" decimalPlaces="0">30194</Amount>
      <Remarks>CA</Remarks>
    </Payment>
  </TransactionInfo>
</RefundRS>
{% endxmlsec %}

*Обратите внимание на то, что данный рекомендованный процесс возврата билетов разработан с учетом того, что в PCC, в котором производится возврат билетов включена настройка [Automatically End Transaction at Ticketing](tjr-settings.md#automatically_end_transaction_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_pri_oformlenii_biletov).*

*Если эта настройка не включена, то после отправки запроса на возврат билета необходимо сохранить бронирование при помощи запроса к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction) (см. [Редактирование бронирований](edit-booking.md)).*

*Если эта настройка не включена, но включена настройка [Automatically End Transaction and Redisplay the PNR at Ticketing](tjr-settings.md#automatically_end_transaction_and_redisplay_the_pnr_at_ticketing_avtomaticheskoe_sohranenie_bronirovanii_i_povtornoe_ih_otkritie_pri_oformlenii_biletov), то сохранение и чтение бронирования после возврата билета не требуется, но может потребоваться игнорирование бронирования при помощи запроса к сервису [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction) (см. [Редактирование бронирований](edit-booking.md)).*
