# Расчет стоимости возврата билетов

Подробнее об условиях выполнения возвратов билетов см. в [Обмены и возвраты](exchanges-refunds.md#dobrovolnii_vozvrat_biletov).

*Для расчета стоимости возврата билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

**Расчет стоимости возврата билетов всегда должен выполняться в том же PCC, где они были оформлены!**

Для расчета стоимости возврата билета используется сервис [TKT_RefundRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/auto_price_air_refunds). Обратите внимание на то, что расчет стоимости возврата билета является **бесплатной операцией**. Вызов сервиса для расчета стоимости возврата билета может использоваться также для проверки возможности автоматического возврата билета через API.

В запросе необходимо указать:
- ```/RefundRQ/POS/STL:Company``` — код системы бронирования. Всегда ```1S```
- ```/RefundRQ/POS/STL:Pseudo``` — PCC, в котором производится возврат билета
- ```/RefundRQ/TransactionInfo/@requestType``` — тип запроса. Всегда ```Price```
- ```/RefundRQ/TransactionInfo/TicketingDocument/Number``` — номер билета (13 цифр) 

{% xmlsec "Пример запроса" %}
<RefundRQ version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0" xmlns:STL="http://services.sabre.com/STL/v01">
  <POS>
    <STL:Company>1S</STL:Company>
    <STL:Pseudo>2FRH</STL:Pseudo>
  </POS>
  <TransactionInfo requestType="Price">
    <TicketingDocument>
      <Number>6285588040252</Number>
    </TicketingDocument>
  </TransactionInfo>
</RefundRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<RefundRS version="1.1.0" xmlns="http://www.sabre.com/ns/Ticketing/ExchangeRefund/1.0">
  <Header messageID="TKTVLC750-6345-641438784-1580478607884-22212-arex" version="1.1.0">
    <STL:OrchestrationID xmlns:STL="http://services.sabre.com/STL/v01">TKTVLC750-6345-641438784-1580478607884-22212-arex</STL:OrchestrationID>
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
  <TransactionInfo fulfilled="false"/>
</RefundRS>
{% endxmlsec %}
