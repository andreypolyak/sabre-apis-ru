---
title: Расчет стоимости возврата билетов
---

Подробнее об условиях выполнения возвратов билетов см. [Обмены и возвраты](exchanges-refunds.html#добровольный-возврат-билетов).

{{< hint warning >}}
Для расчета стоимости возврата билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)). Расчет стоимости возврата билетов всегда должен выполняться в том же PCC, где они были оформлены!
{{< /hint >}}

Для расчета стоимости возврата билета используется сервис [TKT_RefundRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/auto_price_air_refunds). Вызов сервиса для расчета стоимости возврата билета может использоваться также для проверки возможности автоматического возврата билета через API.

В запросе необходимо указать:
- ```/RefundRQ/POS/STL:Company``` — код системы бронирования. Всегда ```1S```
- ```/RefundRQ/POS/STL:Pseudo``` — PCC, в котором производится возврат билета
- ```/RefundRQ/TransactionInfo/@requestType``` — тип запроса. Всегда ```Price```
- ```/RefundRQ/TransactionInfo/TicketingDocument/Number``` — номер билета (13 цифр) 

{{< details title="Пример запроса" >}}
```XML
<RefundRQ version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0" xmlns:STL="http://services.sabre.com/STL/v01">
  <POS>
    <STL:Company>1S</STL:Company>
    <STL:Pseudo>2FRH</STL:Pseudo>
  </POS>
  <TransactionInfo requestType="Price">
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
  <Header messageID="TKTVLC650-11472-1994307352-1653388862543-154335-arex" version="1.1.0">
    <STL:OrchestrationID xmlns:STL="http://services.sabre.com/STL/v01">TKTVLC650-11472-1994307352-1653388862543-154335-arex</STL:OrchestrationID>
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
  <TransactionInfo fulfilled="false"/>
</RefundRS>
```
{{< /details >}}
