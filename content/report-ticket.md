---
title: Формирование отчетов
aliases:
    - /sales-report
    - /ticket-report
---

{{< toc >}}

## Отчет о продажах (TKT_TravelAgencyReportsRQ)

Для получения отчета о продажах используется сервис [TKT_TravelAgencyReportsRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/display_audit_trail).

В запросе необходимо указать:
- ```/DailySalesSummaryRQ/SelectionCriteria/PseudoCityCode``` — PCC, для которого будет сформирован отчет. Обратите внимание на то, что при формировании отчета для другого PCC будет произведена проверка наличия доступа (Branch Access, см. [Конфигурация Sabre](configuration.html)) между iPCC и указанным PCC
- ```/DailySalesSummaryRQ/SelectionCriteria/ReportDate``` — дата, за которую необходимо получить отчет о продажах
- ```/DailySalesSummaryRQ/SelectionCriteria/SettlementType``` — сток, для которого необходимо сформировать отчет. Возможные значения:
    - ```TKT``` — сток BSP
    - ```TAT``` — прямые стоки перевозчиков
    - ```TCH``` — сток ТКП
- ```/DailySalesSummaryRQ/SelectionCriteria/DocumentType``` — тип документов для построения отчета. Возможные значения:
    - ```TKT``` — билеты
    - ```RFND``` — возвраты билетов
    - ```EMD``` — EMD
    - ```RFEMD``` — возвраты EMD

Дополнительно в запросе можно указать:
- ```/DailySalesSummaryRQ/SelectionCriteria/Airline/AirlineCode``` — код авиакомпании из двух букв (например, ```SU``` для Аэрофлота)
- ```/DailySalesSummaryRQ/SelectionCriteria/Airline/AirlineNumber``` — код авиакомпании из трех цифр (например, ```555``` для Аэрофлота)
- ```/DailySalesSummaryRQ/SelectionCriteria/DocumentNumber``` — номер документа (билета или EMD, 13 цифр)

