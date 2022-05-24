---
title: Чтение масок билетов и EMD
aliases:
    - /read-ticket
---

{{< toc >}}

## Введение

В момент оформления билетов и EMD они сохраняются сразу в двух местах:
- в базе данных перевозчиков
- в базе данных Sabre

Любые инициированные агентством изменения билетов и EMD (например, [войдирование](void-ticket.html)) изменяют маски билетов и EMD в обоих базах данных. Однако, изменения, инициированные перевозчиком, будут сохранены только в базе данных перевозчика. Поэтому рекомендуется всегда читать маски билетов и EMD только из базы данных перевозчиков.

Маски билетов и EMD из баз данных перевозчиков могут быть доступны в течение нескольких дней или месяцев, в зависимости от настроек перевозчиков. Маски билетов и EMD в базе данных Sabre доступны в течение 13 месяцев со дня окончания поездки.

## Чтение масок билетов и EMD из баз данных перевозчиков (TKT_ElectronicDocumentServicesRQ)

{{< hint warning >}}
Для чтения масок билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для чтения масок билетов и EMD из баз данных перевозчиков используется сервис [TKT_ElectronicDocumentServicesRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/get_electronic_document).

В запросе необходимо указать:
- ```/GetElectronicDocumentRQ/STL:STL_Header.RQ``` — обязательный элемент
- ```/GetElectronicDocumentRQ/STL:POS``` — обязательный элемент
- ```/GetElectronicDocumentRQ/SearchParameters/DocumentNumber``` — номер билета или EMD (13 цифр)

