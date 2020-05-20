# Чтение масок билетов и EMD

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

В момент оформления билетов и EMD они сохраняются сразу в двух местах:
- в базе данных перевозчиков
- в базе данных Sabre

Любые инициированные агентством изменения билетов и EMD (например, [войдирование](void-ticket.md)) изменяют маски билетов и EMD в обоих базах данных. Однако, изменения, инициированные перевозчиком, будут сохранены только в базе данных перевозчика. Поэтому рекомендуется всегда читать маски билетов и EMD только из базы данных перевозчиков.

Маски билетов и EMD из баз данных перевозчиков могут быть доступны в течение нескольких дней или месяцев, в зависимости от настроек перевозчиков. Маски билетов и EMD в базе данных Sabre доступны в течение 13 месяцев со дня окончания поездки.

## Чтение масок билетов и EMD из баз данных перевозчиков (TKT_ElectronicDocumentServicesRQ)

*Для чтения масок билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для чтения масок билетов и EMD из баз данных перевозчиков используется сервис [TKT_ElectronicDocumentServicesRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/get_electronic_document).

В запросе необходимо указать:
- ```/GetElectronicDocumentRQ/STL:STL_Header.RQ``` — обязательный элемент
- ```/GetElectronicDocumentRQ/STL:POS``` — обязательный элемент
- ```/GetElectronicDocumentRQ/SearchParameters/DocumentNumber``` — номер билета или EMD (13 цифр)

{% xmlsec "Пример запроса", false %}
<GetElectronicDocumentRQ Version="1.0.0" xmlns="http://www.sabre.com/ns/Ticketing/EDoc" xmlns:STL="http://services.sabre.com/STL/v01">
  <STL:STL_Header.RQ/>
  <STL:POS/>
  <SearchParameters>
    <DocumentNumber>5555588040220</DocumentNumber>
  </SearchParameters>
</GetElectronicDocumentRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GetElectronicDocumentRS Version="1.0.0" xmlns="http://www.sabre.com/ns/Ticketing/EDoc">
  <STL:STL_Header.RS timeStamp="2020-01-27T07:50:42" xmlns:STL="http://www.sabre.com/ns/Ticketing/EDocStl">
    <STL:OrchestrationID seq="0">TKTVLC750-6345-641438784-1580133042408-9576-edoc:0</STL:OrchestrationID>
    <STL:Results>
      <STL:Success>
        <STL:System>TKT-DS</STL:System>
        <STL:Source>EDOC</STL:Source>
      </STL:Success>
    </STL:Results>
  </STL:STL_Header.RS>
  <Agent sine="AWT" type="GDS">
    <TicketingProvider>SU</TicketingProvider>
    <WorkLocation>2FRH</WorkLocation>
    <HomeLocation>MOW</HomeLocation>
    <IsoCountryCode>RU</IsoCountryCode>
    <IataNumber>99999992</IataNumber>
    <CRSCode>0011</CRSCode>
  </Agent>
  <TransactionInfo sequence="1">
    <LocalDateTime>2020-01-27T07:50:42.495-06:00</LocalDateTime>
    <SystemDateTime>2020-01-27T07:50:42.495-06:00</SystemDateTime>
    <SystemProvider>1S</SystemProvider>
  </TransactionInfo>
  <DocumentDetailsDisplay>
    <Ticket number="5555588040220" type="TKT">
      <Details>
        <Reservation>
          <Sabre>ZBOHCX</Sabre>
        </Reservation>
        <LocalIssueDateTime>2020-01-27T00:00:00.000-00:00</LocalIssueDateTime>
        <FareCalculationPricing>0</FareCalculationPricing>
      </Details>
      <Customer>
        <Traveler>
          <Name>IVAN MR IVANOV</Name>
          <FirstName>IVAN MR</FirstName>
          <LastName>IVANOV</LastName>
        </Traveler>
      </Customer>
      <ServiceCoupon coupon="1">
        <MarketingProvider>SU</MarketingProvider>
        <MarketingFlightNumber>1138</MarketingFlightNumber>
        <OperatingProvider>SU</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YCLR</FareBasis>
        <StartLocation>SVO</StartLocation>
        <StartDateTime>2020-09-01T07:45:00</StartDateTime>
        <EndLocation>AER</EndLocation>
        <NotValidBeforeDate>2020-09-01</NotValidBeforeDate>
        <NotValidAfterDate>2020-09-01</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <BagAllowance amount="1" code="PC"/>
      </ServiceCoupon>
      <ServiceCoupon coupon="2">
        <MarketingProvider>SU</MarketingProvider>
        <MarketingFlightNumber>1129</MarketingFlightNumber>
        <OperatingProvider>SU</OperatingProvider>
        <ClassOfService name="Y">Y</ClassOfService>
        <FareBasis>YCLR</FareBasis>
        <StartLocation>AER</StartLocation>
        <StartDateTime>2020-09-08T02:45:00</StartDateTime>
        <EndLocation>SVO</EndLocation>
        <NotValidBeforeDate>2020-09-08</NotValidBeforeDate>
        <NotValidAfterDate>2020-09-08</NotValidAfterDate>
        <BookingStatus>OK</BookingStatus>
        <CurrentStatus>OPEN</CurrentStatus>
        <BagAllowance amount="1" code="PC"/>
      </ServiceCoupon>
      <Amounts>
        <New>
          <Base>
            <Amount currencyCode="RUB" decimalPlace="0">58000</Amount>
            <Text>58000</Text>
          </Base>
          <Total>
            <Amount currencyCode="RUB" decimalPlace="0">64008</Amount>
            <Text>64008</Text>
          </Total>
        </New>
        <Other>
          <Commission>
            <Amount currencyCode="RUB" decimalPlace="0">580</Amount>
            <PercentageRate>1.00</PercentageRate>
            <Text>00100</Text>
          </Commission>
        </Other>
      </Amounts>
      <Taxes>
        <New>
          <Tax code="YQ">
            <Amount currencyCode="RUB" decimalPlace="0">5400</Amount>
          </Tax>
          <Tax code="RI">
            <Amount currencyCode="RUB" decimalPlace="0">608</Amount>
          </Tax>
        </New>
      </Taxes>
      <Payment sequence="1" type="CA">
        <Other>
          <Details>Intentionally left empty</Details>
        </Other>
      </Payment>
      <Remark>
        <Endorsements sequence="0">P1234567890</Endorsements>
      </Remark>
      <FareCalculation>
        <New>MOW SU AER29000SU MOW29000RUB58000END</New>
      </FareCalculation>
    </Ticket>
  </DocumentDetailsDisplay>