{{< details title="Пример запроса" >}}
```XML
<DailySalesSummaryRQ version="1.2.2" xmlns="http://www.sabre.com/ns/Ticketing/AsrServices/1.0">
  <Header/>
  <SelectionCriteria>
    <PseudoCityCode>2FRH</PseudoCityCode>
    <ReportDate>2017-12-22</ReportDate>
    <SettlementType>TKT</SettlementType>
    <DocumentType>TKT</DocumentType>
  </SelectionCriteria>
</DailySalesSummaryRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<asr:DailySalesSummaryRS isQueryStillRunning="false" version="1.2.2" xmlns:asr="http://www.sabre.com/ns/Ticketing/AsrServices/1.0">
  <asr:Header messageID="TKTVLC650-5532-657913467-1522749265847-199302-asrwsDqb">
    <ns2:OrchestrationID seq="0" xmlns="http://www.sabre.com/ns/Ticketing/AsrServices/1.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns3="http://services.sabre.com/STL/Catalog/v01">TKTVLC650-5532-657913467-1522749265847-199302-asrwsDqb</ns2:OrchestrationID>
    <ns2:Results xmlns="http://www.sabre.com/ns/Ticketing/AsrServices/1.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns3="http://services.sabre.com/STL/Catalog/v01">
      <ns2:Success>
        <ns2:System>T2-ASR</ns2:System>
      </ns2:Success>
    </ns2:Results>
  </asr:Header>
  <DSHeader xmlns="http://www.sabre.com/ns/Ticketing/AsrServices/1.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns3="http://services.sabre.com/STL/Catalog/v01">
    <PseudoCityCode>2FRH</PseudoCityCode>
    <AgencyName>SABRE RUSSIAN TRA</AgencyName>
  </DSHeader>
  <DailySalesReport xmlns="http://www.sabre.com/ns/Ticketing/AsrServices/1.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns3="http://services.sabre.com/STL/Catalog/v01">
    <ReportDate>2017-12-22</ReportDate>
    <Transaction electronicDocument="true" itineraryType="I" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>UJXGSX</PnrLocator>
      <PassengerName>IVANOVA/ELENA MS</PassengerName>
      <DocumentDetails>
        <DocumentNumber>6285764815690</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="628">B2</AirlineCode>
      <Commission>
        <Amount>156</Amount>
        <Percent>1.0</Percent>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>16544</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>16544</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T18:00:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="I" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>UJXGSX</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>6285764815689</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="628">B2</AirlineCode>
      <Commission>
        <Amount>156</Amount>
        <Percent>1.0</Percent>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>16544</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>16544</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T18:00:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="I" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>QQPYJP</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>6285764815688</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="628">B2</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>16544</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>16544</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:47:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="I" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AEBRGI</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>6075764815687</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="607">EY</AirlineCode>
      <Commission>
        <Amount>839</Amount>
        <Percent>1.0</Percent>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>91554</PaymentTotal>
          <PaymentDetail cardType="AX" category="Credit" fop="CC">
            <PaymentAmount>90554</PaymentAmount>
          </PaymentDetail>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>1000</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:42:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>QQMOVS</PnrLocator>
      <PassengerName>IVANOVA/ELENA MS</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815686</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Commission>
        <Amount>100</Amount>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>60026</PaymentTotal>
          <PaymentDetail cardType="AX" category="Credit" fop="CC">
            <PaymentAmount>60026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:32:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>QQMOVS</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815685</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Commission>
        <Amount>100</Amount>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>60026</PaymentTotal>
          <PaymentDetail cardType="AX" category="Credit" fop="CC">
            <PaymentAmount>60026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:32:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AEZFRB</PnrLocator>
      <PassengerName>IVANOVA/ELENA MS</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815684</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Commission>
        <Amount>566</Amount>
        <Percent>1.0</Percent>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>60026</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>60026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:31:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AEZFRB</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815683</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Commission>
        <Amount>566</Amount>
        <Percent>1.0</Percent>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>60026</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>60026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:31:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815682</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:07:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815681</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:06:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815680</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:06:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815679</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:03:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815678</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:03:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815677</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:02:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>AETOZV</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815676</DocumentNumber>
        <StockType>RU</StockType>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T16:01:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>PPLPXE</PnrLocator>
      <PassengerName>IVANOVA/ELENA MS</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815675</DocumentNumber>
        <StockType>RU</StockType>
        <DocumentStatusCode>V</DocumentStatusCode>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>58026</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>58026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T13:23:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>PPLPXE</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815674</DocumentNumber>
        <StockType>RU</StockType>
        <DocumentStatusCode>V</DocumentStatusCode>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>58026</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>58026</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T13:23:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="D" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>UFEPAZ</PnrLocator>
      <PassengerName>POLYAK/ANDREY MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>5555764815673</DocumentNumber>
        <StockType>RU</StockType>
        <DocumentStatusCode>V</DocumentStatusCode>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="555">SU</AirlineCode>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>23054</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>23054</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>HPA</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T12:40:00.000</TransactionDateTime>
    </Transaction>
    <Transaction electronicDocument="true" itineraryType="I" nonInteractive="false">
      <DocumentType>TKT</DocumentType>
      <SettlementType>TKT</SettlementType>
      <PnrLocator>UEHBVE</PnrLocator>
      <PassengerName>IVANOV/IVAN MR</PassengerName>
      <DocumentDetails>
        <DocumentNumber>6285764815672</DocumentNumber>
        <StockType>RU</StockType>
        <DocumentStatusCode>V</DocumentStatusCode>
        <TransactionCode>SALE</TransactionCode>
      </DocumentDetails>
      <AirlineCode AirlineNumber="628">B2</AirlineCode>
      <Commission>
        <Amount>100</Amount>
      </Commission>
      <Payments>
        <CurrencyCode decimalPlace="0">RUB</CurrencyCode>
        <DocumentPayment>
          <PaymentTotal>16544</PaymentTotal>
          <PaymentDetail category="Cash" fop="CA">
            <PaymentAmount>16544</PaymentAmount>
          </PaymentDetail>
        </DocumentPayment>
      </Payments>
      <AgentSine>AWS</AgentSine>
      <AgentPseudoCity>2FRH</AgentPseudoCity>
      <TransactionDateTime>2017-12-22T11:30:00.000</TransactionDateTime>
    </Transaction>
    <TotalDailySales>
      <TransactionType>SALE</TransactionType>
      <SalesBySettlement>
        <SettlementType>TKT</SettlementType>
        <SaleTotals>
          <CurrencyCode>RUB</CurrencyCode>
          <CashTotals count="13">332062</CashTotals>
          <CreditTotals count="3">210606</CreditTotals>
          <CommissionTotals count="7">2483</CommissionTotals>
        </SaleTotals>
      </SalesBySettlement>
    </TotalDailySales>
  </DailySalesReport>
</asr:DailySalesSummaryRS>
```
{{< /details >}}