{{< details title="Пример запроса" >}}
```XML
<GetElectronicDocumentRQ Version="2.0.0" xmlns="http://www.sabre.com/ns/Ticketing/EDoc" xmlns:STL="http://services.sabre.com/STL/v01">
  <STL:STL_Header.RQ/>
  <STL:POS/>
  <SearchParameters>
    <DocumentNumber>6079419628290</DocumentNumber>
  </SearchParameters>
</GetElectronicDocumentRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<GetElectronicDocumentRS Version="2.0.0" xmlns="http://www.sabre.com/ns/Ticketing/EDoc">
  <STL:STL_Header.RS timeStamp="2022-05-24T04:56:26" xmlns:STL="http://www.sabre.com/ns/Ticketing/EDocStl">
    <STL:OrchestrationID seq="0">TKTVLC650-11472-1994307352-1653386186346-153401-edoc:0</STL:OrchestrationID>
    <STL:Results>
      <STL:Success>
        <STL:System>TKT-DS</STL:System>
        <STL:Source>EDOC</STL:Source>
      </STL:Success>
    </STL:Results>
  </STL:STL_Header.RS>
  <Agent sine="AWT" type="GDS">
    <TicketingProvider>EY</TicketingProvider>
    <WorkLocation>2FRH</WorkLocation>
    <HomeLocation>MOW</HomeLocation>
    <IsoCountryCode>RU</IsoCountryCode>
    <IataNumber>96188116</IataNumber>
    <CRSCode>0011</CRSCode>
  </Agent>
  <TransactionInfo sequence="1">
    <LocalDateTime>2022-05-24T04:56:26.601-05:00</LocalDateTime>
    <SystemDateTime>2022-05-24T04:56:26.601-05:00</SystemDateTime>
    <SystemProvider>1S</SystemProvider>
  </TransactionInfo>
  <DocumentDetailsDisplay>
    <Ticket number="6079419628290" type="TKT">
      <Details>
        <Reservation>
          <Sabre>WGNSNT</Sabre>
        </Reservation>
        <LocalIssueDateTime>2022-05-24T00:00:00.000-00:00</LocalIssueDateTime>
        <FareCalculationPricing>0</FareCalculationPricing>
      </Details>
      <Customer>
        <Traveler>
          <Name>ELENA MS IVANOVA</Name>
          <FirstName>ELENA MS</FirstName>
          <LastName>IVANOVA</LastName>
          <ExternalNumber>P2234567890</ExternalNumber>
        </Traveler>
      </Customer>
      <ServiceCoupon coupon="1">
        <MarketingProvider>EY</MarketingProvider>
        <MarketingFlightNumber>2463</MarketingFlightNumber>
        <OperatingProvider>EY</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YLWF2AU</FareBasis>
        <StartLocation>SYD</StartLocation>
        <StartDate>2022-12-01</StartDate>
        <StartTime>23:25:00</StartTime>
        <EndLocation>AUH</EndLocation>
        <NotValidBeforeDate>2022-12-01</NotValidBeforeDate>
        <NotValidAfterDate>2022-12-01</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <BagAllowance amount="35" code="K"/>
        <CurrentStatusCodeSetValue>I</CurrentStatusCodeSetValue>
      </ServiceCoupon>
      <ServiceCoupon coupon="2">
        <MarketingProvider>EY</MarketingProvider>
        <MarketingFlightNumber>25</MarketingFlightNumber>
        <OperatingProvider>EY</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YLWF2AU</FareBasis>
        <StartLocation>AUH</StartLocation>
        <StartDate>2022-12-02</StartDate>
        <StartTime>10:35:00</StartTime>
        <EndLocation>LHR</EndLocation>
        <NotValidBeforeDate>2022-12-02</NotValidBeforeDate>
        <NotValidAfterDate>2022-12-02</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <StopOver>X</StopOver>
        <BagAllowance amount="35" code="K"/>
        <CurrentStatusCodeSetValue>I</CurrentStatusCodeSetValue>
      </ServiceCoupon>
      <ServiceCoupon coupon="3">
        <MarketingProvider>EY</MarketingProvider>
        <MarketingFlightNumber>12</MarketingFlightNumber>
        <OperatingProvider>EY</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YLXF2AU</FareBasis>
        <StartLocation>LHR</StartLocation>
        <StartDate>2022-12-08</StartDate>
        <StartTime>08:30:00</StartTime>
        <EndLocation>AUH</EndLocation>
        <NotValidBeforeDate>2022-12-08</NotValidBeforeDate>
        <NotValidAfterDate>2022-12-08</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <StopOver>O</StopOver>
        <BagAllowance amount="35" code="K"/>
        <CurrentStatusCodeSetValue>I</CurrentStatusCodeSetValue>
      </ServiceCoupon>
      <ServiceCoupon coupon="4">
        <MarketingProvider>EY</MarketingProvider>
        <MarketingFlightNumber>464</MarketingFlightNumber>
        <OperatingProvider>EY</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YLXF2AU</FareBasis>
        <StartLocation>AUH</StartLocation>
        <StartDate>2022-12-08</StartDate>
        <StartTime>22:10:00</StartTime>
        <EndLocation>SYD</EndLocation>
        <NotValidBeforeDate>2022-12-08</NotValidBeforeDate>
        <NotValidAfterDate>2022-12-08</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <StopOver>X</StopOver>
        <BagAllowance amount="35" code="K"/>
        <CurrentStatusCodeSetValue>I</CurrentStatusCodeSetValue>
      </ServiceCoupon>
      <Amounts>
        <New>
          <Base>
            <Amount currencyCode="AUD" decimalPlace="2">4099.00</Amount>
            <Text>4099.00</Text>
          </Base>
          <Equivalent>
            <Amount currencyCode="RUB" decimalPlace="0">170110</Amount>
            <Text>170110</Text>
          </Equivalent>
          <Total>
            <Amount currencyCode="RUB" decimalPlace="0">186823</Amount>
            <Text>186823</Text>
          </Total>
        </New>
        <Other>
          <Commission>
            <Amount currencyCode="RUB" decimalPlace="0">1701</Amount>
            <PercentageRate>1.00</PercentageRate>
            <Text>00100</Text>
          </Commission>
        </Other>
      </Amounts>
      <Taxes>
        <New>
          <Tax code="AU">
            <Amount currencyCode="RUB" decimalPlace="0">2490</Amount>
          </Tax>
          <Tax code="WY">
            <Amount currencyCode="RUB" decimalPlace="0">2598</Amount>
          </Tax>
          <Tax code="ZR">
            <Amount currencyCode="RUB" decimalPlace="0">158</Amount>
          </Tax>
          <Tax code="F6">
            <Amount currencyCode="RUB" decimalPlace="0">1102</Amount>
          </Tax>
          <Tax code="GB">
            <Amount currencyCode="RUB" decimalPlace="0">6216</Amount>
          </Tax>
          <Tax code="UB">
            <Amount currencyCode="RUB" decimalPlace="0">4149</Amount>
          </Tax>
        </New>
      </Taxes>
      <Payment sequence="1" type="CA">
        <Other>
          <Details>Intentionally left empty</Details>
        </Other>
      </Payment>
      <Remark>
        <Endorsements sequence="0">BSR41.5//NON ENDO/ REF</Endorsements>
      </Remark>
      <FareCalculation>
        <New>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</New>
      </FareCalculation>
    </Ticket>
  </DocumentDetailsDisplay>
</GetElectronicDocumentRS>
```
{{< /details >}}

