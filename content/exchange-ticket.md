---
title: Обмен билетов
---

{{< toc >}}

## Введение

Подробнее об условиях выполнения обменов билетов см. [Обмены и возвраты](exchanges-refunds.html#добровольный-обмен-билетов).

## Алгоритм обмена билетов

![](/sabre-apis-ru/assets/svg/exchange-ticket/exchange-ticket.svg)

## Подготовка и расчет стоимости обмена (ExchangeBookingRQ)

{{< hint danger >}}
Обмен билетов всегда должен выполняться в том же PCC, где они были оформлены!
{{< /hint >}}

Для подготовки бронирования и расчета стоимости обмена используется сервис [ExchangeBookingRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/exchange_booking). Сервис автоматизирует многие процессы, связанные с подготовкой к обмену билетов:
- переход в другой PCC
- чтение бронирование
- удаление старых и бронирование новых сегментов
- расчет стоимости обмена и сохранение PQR (Price Quote Reissue)
- сохранение бронирования

### Переход в другой PCC

Для обмена билетов в других PCC (т.е. не в iPCC, в котором была создана сессия или токен) необходимо указать его в качестве значения атрибута ```/ExchangeBookingRQ/@targetCity```.

{{< hint warning >}}
Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).
{{< /hint >}}

### Чтение бронирования

Код бронирования (PNR Record Locator), в котором необходимо произвести обмен билетов, указывается в качестве значения атрибута ```/ExchangeBookingRQ/Itinerary/@id```.

### Выбор сегментов

Номера сегментов, которые не будут изменены, передаются в качестве значения атрибута ```/@number``` в последовательно расположенных элементах ```/ExchangeBookingRQ/Itinerary/SegmentPricing/SegmentSelect```.

Номера сегментов, которые будут обменены и должны быть удалены, передаются в качестве значения атрибута ```/@Number``` в последовательно расположенных элементах ```/ExchangeBookingRQ/Cancel/Segment```.

Информация о новых сегментах, которые необходимо забронировать, должна быть указана в элементах ```/ExchangeBookingRQ/AirBook/OriginDestinationInformation/FlightSegment```:
- ```/@DepartureDateTime``` — дата отправления
- ```/@FlightNumber``` и ```/MarketingAirline/@FlightNumber``` — номер рейса
- ```/@DepartureDateTime``` — дата отправления
- ```/@NumberInParty``` —  количество запрашиваемых мест (младенцы без места не учитываются)
- ```/@ResBookDesigCode``` —  класс бронирования
- ```/@Status``` —  статус сегмента (при бронировании используется статус ```NN```)
- ```/DestinationLocation/@LocationCode``` —  код пункта прибытия
- ```/MarketingAirline/@Code``` —  код маркетингового перевозчика
- ```/MarriageGrp``` —  индикатор женатого сегмента. Возможные значения:
    - ```O``` — обычный сегмент
    - ```I``` — женатый сегмент (продолжение предыдущего сегмента)
- ```/OriginLocation/@LocationCode``` —  код пункта отправления

{{< details title="Пример (перелет LON-SYD с пересадкой)" open=true >}}
```XML
<OriginDestinationInformation>
  <FlightSegment DepartureDateTime="2022-12-01T00:00:00" FlightNumber="2463" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
    <DestinationLocation LocationCode="AUH"/>
    <MarketingAirline Code="EY" FlightNumber="2463"/>
    <MarriageGrp>O</MarriageGrp>
    <OriginLocation LocationCode="SYD"/>
  </FlightSegment>
  <FlightSegment DepartureDateTime="2022-12-02T00:00:00" FlightNumber="25" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
    <DestinationLocation LocationCode="LHR"/>
    <MarketingAirline Code="EY" FlightNumber="25"/>
    <MarriageGrp>I</MarriageGrp>
    <OriginLocation LocationCode="AUH"/>
  </FlightSegment>
</OriginDestinationInformation>
```
{{< /details >}}

Сервис позволяет указать список статусов сегментов, при появлении которых выполнение запроса будет остановлено. Статусы сегментов необходимо указать в атрибутах ```/ExchangeBookingRQ/AirBook/HaltOnStatus/@Code```.

{{< details title="Рекомендуемый список статусов сегментов" open=true >}}
```XML
<HaltOnStatus Code="HL"/>
<HaltOnStatus Code="HN"/>
<HaltOnStatus Code="HX"/>
<HaltOnStatus Code="LL"/>
<HaltOnStatus Code="NN"/>
<HaltOnStatus Code="NO"/>
<HaltOnStatus Code="PN"/>
<HaltOnStatus Code="UC"/>
<HaltOnStatus Code="UN"/>
<HaltOnStatus Code="US"/>
<HaltOnStatus Code="UU"/>
```
{{< /details >}}

### Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/ExchangeBookingRQ/AirBook/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку.

### Расчет стоимости обмена

Для расчета стоимости обмена для каждого билета в бронировании в запросе необходимо указать:
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/@OriginalTicketNumber``` — номер билета для обмена
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/FlightQualifiers/VendorPrefs/Airline/@Code``` — код валидирующего перевозчика
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Account/Code``` — аккаунт код (Account Code)
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/ExchangeSegment/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand``` — код бренда (в случае расчета с брендом)
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/ChangeFeeCollectionOptions/CollectFee``` — способ сбора штрафа за обмен (необходимо выбрать один вариант):
    - ```/@InTotal``` — включить в общую стоимость билета (значение ```true```)
    - ```/@OnEMD``` — оформить EMD (значение ```true```)
    - ```/@AsTax``` — сбор в виде таксы (необходимо указать ее код)
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Corporate/ID``` — код корпоративной скидки (Corporate ID)
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/NameSelect/@NameNumber``` — номер пассажира, на которого оформлен билет
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeComparison/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/PassengerType/@Code``` — код категории пассажира

### Сравнение стоимости обмена с заданной