</GetElectronicDocumentRS>
{% endxmlsec %}

## Чтение масок билетов и EMD из базы данных Sabre (TicketingDocumentServicesRQ)

***Пожалуйста, обратитесь к вашему куратору в Sabre перед началом использования этого сервиса!***

*Для чтения масок билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для чтения масок билетов и EMD из базы данных Sabre используется сервис [TicketingDocumentServicesRQ](https://developer.sabre.com/docs/sabre_sonic_apis/soap/ticketing/get_ticket_doc_details).

В запросе необходимо указать:
- ```/GetTicketingDocumentRQ/STL:STL_Header.RQ``` — обязательный элемент
- ```/GetTicketingDocumentRQ/STL:POS``` — обязательный элемент
- ```/GetTicketingDocumentRQ/SearchParameters/@resultType``` — всегда значение ```P```
- ```/GetTicketingDocumentRQ/SearchParameters/TicketingProvider``` — всегда значение ```1S```
- ```/GetTicketingDocumentRQ/SearchParameters/DocumentNumber``` — номер билета или EMD (13 цифр)

В запросе к сервису в элементе ```/GetElectronicDocumentRQ/SearchParameters/DocumentNumber``` требуется указать номер билета или EMD (13 цифр).

{% xmlsec "Пример запроса", false %}
<GetTicketingDocumentRQ Version="3.26.0" xmlns="http://www.sabre.com/ns/Ticketing/DC" xmlns:STL="http://services.sabre.com/STL/v01">
  <STL:STL_Header.RQ/>
  <STL:POS/>
  <SearchParameters resultType="P">
    <TicketingProvider>1S</TicketingProvider>
    <DocumentNumber>5553741252163</DocumentNumber>
  </SearchParameters>
</GetTicketingDocumentRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<TT:GetTicketingDocumentRS Version="3.26.0" xmlns="http://services.sabre.com/STL/v01" xmlns:STL="http://services.sabre.com/STL/v01" xmlns:TT="http://www.sabre.com/ns/Ticketing/DC" xmlns:str="http://sabre.com/ticketing/xslt/strings" xmlns:utils="java:com.sabre.ticketing.tktdoc.utils.XsltUtils" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <STL:STL_Header.RS messageID="TKTVLC650-22982-920648624-1588746464753-1183172-tktdoc" timeStamp="2020-05-06T01:27:44">
    <OrchestrationID seq="1">TKTVLC650-22982-920648624-1588746464753-1183172-tktdoc</OrchestrationID>
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
      <ns2:IataNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">99999992</ns2:IataNumber>
      <ns2:WorkLocation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2FRH</ns2:WorkLocation>
      <ns2:IsoCountryCode xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">RU</ns2:IsoCountryCode>
      <TT:CompanyName>SABRE RUSSIAN TRA</TT:CompanyName>
    </TT:Agent>
    <TT:Ticket accountingCode="555" number="5553741252163" numberOfServiceCoupons="2" type="TKT">
      <TT:Details>
        <TT:Reservation>
          <ns2:Sabre createDate="2020-05-06T00:00:00" provider="AA" purgeDate="2020-09-08T00:00:00" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YFJZIA</ns2:Sabre>
        </TT:Reservation>
        <ns2:LocalIssueDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-05-06T09:27:00</ns2:LocalIssueDateTime>
        <TT:ValidatingProvider name="AEROFLOT RUSSIAN AIRLINE">SU</TT:ValidatingProvider>
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
        <ns2:ItineraryType xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">D</ns2:ItineraryType>
      </TT:Details>
      <TT:Customer>
        <TT:Traveler nameId="1" nameNumber="1.1">
          <ns2:Name xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">IVANOV/IVAN MR</ns2:Name>
          <ns2:FirstName xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">IVAN MR</ns2:FirstName>
          <ns2:LastName xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">IVANOV</ns2:LastName>
          <TT:PassengerType>ADT</TT:PassengerType>
        </TT:Traveler>
      </TT:Customer>
      <TT:ServiceCoupon coupon="1">
        <TT:MarketingProvider name="AEROFLOT RUSSIAN AIRLINE">SU</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1138</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="AEROFLOT RUSSIAN AIRLINES">SU</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1138</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns="http://www.sabre.com/ns/Ticketing/DC" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YCLR</ns2:FareBasis>
        <ns2:StartLocation name="MOSCOW SHEREMET" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">SVO</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-01T07:45:00</ns2:StartDateTime>
        <ns2:EndLocation name="SOCHI" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AER</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-01T10:15:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-01</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-01</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YFJARB</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1PC</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:ServiceCoupon coupon="2">
        <TT:MarketingProvider name="AEROFLOT RUSSIAN AIRLINE">SU</TT:MarketingProvider>
        <ns2:MarketingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1129</ns2:MarketingFlightNumber>
        <TT:OperatingProvider name="AEROFLOT RUSSIAN AIRLINES">SU</TT:OperatingProvider>
        <ns2:OperatingFlightNumber xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1129</ns2:OperatingFlightNumber>
        <ns2:ClassOfService name="ECONOMY" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</ns2:ClassOfService>
        <Cabin name="ECONOMY" sabreCode="Y" shortName="ECONOMY" xmlns="http://www.sabre.com/ns/Ticketing/DC" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">Y</Cabin>
        <ns2:FareBasis xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YCLR</ns2:FareBasis>
        <ns2:StartLocation name="SOCHI" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">AER</ns2:StartLocation>
        <ns2:StartDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-08T02:45:00</ns2:StartDateTime>
        <ns2:EndLocation name="MOSCOW SHEREMET" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">SVO</ns2:EndLocation>
        <ns2:EndDateTime xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-08T05:20:00</ns2:EndDateTime>
        <ns2:NotValidBeforeDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-08</ns2:NotValidBeforeDate>
        <ns2:NotValidAfterDate xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">2020-09-08</ns2:NotValidAfterDate>
        <ns2:BookingStatus name="CONFIRMED" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:BookingStatus>
        <ns2:CurrentStatus xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">OK</ns2:CurrentStatus>
        <ns2:Reservation xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">YFJARB</ns2:Reservation>
        <ns2:BagAllowance xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">1PC</ns2:BagAllowance>
      </TT:ServiceCoupon>
      <TT:Amounts>
        <TT:New>
          <TT:Base>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">60000</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">60000</ns2:Text>
          </TT:Base>
          <TT:TotalTax>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4148</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">4148</ns2:Text>
          </TT:TotalTax>
          <TT:Total>
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">64148</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">64148</ns2:Text>
          </TT:Total>
        </TT:New>
      </TT:Amounts>
      <TT:Taxes>
        <TT:New>
          <TT:Tax code="YQ" exempt="false" sequence="1" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">3000</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">3000</ns2:Text>
          </TT:Tax>
          <TT:Tax code="YR" exempt="false" sequence="2" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">540</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">540</ns2:Text>
          </TT:Tax>
          <TT:Tax code="RI" exempt="false" name="TERMINAL USE CHARGE INTERNATIONAL DEPARTURE" sequence="3" status="N">
            <ns2:Amount currencyCode="RUB" decimalPlace="0" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">608</ns2:Amount>
            <ns2:Text xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">608</ns2:Text>
          </TT:Tax>
        </TT:New>
      </TT:Taxes>
      <TT:Remark>
        <TT:Endorsements sequence="1">P1234567890</TT:Endorsements>
      </TT:Remark>
      <TT:FareCalculation>
        <TT:New>MOW SU AER30000SU MOW30000RUB60000END</TT:New>
      </TT:FareCalculation>
      <TT:AffiliatedAgent>
        <ns2:Booking duty="*" sine="AWT" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">
          <ns2:WorkLocation>2FRH</ns2:WorkLocation>
          <ns2:IataNumber>99999992</ns2:IataNumber>
          <ns2:HomeLocation>2FRH</ns2:HomeLocation>
        </ns2:Booking>
      </TT:AffiliatedAgent>
      <TT:Payment sequence="1" type="CA">
        <ns2:Total xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">
          <ns2:Amount currencyCode="RUB" decimalPlace="0">64148</ns2:Amount>
          <ns2:ApplyCreditInd>false</ns2:ApplyCreditInd>
        </ns2:Total>
        <ns2:Remarks xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC">CA</ns2:Remarks>
        <ns2:Cash CashIndicator="true" xmlns:ns2="http://www.sabre.com/ns/Ticketing/DC"/>
      </TT:Payment>
    </TT:Ticket>
  </TT:PassengerItineraryReceipt>
</TT:GetTicketingDocumentRS>
{% endxmlsec %}