## Отчет о неиспользованных билетах (UnusedeTicketReportLLSRQ)

{{< hint warning >}}
Для формирования отчетов о неиспользованных билетах в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для формирования отчетов о неиспользованных билетах используется сервис [UnusedeTicketReportLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/get_unused_etickets). Неиспользованным считается билет, у которого прошло 5 дней с момента вылета у последнего сегмента и в билете имеются купоны со статусом ```OPEN```.

{{< hint warning >}}
Обратите внимание на то, что для работы этого сервиса требуется включение настройки [Unused Electronic Ticket Report](tjr-settings.html#unused-electronic-ticket-report-формирование-отчета-о-неиспользованных-билетах).
{{< /hint >}}

В запросе дополнительно можно указать:
- ```/Unused_eTicketReportRQ/eTicketReport/@StartDate``` — дата добавления билета в отчет или дата начала временного промежутка (добавления билета в отчет)
- ```/Unused_eTicketReportRQ/eTicketReport/@EndDate``` — дата окончания временного промежутка (добавления билета в отчет)
- ```/Unused_eTicketReportRQ/eTicketReport/VendorPrefs/Airline``` — код перевозчика

{{< details title="Пример запроса" >}}
```XML
<UnusedeTicketReportRQ ReturnHostCommand="true" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <eTicketReport EndDate="03-31" StartDate="03-01">
    <VendorPrefs>
      <Airline Code="EY"/>
    </VendorPrefs>
  </eTicketReport>
</UnusedeTicketReportRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<UnusedeTicketReportRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-03T10:44:20-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="1F6146">DQB*ETU/31MAR-01MAR/AEY</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <SalesReport>
    <CreationDetails>
      <Source AgencyName="SABRE RUSSIAN TRA" CreateDateTime="04-03" PseudoCityCode="2FRH"/>
    </CreationDetails>
    <TicketingInfo>
      <Ticketing eTicketNumber="6079419630759">
        <TicketingDetails TicketPurgeDate="06-18" TransactionDate="03-25" UnableToVerify="false">
          <PersonName>
            <Surname>IVANOV/IVAN MR</Surname>
          </PersonName>
        </TicketingDetails>
      </Ticketing>
      <Ticketing eTicketNumber="6079419630760">
        <TicketingDetails TicketPurgeDate="06-18" TransactionDate="03-28" UnableToVerify="false">
          <PersonName>
            <Surname>IVANOVA/ELENA MS</Surname>
          </PersonName>
        </TicketingDetails>
      </Ticketing>
      <Ticketing eTicketNumber="6079419630761">
        <TicketingDetails TicketPurgeDate="6-18" TransactionDate="03-30" UnableToVerify="false">
          <PersonName>
            <Surname>IVANOVA/EKATERINA</Surname>
          </PersonName>
        </TicketingDetails>
      </Ticketing>
    </TicketingInfo>
  </SalesReport>
</UnusedeTicketReportRS>
```
{{< /details >}}