Сервис позволяет сравнить полученную стоимость обмена (доплаты по тарифам и таксам, а также штраф за обмен) с заданной стоимостью обмена. Стоимость должна быть указана в качестве значения атрибута ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/@amountSpecified```.

В запросе можно указать необходимость остановки выполнения запроса в случае, если полученная в результате расчета стоимость больше (значение ```true``` у атрибута ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceIncrease/@haltOnNonAcceptablePrice```) или меньше (значение ```true``` у атрибута ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceDecrease/@haltOnNonAcceptablePrice```) заданной стоимости.

В элементах ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceIncrease/Amount``` и ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceIncrease/Percent``` можно указать абсолютную величину или процент (требуется выбрать что-то одно), на которую полученная в результате расчета стоимость может быть больше заданной.

В элементах ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceDecrease/Amount``` и ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceDecrease/Percent``` можно указать абсолютную величину или процент (требуется выбрать что-то одно), на которую полученная в результате расчета стоимость может быть меньше заданной.

{{< details title="Пример (работа сервиса будет прервана, если стоимость обмена превысит 10500)" open=true >}}
```XML
<PriceComparison amountSpecified="10000">
  <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
    <Amount>500</Amount>
  </AcceptablePriceIncrease>
</PriceComparison>
```
{{< /details >}}

### Сохранение маски расчета стоимости обмена

Для сохранения маски расчета стоимости обмена (PQR, Price Quote Reissue) в запросе необходимо указать:
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeConfirmation/@DoNotIssueEMDForChangeFee``` — признак необходимости оформления EMD во время обмена. Значение ```true``` устанавливается тогда, когда EMD оформлять **не требуется**
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeConfirmation/OptionalQualifiers/FOP_Qualifiers/BasicFOP``` — форма оплаты. Возможные значения:
    - наличный расчет — значение ```CA``` у атрибута ```/@Type```
    - безналичный расчет — значение ```CK``` у атрибута ```/@Type```
    - банковская карта карта — требуется заполнение следующих атрибутов:
       - ```/@Code``` — код платежной системы
       - ```/@ExpireDate``` —  год и месяц срока истечения действия карты (формат ```YYYY-MM```)
       - ```/@ManualApprovalCode``` — код авторизации платежа (в случае наличия)
       - ```/@Number``` — номер карты

Список кодов основных платежных систем:
- ```VI``` — Visa
- ```CA``` — Master Card
- ```AX``` — American Express

### Завершающая обработка бронирования

В запросе необходимо указать значение поля Received From для сохранения бронирования в атрибуте ```/ExchangeBookingRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom```. Поле используется для идентификации инициатора изменений в истории бронирования.

Для получения в ответе информации о созданной PQR необходимо указать значение ```true``` у атрибута ```/ExchangeBookingRQ/PostProcessing/@returnPQRInfo```.

Сервис позволяет прочитать полученное бронирование после успешного завершения работы всех предыдущих операций (включая сохранение бронирования) и вернуть его содержимое в ответе. Для этого необходимо добавить элемент ```/ExchangeBookingRQ/PostProcessing/@redisplayReservation```.

### Задержка между обработкой билетов

В случае обмена нескольких билетов в одном бронировании, чтобы избежать проблем одновременного изменения бронирования (Simultaneous Changes) рекомендуется указать задержку между обработками билетов в качестве значения атрибута ```/ExchangeBookingRQ/@multipleExchangesWaitInterval``` (задается в миллисекундах).

### Пример

{{< details title="Пример запроса" >}}
```XML
<ExchangeBookingRQ multipleExchangesWaitInterval="3000" targetCity="2FRH" version="1.0.1" xmlns="http://services.sabre.com/sp/exchange/booking/v1_0_1">
  <Itinerary id="EAYRCG">
    <SegmentPricing>
      <SegmentSelect number="3"/>
      <SegmentSelect number="4"/>
    </SegmentPricing>
  </Itinerary>
  <Cancel>
    <Segment Number="1"/>
    <Segment Number="2"/>
  </Cancel>
  <AirBook>
    <HaltOnStatus Code="HL"/>
    <HaltOnStatus Code="HN"/>
    <HaltOnStatus Code="HX"/>
    <HaltOnStatus Code="LL"/>
    <HaltOnStatus Code="NN"/>
    <HaltOnStatus Code="NO"/>
    <HaltOnStatus Code="PN"/>
    <HaltOnStatus Code="UC"/>
    <HaltOnStatus Code="UN"/>
    <HaltOnStatus Code="US"/>
    <HaltOnStatus Code="UU"/>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2022-11-24T00:00:00" FlightNumber="2456" NumberInParty="3" ResBookDesigCode="Z" Status="NN">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="2456"/>
        <MarriageGrp>O</MarriageGrp>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-11-25T00:00:00" FlightNumber="25" NumberInParty="3" ResBookDesigCode="Z" Status="NN">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="25"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </AirBook>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="6079419630751">
      <PriceRequestInformation>
        <OptionalQualifiers>
          <FlightQualifiers>
            <VendorPrefs>
              <Airline Code="EY"/>
            </VendorPrefs>
          </FlightQualifiers>
          <PricingQualifiers>
            <ChangeFeeCollectionOptions>
              <CollectFee AsTax="CP"/>
            </ChangeFeeCollectionOptions>
            <NameSelect NameNumber="1.1"/>
            <PassengerType Code="ADT"/>
          </PricingQualifiers>
        </OptionalQualifiers>
      </PriceRequestInformation>
    </ExchangeComparison>
    <PriceComparison amountSpecified="74205">
      <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
        <Percent>10</Percent>
      </AcceptablePriceIncrease>
    </PriceComparison>
    <ExchangeConfirmation>
      <OptionalQualifiers>
        <FOP_Qualifiers>
          <BasicFOP Type="CA"/>
        </FOP_Qualifiers>
      </OptionalQualifiers>
    </ExchangeConfirmation>
  </AutomatedExchanges>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="6079419630752">
      <PriceRequestInformation>
        <OptionalQualifiers>
          <FlightQualifiers>
            <VendorPrefs>
              <Airline Code="EY"/>
            </VendorPrefs>
          </FlightQualifiers>
          <PricingQualifiers>
            <ChangeFeeCollectionOptions>
              <CollectFee AsTax="CP"/>
            </ChangeFeeCollectionOptions>
            <NameSelect NameNumber="2.1"/>
            <PassengerType Code="ADT"/>
          </PricingQualifiers>
        </OptionalQualifiers>
      </PriceRequestInformation>
    </ExchangeComparison>
    <PriceComparison amountSpecified="74205">
      <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
        <Percent>10</Percent>
      </AcceptablePriceIncrease>
    </PriceComparison>
    <ExchangeConfirmation>
      <OptionalQualifiers>
        <FOP_Qualifiers>
          <BasicFOP Type="CA"/>
        </FOP_Qualifiers>
      </OptionalQualifiers>
    </ExchangeConfirmation>
  </AutomatedExchanges>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="6079419630753">
      <PriceRequestInformation>
        <OptionalQualifiers>
          <FlightQualifiers>
            <VendorPrefs>
              <Airline Code="EY"/>
            </VendorPrefs>
          </FlightQualifiers>
          <PricingQualifiers>
            <ChangeFeeCollectionOptions>
              <CollectFee AsTax="CP"/>
            </ChangeFeeCollectionOptions>
            <NameSelect NameNumber="3.1"/>
            <PassengerType Code="CNN"/>
          </PricingQualifiers>
        </OptionalQualifiers>
      </PriceRequestInformation>
    </ExchangeComparison>
    <PriceComparison amountSpecified="55275">
      <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
        <Percent>10</Percent>
      </AcceptablePriceIncrease>
    </PriceComparison>
    <ExchangeConfirmation>
      <OptionalQualifiers>
        <FOP_Qualifiers>
          <BasicFOP Type="CA"/>
        </FOP_Qualifiers>
      </OptionalQualifiers>
    </ExchangeConfirmation>
  </AutomatedExchanges>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="6079419630754">
      <PriceRequestInformation>
        <OptionalQualifiers>
          <FlightQualifiers>
            <VendorPrefs>
              <Airline Code="EY"/>
            </VendorPrefs>
          </FlightQualifiers>
          <PricingQualifiers>
            <ChangeFeeCollectionOptions>
              <CollectFee AsTax="CP"/>
            </ChangeFeeCollectionOptions>
            <NameSelect NameNumber="4.1"/>
            <PassengerType Code="INF"/>
          </PricingQualifiers>
        </OptionalQualifiers>
      </PriceRequestInformation>
    </ExchangeComparison>
    <PriceComparison amountSpecified="23530">
      <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
        <Percent>10</Percent>
      </AcceptablePriceIncrease>
    </PriceComparison>
    <ExchangeConfirmation>
      <OptionalQualifiers>
        <FOP_Qualifiers>
          <BasicFOP Type="CA"/>
        </FOP_Qualifiers>
      </OptionalQualifiers>
    </ExchangeConfirmation>
  </AutomatedExchanges>
  <PostProcessing redisplayReservation="true" returnPQRInfo="true">
    <EndTransaction>
      <Source ReceivedFrom="API"/>
    </EndTransaction>
  </PostProcessing>
</ExchangeBookingRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ExchangeBookingRS xmlns="http://services.sabre.com/sp/exchange/booking/v1_0_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-24T08:59:56.602-05:00"/>
    <Warning timeStamp="2022-05-24T08:59:37.542-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T08:59:42.644-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T08:59:47.325-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2022-05-24T08:59:52.208-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ExchangeConfirmation PQR_Number="04">
    <PriceComparison amountReturned="74205" amountSpecified="74205"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="05">
    <PriceComparison amountReturned="74205" amountSpecified="74205"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="06">
    <PriceComparison amountReturned="55275" amountSpecified="55275"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="07">
    <PriceComparison amountReturned="23530" amountSpecified="23530"/>
  </ExchangeConfirmation>
  <PriceQuoteReissue PQR_Number="4">
    <MiscInformation>
      <SignatureLine CreateDateTime="2022-05-24T16:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6079419630751" PQR_Status="E" TicketValue="186823">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOV/IVAN MR</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 74205</Text>
          <TransactionInformation Amount="74205" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON2902.16EY X/AUH Q25.00EY SYD1504.72NUC443</Text>
          <Text>1.88END ROE1.328146</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="5887.00" CurrencyCode="AUD"/>
          <EquivFare Amount="244315" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="16713">
            <Tax Amount="2490" PaidInd="PD" TaxCode="AU"/>
            <Tax Amount="2598" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="158" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1102" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="6216" PaidInd="PD" TaxCode="GB"/>
            <Tax Amount="4149" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="261028" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" RPH="01" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AU"/>
            <MarketingAirline Code="EY" FlightNumber="2456"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="25" RPH="02" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AU"/>
            <MarketingAirline Code="EY" FlightNumber="25"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="12"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="464"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
        <ResTicketingRestrictions>05-26</ResTicketingRestrictions>
      </AirItineraryPricingInfo>
    </PricedItinerary>
    <ResponseHeader>
      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
      <Text>NON ENDO/ REF</Text>
      <Text>VALIDATING CARRIER-EY</Text>
      <Text>FOP CASH</Text>
    </ResponseHeader>
  </PriceQuoteReissue>
  <PriceQuoteReissue PQR_Number="5">
    <MiscInformation>
      <SignatureLine CreateDateTime="2022-05-24T16:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6079419630752" PQR_Status="E" TicketValue="186823">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOVA/ELENA M</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 74205</Text>
          <TransactionInformation Amount="74205" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON2902.16EY X/AUH Q25.00EY SYD1504.72NUC443</Text>
          <Text>1.88END ROE1.328146</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="5887.00" CurrencyCode="AUD"/>
          <EquivFare Amount="244315" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="16713">
            <Tax Amount="2490" PaidInd="PD" TaxCode="AU"/>
            <Tax Amount="2598" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="158" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1102" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="6216" PaidInd="PD" TaxCode="GB"/>
            <Tax Amount="4149" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="261028" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" RPH="01" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AU"/>
            <MarketingAirline Code="EY" FlightNumber="2456"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="25" RPH="02" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AU"/>
            <MarketingAirline Code="EY" FlightNumber="25"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="12"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="464"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
        <ResTicketingRestrictions>05-26</ResTicketingRestrictions>
      </AirItineraryPricingInfo>
    </PricedItinerary>
    <ResponseHeader>
      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
      <Text>NON ENDO/ REF</Text>
      <Text>VALIDATING CARRIER-EY</Text>
      <Text>FOP CASH</Text>
    </ResponseHeader>
  </PriceQuoteReissue>
  <PriceQuoteReissue PQR_Number="6">
    <MiscInformation>
      <SignatureLine CreateDateTime="2022-05-24T16:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6079419630753" PQR_Status="E" TicketValue="136287">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOV/ANDREY C</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 55275</Text>
          <TransactionInformation Amount="55275" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON2176.62EY X/AUH Q25.00EY SYD1128.54NUC333</Text>
          <Text>0.16END ROE1.328146</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="4423.00" CurrencyCode="AUD"/>
          <EquivFare Amount="183555" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="8007">
            <Tax Amount="2598" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="158" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1102" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="4149" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="191562" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" RPH="01" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="2456"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="25" RPH="02" ResBookDesigCode="Z">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="ZWRV4AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="25"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="12"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="464"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
        <ResTicketingRestrictions>05-26</ResTicketingRestrictions>
      </AirItineraryPricingInfo>
    </PricedItinerary>
    <ResponseHeader>
      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
      <Text>NON ENDO/ REF</Text>
      <Text>VALIDATING CARRIER-EY</Text>
      <Text>FOP CASH</Text>
    </ResponseHeader>
  </PriceQuoteReissue>
  <PriceQuoteReissue PQR_Number="7">
    <MiscInformation>
      <SignatureLine CreateDateTime="2022-05-24T16:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6079419630754" PQR_Status="E" TicketValue="20919">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOVA/EKATERI</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 23530</Text>
          <TransactionInformation Amount="23530" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON580.43EY X/AUH EY SYD150.47NUC730.90END R</Text>
          <Text>OE1.328146</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="971.00" CurrencyCode="AUD"/>
          <EquivFare Amount="40300" CurrencyCode="RUB"/>
          <Taxes TaxCode="UB" TotalAmount="4149">
            <Tax Amount="4149" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="44449" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" RPH="01" ResBookDesigCode="Z">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="ZWRV4AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="2456"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="25" RPH="02" ResBookDesigCode="Z">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="ZWRV4AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="25"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="YLXF2AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="12"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="YLXF2AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="464"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
        <ResTicketingRestrictions>05-26</ResTicketingRestrictions>
      </AirItineraryPricingInfo>
    </PricedItinerary>
    <ResponseHeader>
      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
      <Text>NON ENDO/ REF</Text>
      <Text>VALIDATING CARRIER-EY</Text>
      <Text>FOP CASH</Text>
    </ResponseHeader>
  </PriceQuoteReissue>
  <Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1" xmlns="http://webservices.sabre.com/pnrbuilder/v1_17/sp">
    <BookingDetails>
      <RecordLocator>EAYRCG</RecordLocator>
      <CreationTimestamp>2022-05-24T08:58:00</CreationTimestamp>
      <SystemCreationTimestamp>2022-05-24T08:58:00</SystemCreationTimestamp>
      <CreationAgentID>AWT</CreationAgentID>
      <UpdateTimestamp>2022-05-24T08:59:52</UpdateTimestamp>
      <PNRSequence>6</PNRSequence>
      <FlightsRange End="2022-12-09T17:55:00" Start="2022-11-24T23:25:00"/>
      <DivideSplitDetails/>
      <EstimatedPurgeTimestamp>2022-12-23T00:00:00</EstimatedPurgeTimestamp>
      <UpdateToken>-10efc91bac9df0af5285d0a20f2ec02a9e738cf5fae8c1ea</UpdateToken>
    </BookingDetails>
    <POS>
      <Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PseudoCityCode="2FRH"/>
    </POS>
    <PassengerReservation>
      <Passengers>
        <Passenger elementId="pnr-3.1" id="3" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <EmailAddress id="12">
            <Address>CUSTOMER@CUSTOMER.COM</Address>
            <Comment>TO/</Comment>
          </EmailAddress>
          <SpecialRequests>
            <GenericSpecialRequest id="26" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="27" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="28" msgType="S" type="G">
              <Code>CTCM</Code>
              <FreeText>/79851234567/RU</FreeText>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>CTCM EY HK1/79851234567/RU</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="29" msgType="S" type="G">
              <Code>CTCE</Code>
              <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
            </GenericSpecialRequest>
            <APISRequest>
              <DOCSEntry id="20" type="G">
                <DocumentType>P</DocumentType>
                <CountryOfIssue>RU</CountryOfIssue>
                <DocumentNumber>1234567890</DocumentNumber>
                <DocumentNationalityCountry>RU</DocumentNationalityCountry>
                <DateOfBirth>1980-11-20</DateOfBirth>
                <Gender>M</Gender>
                <DocumentExpirationDate>2025-11-20</DocumentExpirationDate>
                <Surname>IVANOV</Surname>
                <Forename>IVAN</Forename>
                <MiddleName>IVANOVICH</MiddleName>
                <PrimaryHolder>true</PrimaryHolder>
                <FreeText/>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <VendorCode>EY</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <APISRequest>
              <DOCSEntry id="23" type="G">
                <DocumentType>P</DocumentType>
                <CountryOfIssue>RU</CountryOfIssue>
                <DocumentNumber>1234567890</DocumentNumber>
                <DocumentNationalityCountry>RU</DocumentNationalityCountry>
                <DateOfBirth>2022-02-20</DateOfBirth>
                <Gender>FI</Gender>
                <DocumentExpirationDate>2025-04-15</DocumentExpirationDate>
                <Surname>IVANOVA</Surname>
                <Forename>EKATERINA</Forename>
                <MiddleName>IVANOVNA</MiddleName>
                <PrimaryHolder>false</PrimaryHolder>
                <FreeText/>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <VendorCode>EY</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630751C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630751C4</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>INF6079419630754C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>INF6079419630754C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-32" id="32" index="1">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>9419630751</DocumentNumber>
              <CommissionAmount>1701</CommissionAmount>
              <BaseFare>170110</BaseFare>
              <TaxAmount>16713</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOV IVAN MR</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>F</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-36" id="36" index="2">TE 6079419630751-RU IVANO/I 2FRH*AWT 1658/24MAY*I</ETicketNumber>
            <TicketDetails elementId="pnr-36" id="36" index="2">
              <OriginalTicketDetails>TE 6079419630751-RU IVANO/I 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6079419630751</TicketNumber>
              <PassengerName>IVANO/I</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-05-24T16:58:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-5.2" id="5" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <SpecialRequests>
            <APISRequest>
              <DOCSEntry id="21" type="G">
                <DocumentType>P</DocumentType>
                <CountryOfIssue>RU</CountryOfIssue>
                <DocumentNumber>2234567890</DocumentNumber>
                <DocumentNationalityCountry>RU</DocumentNationalityCountry>
                <DateOfBirth>1980-01-20</DateOfBirth>
                <Gender>F</Gender>
                <DocumentExpirationDate>2025-08-15</DocumentExpirationDate>
                <Surname>IVANOVA</Surname>
                <Forename>ELENA</Forename>
                <MiddleName>IVANOVNA</MiddleName>
                <PrimaryHolder>false</PrimaryHolder>
                <FreeText/>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <VendorCode>EY</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630752C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630752C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-33" id="33" index="2">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>9419630752</DocumentNumber>
              <CommissionAmount>1701</CommissionAmount>
              <BaseFare>170110</BaseFare>
              <TaxAmount>16713</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOVA ELENA MS</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>F</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-37" id="37" index="3">TE 6079419630752-RU IVANO/E 2FRH*AWT 1658/24MAY*I</ETicketNumber>
            <TicketDetails elementId="pnr-37" id="37" index="3">
              <OriginalTicketDetails>TE 6079419630752-RU IVANO/E 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6079419630752</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-05-24T16:58:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-7.3" id="7" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <SpecialRequests>
            <APISRequest>
              <DOCSEntry id="22" type="G">
                <DocumentType>P</DocumentType>
                <CountryOfIssue>RU</CountryOfIssue>
                <DocumentNumber>3234567890</DocumentNumber>
                <DocumentNationalityCountry>RU</DocumentNationalityCountry>
                <DateOfBirth>2012-01-15</DateOfBirth>
                <Gender>M</Gender>
                <DocumentExpirationDate>2025-11-20</DocumentExpirationDate>
                <Surname>IVANOV</Surname>
                <Forename>ANDREY</Forename>
                <MiddleName>IVANOVICH</MiddleName>
                <PrimaryHolder>false</PrimaryHolder>
                <FreeText/>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <VendorCode>EY</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630753C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-08T00:00:00</DateOfTravel>
              <TicketNumber>6079419630753C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-34" id="34" index="3">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>9419630753</DocumentNumber>
              <CommissionAmount>1283</CommissionAmount>
              <BaseFare>128280</BaseFare>
              <TaxAmount>8007</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOV ANDREY CHD</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>F</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-38" id="38" index="4">TE 6079419630753-RU IVANO/A 2FRH*AWT 1658/24MAY*I</ETicketNumber>
            <TicketDetails elementId="pnr-38" id="38" index="4">
              <OriginalTicketDetails>TE 6079419630753-RU IVANO/A 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6079419630753</TicketNumber>
              <PassengerName>IVANO/A</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-05-24T16:58:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-9.4" id="9" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <LastName>IVANOVA</LastName>
          <FirstName>EKATERINA</FirstName>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-35" id="35" index="4">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>9419630754</DocumentNumber>
              <CommissionAmount>168</CommissionAmount>
              <BaseFare>16770</BaseFare>
              <TaxAmount>4149</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOVA EKATERINA INF</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>F</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-39" id="39" index="5">TE 6079419630754-RU IVANO/E 2FRH*AWT 1658/24MAY*I</ETicketNumber>
            <TicketDetails elementId="pnr-39" id="39" index="5">
              <OriginalTicketDetails>TE 6079419630754-RU IVANO/E 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6079419630754</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-05-24T16:58:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
      </Passengers>
      <Segments>
        <Poc>
          <Airport>SYD</Airport>
          <Departure>2022-11-24T23:25:00</Departure>
        </Poc>
        <Segment id="59" sequence="1">
          <Air id="59" isPast="false" segmentAssociationId="6" sequence="1">
            <DepartureAirport>SYD</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <ArrivalAirport>AUH</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>2456</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>2456</MarketingFlightNumber>
            <OperatingClassOfService>Z</OperatingClassOfService>
            <MarketingClassOfService>Z</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>3</Group>
              <Sequence>1</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-11-24T23:25:00</DepartureDateTime>
            <ArrivalDateTime>2022-11-25T06:40:00</ArrivalDateTime>
            <FlightNumber>2456</FlightNumber>
            <ClassOfService>Z</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests/>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>true</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-05-24T08:59:00</SegmentBookedDate>
            <ElapsedTime>13.15</ElapsedTime>
            <AirMilesFlown>7506</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
        <Segment id="60" sequence="2">
          <Air id="60" isPast="false" segmentAssociationId="7" sequence="2">
            <DepartureAirport>AUH</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
            <DepartureTerminalCode>3</DepartureTerminalCode>
            <ArrivalAirport>LHR</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
            <ArrivalTerminalCode>3</ArrivalTerminalCode>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>0025</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0025</MarketingFlightNumber>
            <OperatingClassOfService>Z</OperatingClassOfService>
            <MarketingClassOfService>Z</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>3</Group>
              <Sequence>2</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-11-25T10:35:00</DepartureDateTime>
            <ArrivalDateTime>2022-11-25T14:10:00</ArrivalDateTime>
            <FlightNumber>0025</FlightNumber>
            <ClassOfService>Z</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests/>
            <inboundConnection>true</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-05-24T08:59:00</SegmentBookedDate>
            <ElapsedTime>07.35</ElapsedTime>
            <AirMilesFlown>3420</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
        <Segment id="18" sequence="3">
          <Air id="18" isPast="false" segmentAssociationId="4" sequence="3">
            <DepartureAirport>LHR</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
            <DepartureTerminalCode>3</DepartureTerminalCode>
            <ArrivalAirport>AUH</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
            <ArrivalTerminalCode>3</ArrivalTerminalCode>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>0012</OperatingFlightNumber>
            <EquipmentType>781</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0012</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>2</Group>
              <Sequence>1</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
            <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
            <FlightNumber>0012</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="26" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="44" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0012Y08DEC/6079419630751C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630751</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630751C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="48" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0012Y08DEC/6079419630752C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630752</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630752C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="52" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0012Y08DEC/6079419630753C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630753</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630753C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="56" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0012Y08DEC/INF6079419630754C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>INF6079419630</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/INF6079419630754C3</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>true</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-05-24T08:58:00</SegmentBookedDate>
            <ElapsedTime>06.50</ElapsedTime>
            <AirMilesFlown>3420</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
        <Segment id="19" sequence="4">
          <Air id="19" isPast="false" segmentAssociationId="5" sequence="4">
            <DepartureAirport>AUH</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <ArrivalAirport>SYD</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>0464</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0464</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>2</Group>
              <Sequence>2</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
            <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
            <FlightNumber>0464</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="27" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="45" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0464Y08DEC/6079419630751C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630751</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630751C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="49" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0464Y08DEC/6079419630752C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630752</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630752C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="53" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0464Y08DEC/6079419630753C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6079419630753</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630753C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="57" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0464Y08DEC/INF6079419630754C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>INF6079419630</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/INF6079419630754C4</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>true</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-05-24T08:58:00</SegmentBookedDate>
            <ElapsedTime>13.45</ElapsedTime>
            <AirMilesFlown>7506</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
      </Segments>
      <TicketingInfo>
        <AlreadyTicketed elementId="pnr-41" id="41" index="1">
          <Code>T-24MAY-2FRH*AWT</Code>
        </AlreadyTicketed>
        <ETicketNumber elementId="pnr-36" id="36" index="2">TE 6079419630751-RU IVANO/I 2FRH*AWT 1658/24MAY*I</ETicketNumber>
        <ETicketNumber elementId="pnr-37" id="37" index="3">TE 6079419630752-RU IVANO/E 2FRH*AWT 1658/24MAY*I</ETicketNumber>
        <ETicketNumber elementId="pnr-38" id="38" index="4">TE 6079419630753-RU IVANO/A 2FRH*AWT 1658/24MAY*I</ETicketNumber>
        <ETicketNumber elementId="pnr-39" id="39" index="5">TE 6079419630754-RU IVANO/E 2FRH*AWT 1658/24MAY*I</ETicketNumber>
        <TicketDetails elementId="pnr-36" id="36" index="2">
          <OriginalTicketDetails>TE 6079419630751-RU IVANO/I 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6079419630751</TicketNumber>
          <PassengerName>IVANO/I</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-05-24T16:58:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-37" id="37" index="3">
          <OriginalTicketDetails>TE 6079419630752-RU IVANO/E 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6079419630752</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-05-24T16:58:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-38" id="38" index="4">
          <OriginalTicketDetails>TE 6079419630753-RU IVANO/A 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6079419630753</TicketNumber>
          <PassengerName>IVANO/A</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-05-24T16:58:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-39" id="39" index="5">
          <OriginalTicketDetails>TE 6079419630754-RU IVANO/E 2FRH*AWT 1658/24MAY*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6079419630754</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-05-24T16:58:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
      </TicketingInfo>
      <ItineraryPricing/>
    </PassengerReservation>
    <ReceivedFrom>
      <Name>API</Name>
    </ReceivedFrom>
    <PhoneNumbers>
      <PhoneNumber elementId="pnr-14" id="14" index="1">
        <CityCode>MOW</CityCode>
        <Number>74991234567-A</Number>
      </PhoneNumber>
      <PhoneNumber elementId="pnr-15" id="15" index="2">
        <CityCode>MOW</CityCode>
        <Number>79851234567-M</Number>
      </PhoneNumber>
    </PhoneNumbers>
    <Remarks>
      <Remark elementId="pnr-30" id="30" index="1" type="REG">
        <RemarkLines>
          <RemarkLine>
            <Text>TEXT REMARK</Text>
          </RemarkLine>
        </RemarkLines>
      </Remark>
      <Remark elementId="pnr-40" id="40" index="2" type="REG">
        <RemarkLines>
          <RemarkLine>
            <Text>XXTAW/</Text>
          </RemarkLine>
        </RemarkLines>
      </Remark>
    </Remarks>
    <EmailAddresses>
      <EmailAddress id="13">
        <Address>AGENCY@AGENCY.COM</Address>
        <Comment>BC/</Comment>
      </EmailAddress>
    </EmailAddresses>
    <AccountingLines>
      <AccountingLine elementId="pnr-32" id="32" index="1">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>EY</AirlineDesignator>
        <DocumentNumber>9419630751</DocumentNumber>
        <CommissionAmount>1701</CommissionAmount>
        <BaseFare>170110</BaseFare>
        <TaxAmount>16713</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOV IVAN MR</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>F</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-33" id="33" index="2">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>EY</AirlineDesignator>
        <DocumentNumber>9419630752</DocumentNumber>
        <CommissionAmount>1701</CommissionAmount>
        <BaseFare>170110</BaseFare>
        <TaxAmount>16713</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOVA ELENA MS</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>F</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-34" id="34" index="3">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>EY</AirlineDesignator>
        <DocumentNumber>9419630753</DocumentNumber>
        <CommissionAmount>1283</CommissionAmount>
        <BaseFare>128280</BaseFare>
        <TaxAmount>8007</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOV ANDREY CHD</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>F</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-35" id="35" index="4">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>EY</AirlineDesignator>
        <DocumentNumber>9419630754</DocumentNumber>
        <CommissionAmount>168</CommissionAmount>
        <BaseFare>16770</BaseFare>
        <TaxAmount>4149</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOVA EKATERINA INF</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>F</TarriffBasis>
      </AccountingLine>
    </AccountingLines>
    <AssociationMatrices>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-3.1"/>
        <Child ref="pnr-32">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-36">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-5.2"/>
        <Child ref="pnr-33">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-37">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-7.3"/>
        <Child ref="pnr-34">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-38">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-9.4"/>
        <Child ref="pnr-35">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-39">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
    </AssociationMatrices>
    <OpenReservationElements>
      <or:OpenReservationElement elementId="pnr-20" id="20" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
          <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-21" id="21" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
          <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <ReferenceId>2</ReferenceId>
          <NameRefNumber>02.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-22" id="22" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
          <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <ReferenceId>3</ReferenceId>
          <NameRefNumber>03.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-23" id="23" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
          <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
          <TravelDocument>
            <Type>P</Type>
            <DocumentIssueCountry>RU</DocumentIssueCountry>
            <DocumentNumber>1234567890</DocumentNumber>
            <DocumentNationalityCountry>RU</DocumentNationalityCountry>
            <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
            <DateOfBirth>20FEB2022</DateOfBirth>
            <Gender>FI</Gender>
            <LastName>IVANOVA</LastName>
            <FirstName>EKATERINA</FirstName>
            <MiddleName>IVANOVNA</MiddleName>
            <Infant>true</Infant>
            <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
            <HasDocumentData>true</HasDocumentData>
          </TravelDocument>
        </ServiceRequest>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-26" id="26" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0012</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>LHR</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>NN</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-27" id="27" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0464</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>SYD</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>NN</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-28" id="28" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/79851234567/RU</FreeText>
          <FullText>CTCM EY HK1/79851234567/RU</FullText>
          <PassengerContactMobilePhone>
            <PhoneNumber>79851234567</PhoneNumber>
            <Language>RU</Language>
          </PassengerContactMobilePhone>
        </ServiceRequest>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-29" id="29" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <Comment>COM/RU</Comment>
          <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
          <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
          <PassengerContactEmail>
            <Email>CUSTOMER@CUSTOMER.COM</Email>
            <Language>RU</Language>
          </PassengerContactEmail>
        </ServiceRequest>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-44" id="44" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630751C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630751C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0012</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>LHR</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-45" id="45" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630751C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630751C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0464</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>SYD</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-48" id="48" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630752C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630752C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0012</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>LHR</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <ReferenceId>2</ReferenceId>
          <NameRefNumber>02.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-49" id="49" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630752C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630752C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0464</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>SYD</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <ReferenceId>2</ReferenceId>
          <NameRefNumber>02.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-52" id="52" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630753C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630753C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0012</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>LHR</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <ReferenceId>3</ReferenceId>
          <NameRefNumber>03.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-53" id="53" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/6079419630753C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630753C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0464</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>SYD</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <ReferenceId>3</ReferenceId>
          <NameRefNumber>03.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-56" id="56" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/INF6079419630754C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/INF6079419630754C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0012</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>LHR</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-57" id="57" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/INF6079419630754C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/INF6079419630754C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0464</FlightNumber>
            <DepartureDate>2022-12-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>SYD</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <Email comment="BC/" type="BC" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <Address>AGENCY@AGENCY.COM</Address>
        </Email>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <Email comment="TO/" type="TO" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <Address>CUSTOMER@CUSTOMER.COM</Address>
        </Email>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
    </OpenReservationElements>
  </Reservation>
</ExchangeBookingRS>
```
{{< /details >}}

## Отправка SSR (UpdatePassengerNameRecordRQ)

После бронирования новых сегментов необходимо повторно отправить все SSR, которые должны быть привязаны к новым сегментам. Для этого используется сервис [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record).

{{< hint warning >}}
Обратите внимание на то, что повторно требуется отправить только те SSR, которые "привязываются" к сегментам (например, ```DOCS```, ```DOCO```, ```DOCA```, ```INFT```, ```CHLD```, ```CTCM```, ```CTCE``` и другие). SSR, которые не привязываются к сегментам (например, ```FOID```), а также OSI сообщения повторно отправлять не требуется.
{{< /hint >}}

В запросе необходимо указать:
- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/AdvancePassenger``` — SSR типа ```DOCS```, ```DOCO``` и ```DOCA``` (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.html#добавление-паспортных-данных-и-отправка-других-сообщений-перевозчику-ssr-и-osi))
- ```/UpdatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` — другие SSR (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.html#добавление-паспортных-данных-и-отправка-других-сообщений-перевозчику-ssr-и-osi))
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransactionRQ/Source/@ReceivedFrom``` — значение поля Received From при сохранении бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

Для выполнения операции в другом PCC его можно указать в качестве значения атрибута ```/UpdatePassengerNameRecordRQ/@targetCity```.

Дополнительно можно запросить проверку минимального стыковочного времени, указав значение ```true``` у атрибута ```/UpdatePassengerNameRecordRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку. Бронирование в этом случае сохранено не будет.

{{< details title="Пример запроса" >}}
```XML
<UpdatePassengerNameRecordRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.1.0" xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <Itinerary id="EAYRCG"/>
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
          <PersonName DateOfBirth="2022-02-20" DocumentHolder="false" Gender="FI" NameNumber="1.1">
            <GivenName>EKATERINA</GivenName>
            <MiddleName>IVANOVNA</MiddleName>
            <Surname>IVANOVA</Surname>
          </PersonName>
        </AdvancePassenger>
        <Service SSR_Code="INFT">
          <PersonName NameNumber="1.1"/>
          <Text>IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
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
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-24T09:00:44.818-05:00"/>
    <Warning timeStamp="2022-05-24T09:00:43.071-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="EAYRCG"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <AccountingInfo Id="32">
        <Airline Code="EY"/>
        <BaseFare Amount="170110"/>
        <DocumentInfo>
          <Document Number="9419630751"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="1701"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="16713"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>F</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="33">
        <Airline Code="EY"/>
        <BaseFare Amount="170110"/>
        <DocumentInfo>
          <Document Number="9419630752"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="1701"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="16713"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>F</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="34">
        <Airline Code="EY"/>
        <BaseFare Amount="128280"/>
        <DocumentInfo>
          <Document Number="9419630753"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="1283"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="3.1">IVANOV ANDREY</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="8007"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>F</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <AccountingInfo Id="35">
        <Airline Code="EY"/>
        <BaseFare Amount="16770"/>
        <DocumentInfo>
          <Document Number="9419630754"/>
        </DocumentInfo>
        <FareApplication>ONE</FareApplication>
        <PaymentInfo>
          <Commission Amount="168"/>
          <Payment>
            <Form>CA</Form>
          </Payment>
        </PaymentInfo>
        <PersonName NameNumber="4.1">I IVANOVA EKATERINA</PersonName>
        <Taxes>
          <GST Amount="0"/>
          <Tax Amount="4149"/>
        </Taxes>
        <TicketingInfo>
          <eTicket Ind="true"/>
          <Exchange Ind="false"/>
          <TariffBasis>F</TariffBasis>
          <Ticketing ConjunctedCount="1"/>
        </TicketingInfo>
      </AccountingInfo>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-3.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-5.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-7.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-9.4">
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
                <Text>2FRH 9LSC*AWT 1658/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="170110" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="16713" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2490AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2598WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">158ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1102F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6216GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4149UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="186823" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="8198.00"/>
                    <EquivFare Amount="340220"/>
                    <Taxes>
                      <Tax Amount="33426"/>
                    </Taxes>
                    <TotalFare Amount="373646"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
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
                <Text>2FRH 9LSC*AWT 1658/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="128280" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8007" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2598WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">158ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1102F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4149UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="136287" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3091.00"/>
                    <EquivFare Amount="128280"/>
                    <Taxes>
                      <Tax Amount="8007"/>
                    </Taxes>
                    <TotalFare Amount="136287"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
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
                <Text>2FRH 9LSC*AWT 1658/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="404.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="16770" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4149" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="20919" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="404.00"/>
                    <EquivFare Amount="16770"/>
                    <Taxes>
                      <Tax Amount="4149"/>
                    </Taxes>
                    <TotalFare Amount="20919"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="true" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="INF">
                <PassengerData NameNumber="04.01">IVANOVA/EKATERINA</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="4">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" PQR_Ind="Y" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1659/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WFRF" RPH="4" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="5887.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="244315" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="16713" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2490AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">158ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1102F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6216GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4149UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="261028" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="5887.00"/>
                    <EquivFare Amount="244315"/>
                    <Taxes>
                      <Tax Amount="16713"/>
                    </Taxes>
                    <TotalFare Amount="261028"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WFRF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="ZWRV4AU/ZWRV4AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON2902.16EY X/AUH Q25.00EY SYD1504.72NUC4431.88END ROE1.328146</Text>
                  </FareCalculation>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2456"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-24</NotValidAfter>
                      <NotValidBefore>2022-11-24</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="0025" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-25</NotValidAfter>
                      <NotValidBefore>2022-11-25</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="0012" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="0464" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 26MAY/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 26MAY</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="01.01">IVANOV/IVAN MR</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="5">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" PQR_Ind="Y" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1659/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WFRF" RPH="5" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="5887.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="244315" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="16713" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2490AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">158ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1102F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6216GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4149UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="261028" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="5887.00"/>
                    <EquivFare Amount="244315"/>
                    <Taxes>
                      <Tax Amount="16713"/>
                    </Taxes>
                    <TotalFare Amount="261028"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WFRF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="ZWRV4AU/ZWRV4AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON2902.16EY X/AUH Q25.00EY SYD1504.72NUC4431.88END ROE1.328146</Text>
                  </FareCalculation>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2456"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-24</NotValidAfter>
                      <NotValidBefore>2022-11-24</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="0025" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-25</NotValidAfter>
                      <NotValidBefore>2022-11-25</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="0012" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="0464" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 26MAY/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 26MAY</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="02.01">IVANOVA/ELENA MS</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="6">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" PQR_Ind="Y" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1659/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WFRF" RPH="6" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4423.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="183555" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8007" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1299WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">158ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1102F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4149UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="191562" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="4423.00"/>
                    <EquivFare Amount="183555"/>
                    <Taxes>
                      <Tax Amount="8007"/>
                    </Taxes>
                    <TotalFare Amount="191562"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WFRF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="ZWRV4AUCH/ZWRV4AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON2176.62EY X/AUH Q25.00EY SYD1128.54NUC3330.16END ROE1.328146</Text>
                  </FareCalculation>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2456"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-24</NotValidAfter>
                      <NotValidBefore>2022-11-24</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="0025" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="40K"/>
                    <FareBasis Code="ZWRV4AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-25</NotValidAfter>
                      <NotValidBefore>2022-11-25</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="0012" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="0464" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 26MAY/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 26MAY</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="CNN">
                <PassengerData NameNumber="03.01">IVANOV/ANDREY</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="7">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" PQR_Ind="Y" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1659/24MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WFRF" RPH="7" StatusCode="A" StoredDateTime="2022-05-24T16:58" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="971.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="40300" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4149" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="44449" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="971.00"/>
                    <EquivFare Amount="40300"/>
                    <Taxes>
                      <Tax Amount="4149"/>
                    </Taxes>
                    <TotalFare Amount="44449"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WFRF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="ZWRV4AUIN/ZWRV4AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON580.43EY X/AUH EY SYD150.47NUC730.90END ROE1.328146</Text>
                  </FareCalculation>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="2456" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="ZWRV4AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2456"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-24</NotValidAfter>
                      <NotValidBefore>2022-11-24</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T10:35" FlightNumber="0025" ResBookDesigCode="Z" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="ZWRV4AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-11-25</NotValidAfter>
                      <NotValidBefore>2022-11-25</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="0012" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="0464" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 26MAY/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 26MAY</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="INF">
                <PassengerData NameNumber="04.01">IVANOVA/EKATERINA</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="28861.00"/>
            <EquivFare Amount="1197755.00"/>
            <Taxes>
              <Tax Amount="91164.00"/>
            </Taxes>
            <TotalFare Amount="1288919.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="11-25T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-11-24T23:25" ElapsedTime="13.15" FlightNumber="2456" Id="59" IsPast="false" NumberInParty="03" ResBookDesigCode="Z" SegmentBookedDate="2022-05-24T08:59:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="2456" ResBookDesigCode="Z">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="003" Ind="O" Sequence="1"/>
              <Meal Code="R"/>
              <OperatingAirline Code="EY" FlightNumber="2456" ResBookDesigCode="Z">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SYD"/>
              <SupplierRef ID="DCEY*EAYSUJ"/>
              <UpdatedArrivalTime>11-25T06:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>11-24T23:25</UpdatedDepartureTime>
              <Cabin Code="C" Lang="EN" Name="BUSINESS" SabreCode="C" ShortName="BUSINESS"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="6" sequence="1">
                  <DepartureAirport>SYD</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>2456</MarketingFlightNumber>
                  <MarketingClassOfService>Z</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>3</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="C" lang="EN" name="BUSINESS" sabreCode="C" shortName="BUSINESS"/>
                  <MealCode>R</MealCode>
                  <ElapsedTime>795</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-11-24T23:25:00</DepartureDateTime>
                  <ArrivalDateTime>2022-11-25T06:40:00</ArrivalDateTime>
                  <FlightNumber>2456</FlightNumber>
                  <ClassOfService>Z</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-24T08:59:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="11-25T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-11-25T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="60" IsPast="false" NumberInParty="03" ResBookDesigCode="Z" SegmentBookedDate="2022-05-24T08:59:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Z">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="003" Ind="I" Sequence="2"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Z">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*EAYSUJ"/>
              <UpdatedArrivalTime>11-25T14:10</UpdatedArrivalTime>
              <UpdatedDepartureTime>11-25T10:35</UpdatedDepartureTime>
              <Cabin Code="C" Lang="EN" Name="BUSINESS" SabreCode="C" ShortName="BUSINESS"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="7" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>LHR</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>25</MarketingFlightNumber>
                  <MarketingClassOfService>Z</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>3</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="C" lang="EN" name="BUSINESS" sabreCode="C" shortName="BUSINESS"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>455</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-11-25T10:35:00</DepartureDateTime>
                  <ArrivalDateTime>2022-11-25T14:10:00</ArrivalDateTime>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Z</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-24T08:59:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T08:58:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="781"/>
              <MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="O" Sequence="1"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*EAYSUJ"/>
              <UpdatedArrivalTime>12-08T19:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T08:30</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="3">
                  <DepartureAirport>LHR</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>781</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>12</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>410</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
                  <FlightNumber>12</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-24T08:58:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-24T08:58:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SYD"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="I" Sequence="2"/>
              <OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH"/>
              <SupplierRef ID="DCEY*EAYSUJ"/>
              <UpdatedArrivalTime>12-09T17:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T22:10</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="4">
                  <DepartureAirport>AUH</DepartureAirport>
                  <ArrivalAirport>SYD</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>464</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <ElapsedTime>825</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*EAYSUJ</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
                  <FlightNumber>464</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-24T08:58:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="T-24MAY-2FRH*AWT"/>
        <Ticketing RPH="02" eTicketNumber="TE 6079419630751-RU IVANO/I 2FRH*AWT 1658/24MAY*I">
          <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
        </Ticketing>
        <Ticketing RPH="03" eTicketNumber="TE 6079419630752-RU IVANO/E 2FRH*AWT 1658/24MAY*I">
          <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
        </Ticketing>
        <Ticketing RPH="04" eTicketNumber="TE 6079419630753-RU IVANO/A 2FRH*AWT 1658/24MAY*I">
          <PersonName NameNumber="3.1">IVANOV ANDREY</PersonName>
        </Ticketing>
        <Ticketing RPH="05" eTicketNumber="TE 6079419630754-RU IVANO/E 2FRH*AWT 1658/24MAY*I">
          <PersonName NameNumber="4.1">I IVANOVA EKATERINA</PersonName>
        </Ticketing>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="EAYRCG" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-24T08:58" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-24T09:00" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="7"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="30" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
        <Remark Id="40" RPH="002" Type="General">
          <Text>XXTAW/</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="20" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="28" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="44" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 LHRAUH0012Y08DEC/6079419630751C3</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="45" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 AUHSYD0464Y08DEC/6079419630751C4</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="48" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1 LHRAUH0012Y08DEC/6079419630752C3</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="49" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1 AUHSYD0464Y08DEC/6079419630752C4</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="52" RPH="011" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1 LHRAUH0012Y08DEC/6079419630753C3</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="53" RPH="012" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1 AUHSYD0464Y08DEC/6079419630753C4</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="56" RPH="013" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 LHRAUH0012Y08DEC/INF6079419630754C3</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="57" RPH="014" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 AUHSYD0464Y08DEC/INF6079419630754C4</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="65" RPH="015" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="66" RPH="016" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="67" RPH="017" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="68" RPH="018" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="69" RPH="019" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SYDAUH2456Z24NOV/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="70" RPH="020" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHLHR0025Z25NOV/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="71" RPH="021" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="72" RPH="022" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="73" RPH="023" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="74" RPH="024" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2022</DateOfBirth>
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
        <OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM EY HK1/79851234567/RU</FullText>
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
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
        <OpenReservationElement elementId="pnr-44" id="44" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630751C3</FreeText>
            <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630751C3</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-45" id="45" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630751C4</FreeText>
            <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630751C4</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-48" id="48" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630752C3</FreeText>
            <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630752C3</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-49" id="49" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630752C4</FreeText>
            <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630752C4</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-52" id="52" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630753C3</FreeText>
            <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/6079419630753C3</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-53" id="53" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/6079419630753C4</FreeText>
            <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/6079419630753C4</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/INF6079419630754C3</FreeText>
            <FullText>TKNE EY HK1 LHRAUH0012Y08DEC/INF6079419630754C3</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-57" id="57" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/INF6079419630754C4</FreeText>
            <FullText>TKNE EY HK1 AUHSYD0464Y08DEC/INF6079419630754C4</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>HK</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-65" id="65" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2022</DateOfBirth>
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
        <OpenReservationElement elementId="pnr-69" id="69" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 SYDAUH2456Z24NOV/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="59" SegmentAssociationId="6">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>2456</FlightNumber>
              <DepartureDate>2022-11-24</DepartureDate>
              <BoardPoint>SYD</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Z</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-70" id="70" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHLHR0025Z25NOV/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="60" SegmentAssociationId="7">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0025</FlightNumber>
              <DepartureDate>2022-11-25</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>LHR</OffPoint>
              <ClassOfService>Z</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-71" id="71" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-72" id="72" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-73" id="73" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM EY HK1/79851234567/RU</FullText>
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
        <OpenReservationElement elementId="pnr-74" id="74" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
          <Parent ref="pnr-3.1"/>
          <Child ref="pnr-32"/>
          <Child ref="pnr-36"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-5.2"/>
          <Child ref="pnr-33"/>
          <Child ref="pnr-37"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-7.3"/>
          <Child ref="pnr-34"/>
          <Child ref="pnr-38"/>
        </AssociationMatrix>
        <AssociationMatrix>
          <Name>PersonIDType</Name>
          <Parent ref="pnr-9.4"/>
          <Child ref="pnr-35"/>
          <Child ref="pnr-39"/>
        </AssociationMatrix>
      </AssociationMatrices>
    </TravelItinerary>
  </TravelItineraryRead>
</UpdatePassengerNameRecordRS>
```
{{< /details >}}

## Оформление билетов

Для завершения обмена билетов необходимо оформить новые билеты по сохраненным PQR. Подробнее о процессе оформления билетов см. [Оформление билетов и EMD](issue-ticket.html). Обратите внимание на раздел [Особенности оформления билетов в обмен](issue-ticket.html#особенности-оформления-билетов-в-обмен).