## Чтение масок билетов и EMD из базы данных Sabre (TicketingDocumentServicesRQ)

{{< hint danger >}}
Обратитесь к вашему куратору в Sabre перед началом использования этого сервиса!
{{< /hint >}}

{{< hint warning >}}
Для чтения масок билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для чтения масок билетов и EMD из базы данных Sabre используется сервис [TicketingDocumentServicesRQ](https://developer.sabre.com/docs/sabre_sonic_apis/soap/ticketing/get_ticket_doc_details).

В запросе необходимо указать:
- ```/GetTicketingDocumentRQ/STL:STL_Header.RQ``` — обязательный элемент
- ```/GetTicketingDocumentRQ/STL:POS``` — обязательный элемент
- ```/GetTicketingDocumentRQ/SearchParameters/@resultType``` — всегда значение ```P```
- ```/GetTicketingDocumentRQ/SearchParameters/TicketingProvider``` — всегда значение ```1S```
- ```/GetTicketingDocumentRQ/SearchParameters/DocumentNumber``` — номер билета или EMD (13 цифр)

В запросе к сервису в элементе ```/GetElectronicDocumentRQ/SearchParameters/DocumentNumber``` требуется указать номер билета или EMD (13 цифр).

{{< details title="Пример запроса" >}}
```XML
<GetTicketingDocumentRQ Version="3.28.3" xmlns="http://www.sabre.com/ns/Ticketing/DC" xmlns:STL="http://services.sabre.com/STL/v01">
  <STL:STL_Header.RQ/>
  <STL:POS/>
  <SearchParameters resultType="P">
    <TicketingProvider>1S</TicketingProvider>
    <DocumentNumber>6079419628290</DocumentNumber>
  </SearchParameters>
</GetTicketingDocumentRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<TT:GetTicketingDocumentRS Version="3.28.3" xmlns="http://services.sabre.com/STL/v01" xmlns:STL="http://services.sabre.com/STL/v01" xmlns:TT="http://www.sabre.com/ns/Ticketing/DC" xmlns:str="http://sabre.com/ticketing/xslt/strings" xmlns:utils="java:com.sabre.ticketing.tktdoc.utils.XsltUtils" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <STL:STL_Header.RS messageID="TKTVLC650-19251-1933107598-1653386232607-2987050-tktdoc" timeStamp="2022-05-24T04:57:12">
    <OrchestrationID seq="1">TKTVLC650-19251-1933107598-1653386232607-2987050-tktdoc</OrchestrationID>
    <DiagnosticData xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Found</DiagnosticData>
    <STL:Results>
      <Success xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">
        <System>T2</System>
        <Source>DocumentServices</Source>
      </Success>
    </STL:Results>
  </STL:STL_Header.RS>
  <TT:PassengerItineraryReceipt>
    <TT:Agent duty="*" sine="AWT">
      <ns2:TicketingProvider checkDigit="6" name="SABRE                   " number="153" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1S</ns2:TicketingProvider>
      <ns2:IataNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">96188116</ns2:IataNumber>
      <ns2:WorkLocation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2FRH</ns2:WorkLocation>
      <ns2:IsoCountryCode xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">RU</ns2:IsoCountryCode>
      <TT:CompanyName>SABRE RUSSIAN TRA</TT:CompanyName>
    </TT:Agent>
    <TT:Ticket accountingCode="607" number="6079419628290" numberOfServiceCoupons="4" type="TKT">
      <TT:Details>
        <TT:Reservation>
          <ns2:Sabre createDate="2022-05-24T00:00:00" provider="AA" purgeDate="2022-12-08T00:00:00" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">WGNSNT</ns2:Sabre>
        </TT:Reservation>
        <ns2:LocalIssueDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-05-24T12:49:00</ns2:LocalIssueDateTime>
        <TT:ValidatingProvider name="ETIHAD AIRWAYS">EY</TT:ValidatingProvider>
        <TT:MandateInfo type="Disclaimer">
          <TT:Text language="EN">NOTICE
CARRIAGE AND OTHER SERVICES PROVIDED BY THE CARRIER ARE SUBJECT TO CONDITIONS OF CARRIAGE, WHICH ARE HEREBY INCORPORATED BY REFERENCE.  THESE CONDITIONS MAY BE OBTAINED FROM THE ISSUING CARRIER. PASSENGERS ON A JOURNEY INVOLVING AN ULTIMATE DESTINATION OR A STOP IN A COUNTRY OTHER THAN THE COUNTRY OF DEPARTURE ARE ADVISED THAT INTERNATIONAL TREATIES KNOWN AS THE MONTREAL CONVENTION, OR ITS PREDECESSOR, THE WARSAW CONVENTION, INCLUDING ITS AMENDMENTS /THE WARSAW CONVENTION SYSTEM/MAY APPLY TO THE ENTIRE JOURNEY, INCLUDING ANY PORTION THEREOF WITHIN A COUNTRY. FOR SUCH PASSENGERS, THE APPLICABLE TREATY, INCLUDING SPECIAL CONTRACTS OF CARRIAGE EMBODIED IN ANY APPLICABLE TARIFFS, GOVERNS AND MAY LIMIT THE LIABILITY OF THE CARRIER. CHECK WITH YOUR CARRIER FOR MORE INFORMATION.</TT:Text>
        </TT:MandateInfo>
        <TT:MandateInfo type="HazardousMaterials">
          <TT:Text language="EN">THE CARRIAGE OF CERTAIN HAZARDOUS MATERIALS, LIKE AEROSOLS, FIREWORKS, AND FLAMMABLE LIQUIDS, ABOARD THE AIRCRAFT IS FORBIDDEN. IF YOU DO NOT UNDERSTAND THESE RESTRICTIONS, FURTHER INFORMATION MAY BE OBTAINED FROM YOUR AIRLINE.</TT:Text>
        </TT:MandateInfo>
        <TT:MandateInfo type="DataProtectionNotice">
          <TT:Text language="EN">DATA PROTECTION NOTICE: YOUR PERSONAL DATA WILL BE PROCESSED IN ACCORDANCE WITH THE APPLICABLE CARRIER'S PRIVACY POLICY AND, IF YOUR BOOKING IS MADE VIA A RESERVATION SYSTEM PROVIDER (&quot;GDS&quot;), WITH ITS PRIVACY POLICY. THESE ARE AVAILABLE AT HTTP://WWW.IATATRAVELCENTER.COM/PRIVACY OR FROM THE CARRIER OR GDS DIRECTLY. YOU SHOULD READ THIS DOCUMENTATION, WHICH APPLIES TO YOUR BOOKING AND SPECIFIES, FOR EXAMPLE, HOW YOUR PERSONAL DATA IS COLLECTED, STORED, USED, DISCLOSED AND TRANSFERRED.</TT:Text>
        </TT:MandateInfo>
        <ns2:ItineraryType xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">I</ns2:ItineraryType>
      </TT:Details>
      <TT:Customer>
        <TT:Traveler nameId="2" nameNumber="2.1">
          <ns2:Name xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">IVANOVA/ELENA MS</ns2:Name>
          <ns2:FirstName xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">ELENA MS</ns2:FirstName>
          <ns2:LastName xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">IVANOVA</ns2:LastName>
          <ns2:ExternalNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">P2234567890</ns2:ExternalNumber>
          <TT:PassengerType>ADT</TT:PassengerType>
        </TT:Traveler>
      </TT:Customer>
      <TT:ServiceCoupon coupon="1">
        <TT:MarketingProvider name="ETIHAD AIRWAYS">EY</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2463</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="ETIHAD AIRWAYS">EY</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2463</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <ns2:Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YLWF2AU</ns2:FareBasis>
        <ns2:StartLocation name="SYDNEY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">SYD</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-01T23:25:00</ns2:StartDateTime>
        <ns2:EndLocation name="ABU DHABI INTL" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AUH</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-02T06:40:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-01</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-01</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">QMALYP</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">35K</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:ServiceCoupon coupon="2">
        <TT:MarketingProvider name="ETIHAD AIRWAYS">EY</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">25</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="ETIHAD AIRWAYS">EY</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">25</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <ns2:Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YLWF2AU</ns2:FareBasis>
        <ns2:StartLocation name="ABU DHABI INTL" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AUH</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-02T10:35:00</ns2:StartDateTime>
        <ns2:EndLocation name="LONDON HEATHROW" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">LHR</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-02T14:10:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-02</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-02</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">QMALYP</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">35K</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:ServiceCoupon coupon="3">
        <TT:MarketingProvider name="ETIHAD AIRWAYS">EY</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">12</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="ETIHAD AIRWAYS">EY</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">12</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <ns2:Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YLXF2AU</ns2:FareBasis>
        <ns2:StartLocation name="LONDON HEATHROW" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">LHR</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08T08:30:00</ns2:StartDateTime>
        <ns2:EndLocation name="ABU DHABI INTL" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AUH</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08T19:20:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">QMALYP</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">35K</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:ServiceCoupon coupon="4">
        <TT:MarketingProvider name="ETIHAD AIRWAYS">EY</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">464</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="ETIHAD AIRWAYS">EY</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">464</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <ns2:Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YLXF2AU</ns2:FareBasis>
        <ns2:StartLocation name="ABU DHABI INTL" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AUH</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08T22:10:00</ns2:StartDateTime>
        <ns2:EndLocation name="SYDNEY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">SYD</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-09T17:55:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2022-12-08</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">QMALYP</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">35K</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:Amounts>
        <TT:New>
          <TT:Base>
            <ns2:Amount currencyCode="AUD" decimalPlace="2" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4099.00</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4099.00</ns2:Text>
          </TT:Base>
          <TT:TotalTax>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">16713</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">16713</ns2:Text>
          </TT:TotalTax>
          <TT:Equivalent>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">170110</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">170110</ns2:Text>
          </TT:Equivalent>
          <TT:Total>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">186823</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">186823</ns2:Text>
          </TT:Total>
        </TT:New>
      </TT:Amounts>
      <TT:Taxes>
        <TT:New>
          <TT:Tax code="AU" exempt="false" name="PASSENGER MOVEMENT CHARGE  PMC" sequence="1" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2490</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2490</ns2:Text>
          </TT:Tax>
          <TT:Tax code="WY" exempt="false" name="PASSENGER SERVICES CHARGE DEPARTURE INTERNATIONAL" sequence="2" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2598</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2598</ns2:Text>
          </TT:Tax>
          <TT:Tax code="ZR" exempt="false" name="INTERNATIONAL ADVANCED PASSENGER INFORMATION FEE" sequence="3" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">158</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">158</ns2:Text>
          </TT:Tax>
          <TT:Tax code="F6" exempt="false" name="PASSENGER FACILITIES CHARGE" sequence="4" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1102</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1102</ns2:Text>
          </TT:Tax>
          <TT:Tax code="GB" exempt="false" name="AIR PASSENGER DUTY APD" sequence="5" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">6216</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">6216</ns2:Text>
          </TT:Tax>
          <TT:Tax code="UB" exempt="false" name="PASSENGER SERVICE CHARGE DEPARTURES" sequence="6" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4149</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4149</ns2:Text>
          </TT:Tax>
        </TT:New>
      </TT:Taxes>
      <TT:Remark>
        <TT:Endorsements sequence="1">BSR41.5/NON ENDO/ REF</TT:Endorsements>
      </TT:Remark>
      <TT:FareCalculation>
        <TT:New>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</TT:New>
      </TT:FareCalculation>
      <TT:AffiliatedAgent>
        <ns2:Booking duty="*" sine="AWT" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">
          <ns2:WorkLocation>2FRH</ns2:WorkLocation>
          <ns2:IataNumber>96188116</ns2:IataNumber>
          <ns2:HomeLocation>2FRH</ns2:HomeLocation>
        </ns2:Booking>
      </TT:AffiliatedAgent>
      <TT:Payment sequence="1" type="CA">
        <ns2:Total xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">
          <ns2:Amount currencyCode="RUB" decimalPlace="0">186823</ns2:Amount>
          <ns2:ApplyCreditInd>false</ns2:ApplyCreditInd>
        </ns2:Total>
        <ns2:Remarks xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">CA</ns2:Remarks>
        <ns2:Cash CashIndicator="true" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC"/>
      </TT:Payment>
    </TT:Ticket>
  </TT:PassengerItineraryReceipt>
</TT:GetTicketingDocumentRS>
```
{{< /details >}}
