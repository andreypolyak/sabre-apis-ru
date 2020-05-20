# Обмен билетов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Подробнее об условиях выполнения обменов билетов см. в [Обмены и возвраты](exchanges-refunds.md#dobrovolnii_obmen_biletov).

## Алгоритм обмена билетов

{% imgsec "Схема", "0", "exchange-ticket" %}./assets/svg/exchange-ticket/exchange-ticket.svg{% endimgsec %}

## Подготовка и расчет стоимости обмена (ExchangeBookingRQ)

*Для обмена билетов в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

**Обмен билетов всегда должен выполняться в том же PCC, где они были оформлены!**

Для подготовки бронирования и расчета стоимости обмена используется сервис [ExchangeBookingRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/exchange_booking). Сервис автоматизирует многие процессы, связанные с подготовкой к обмену билетов:
- чтение бронирование
- удаление старых и бронирование новых сегментов
- расчет стоимости обмена и сохранение PQR (Price Quote Reissue)
- сохранение бронирования

На данный момент сервис позволяет сохранить только один PQR для одного билета за один вызов. Если в бронировании необходимо выполнить обмен нескольких билетов, то требуется повторить вызов к сервису несколько раз, при этом удалить старые и забронировать новые сегменты требуется только в первом вызове.

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
- ```/MarriageGrp``` —  индикатор женатого сегмента. Возможные варианты заполнения:
    - ```O``` — обычный сегмент
    - ```I``` — женатый сегмент (продолжение предыдущего сегмента)
- ```/OriginLocation/@LocationCode``` —  код пункта отправления

{% xmlsec "Пример (3 места на рейсе SU1138 из Шереметьево в Сочи 15 марта в Y классе)", true %}
<FlightSegment DepartureDateTime="2019-03-15T06:50" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
  <DestinationLocation LocationCode="AER"/>
  <MarketingAirline Code="SU" FlightNumber="1138"/>
  <MarriageGrp>O</MarriageGrp>
  <OriginLocation LocationCode="SVO"/>
</FlightSegment>
{% endxmlsec %}

Сервис позволяет указать список статусов сегментов, при появлении которых выполнение запроса будет остановлено. Статусы сегментов необходимо указать в атрибутах ```/ExchangeBookingRQ/AirBook/HaltOnStatus/@Code```.

{% xmlsec "Рекомендуемый список статусов сегментов", true %}
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
{% endxmlsec %}

### Расчет стоимости обмена

Для расчета стоимости обмена в запросе необходимо указать:
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

В элементах ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceIncrease/Amount``` и ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceIncrease/Percent``` можно указать абсолютную величину или процент, на которую полученная в результате расчета стоимость будет больше заданной.

В элементах ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceDecrease/Amount``` и ```/ExchangeBookingRQ/AutomatedExchanges/PriceComparison/AcceptablePriceDecrease/Percent``` можно указать абсолютную величину или процент, на которую полученная в результате расчета стоимость будет меньше заданной.

{% xmlsec "Пример (работа сервиса будет прервана, если стоимость обмена превышает 10500 рублей)", true %}
<PriceComparison amountSpecified="10000">
  <AcceptablePriceIncrease haltOnNonAcceptablePrice="true">
    <Amount>500</Amount>
  </AcceptablePriceIncrease>
</PriceComparison>
{% endxmlsec %}

### Сохранение маски расчета стоимости обмена

Для сохранения маски расчета стоимости обмена (PQR, Price Quote Reissue) в запросе необходимо указать:
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeConfirmation/@PQR_Number``` — номер создаваемой PQR. Обратите внимание на то, что PQ и PQR имеют сквозную систему нумерации и в качестве значения данного атрибута необходимо указать первый незанятый номер PQ или PQR
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeConfirmation/@DoNotIssueEMDForChangeFee``` — признак необходимости оформления EMD во время обмена. Значение ```true``` устанавливается тогда, когда EMD оформлять **не требуется**
- ```/ExchangeBookingRQ/AutomatedExchanges/ExchangeConfirmation/OptionalQualifiers/FOP_Qualifiers/BasicFOP``` — форма оплаты. Возможные варианты:
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

### Пример

{% xmlsec "Пример запроса", false %}
<ExchangeBookingRQ targetCity="2FRH" version="1.0.0" xmlns="http://services.sabre.com/sp/exchange/booking/v1">
  <Itinerary id="CSCQGD">
    <SegmentPricing>
      <SegmentSelect number="2"/>
    </SegmentPricing>
  </Itinerary>
  <Cancel>
    <Segment Number="1"/>
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
      <FlightSegment DepartureDateTime="2020-08-31T00:00:00" FlightNumber="1120" NumberInParty="3" ResBookDesigCode="Y" Status="NN">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1120"/>
        <MarriageGrp>O</MarriageGrp>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </AirBook>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="5555588040243">
      <PriceRequestInformation>
        <OptionalQualifiers>
          <FlightQualifiers>
            <VendorPrefs>
              <Airline Code="SU"/>
            </VendorPrefs>
          </FlightQualifiers>
          <PricingQualifiers>
            <Brand>EC</Brand>
            <ChangeFeeCollectionOptions>
              <CollectFee AsTax="CP"/>
            </ChangeFeeCollectionOptions>
            <NameSelect NameNumber="1.1"/>
            <PassengerType Code="ADT"/>
          </PricingQualifiers>
        </OptionalQualifiers>
      </PriceRequestInformation>
    </ExchangeComparison>
    <PriceComparison amountSpecified="2600">
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
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<ExchangeBookingRS xmlns="http://services.sabre.com/sp/exchange/booking/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-31T05:59:42.135-06:00"/>
    <Warning timeStamp="2020-01-31T05:59:41.435-06:00" type="Application">
      <SystemSpecificResults>
        <Message code="WARN.SP.PROVIDER_ERROR">Unable to perform first end transaction</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-31T05:59:41.435-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ExchangeConfirmation PQR_Number="04">
    <PriceComparison amountReturned="2600" amountSpecified="2600"/>
  </ExchangeConfirmation>
  <PriceQuoteReissue PQR_Number="4">
    <MiscInformation>
      <SignatureLine CreateDateTime="2020-01-31T14:59" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="5555588040243" PQR_Status="E" TicketValue="64008">
          <ChangeFeeInformation Amount="2600">/FEE AS TAX</ChangeFeeInformation>
          <PersonName>
            <Surname>IVANOV/IVAN MR</Surname>
          </PersonName>
          <TransactionInformation Amount="2600" CurrencyCode="RUB">
            <Text>A/C, FEES</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="58000" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="6008">
            <Tax Amount="5400" PaidInd="PD" TaxCode="YQ"/>
            <Tax Amount="608" PaidInd="PD" TaxCode="RI"/>
            <Tax Amount="2600" TaxCode="CP"/>
          </Taxes>
          <TotalFare Amount="64008" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="08-31T06:05" FlightNumber="1120" RPH="01" ResBookDesigCode="Y">
            <BaggageAllowance Number="01P"/>
            <FareBasis Code="YCLR"/>
            <MarketingAirline Code="SU" FlightNumber="1120"/>
            <OriginLocation LocationCode="SVO"/>
            <ValidityDates>
              <NotValidAfter>2020-08-31</NotValidAfter>
              <NotValidBefore>2020-08-31</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" RPH="02" ResBookDesigCode="Y">
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
        </PTC_FareBreakdown>
        <ResTicketingRestrictions>08-26</ResTicketingRestrictions>
      </AirItineraryPricingInfo>
    </PricedItinerary>
    <ResponseHeader>
      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
      <Text>RUB58000 NONREFUNDABLE</Text>
      <Text>VALIDATING CARRIER-SU</Text>
      <Text>FOP CASH</Text>
    </ResponseHeader>
  </PriceQuoteReissue>
  <Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1" xmlns="http://webservices.sabre.com/pnrbuilder/v1_17/sp">
    <BookingDetails>
      <RecordLocator>CSCQGD</RecordLocator>
      <CreationTimestamp>2020-01-31T05:55:00</CreationTimestamp>
      <SystemCreationTimestamp>2020-01-31T05:55:00</SystemCreationTimestamp>
      <CreationAgentID>AWT</CreationAgentID>
      <UpdateTimestamp>2020-01-31T05:59:41</UpdateTimestamp>
      <PNRSequence>4</PNRSequence>
      <FlightsRange End="2020-09-08T05:20:00" Start="2020-08-31T06:05:00"/>
      <DivideSplitDetails/>
      <EstimatedPurgeTimestamp>2020-09-23T00:00:00</EstimatedPurgeTimestamp>
      <UpdateToken>-3ba9c9bad1eba6f7093380d2d34cf40837b57a4448774bfd</UpdateToken>
    </BookingDetails>
    <POS>
      <Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PseudoCityCode="2FRH"/>
    </POS>
    <PassengerReservation>
      <Passengers>
        <Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <EmailAddress id="12">
            <Address>CUSTOMER@CUSTOMER.COM</Address>
            <Comment>TO/</Comment>
          </EmailAddress>
          <SpecialRequests>
            <GenericSpecialRequest id="19" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>SU</AirlineCode>
              <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="20" msgType="S" type="G">
              <Code>CTCM</Code>
              <FreeText>/79851234567/RU</FreeText>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>SU</AirlineCode>
              <FullText>CTCM SU HK1/79851234567/RU</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="21" msgType="S" type="G">
              <Code>CTCE</Code>
              <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>SU</AirlineCode>
              <FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="29" msgType="S" type="A">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
              <ActionCode>KK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>SU</AirlineCode>
              <FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="30" msgType="S" type="A">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
              <ActionCode>KK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>SU</AirlineCode>
              <FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
            </GenericSpecialRequest>
            <APISRequest>
              <DOCSEntry id="22" type="G">
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
                <VendorCode>SU</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <APISRequest>
              <DOCSEntry id="25" type="G">
                <DocumentType>P</DocumentType>
                <CountryOfIssue>RU</CountryOfIssue>
                <DocumentNumber>1234567890</DocumentNumber>
                <DocumentNationalityCountry>RU</DocumentNationalityCountry>
                <DateOfBirth>2019-02-20</DateOfBirth>
                <Gender>FI</Gender>
                <DocumentExpirationDate>2025-04-15</DocumentExpirationDate>
                <Surname>IVANOVA</Surname>
                <Forename>EKATERINA</Forename>
                <MiddleName>IVANOVNA</MiddleName>
                <PrimaryHolder>false</PrimaryHolder>
                <FreeText/>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <VendorCode>SU</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>SU</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2020-09-08T00:00:00</DateOfTravel>
              <TicketNumber>5555588040243C2</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>SU</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2020-09-08T00:00:00</DateOfTravel>
              <TicketNumber>INF5555588040246C2</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-31" id="31" index="1">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>SU</AirlineDesignator>
              <DocumentNumber>5588040243</DocumentNumber>
              <CommissionAmount>580</CommissionAmount>
              <BaseFare>58000</BaseFare>
              <TaxAmount>6008</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOV IVAN MR</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>D</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-33" id="33" index="2">TE 5555588040243-RU IVANO/I 2FRH*AWT 1456/31JAN*D</ETicketNumber>
            <TicketDetails elementId="pnr-33" id="33" index="2">
              <OriginalTicketDetails>TE 5555588040243-RU IVANO/I 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>5555588040243</TicketNumber>
              <PassengerName>IVANO/I</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2020-01-31T14:56:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <SpecialRequests>
            <APISRequest>
              <DOCSEntry id="23" type="G">
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
                <VendorCode>SU</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>SU</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2020-09-08T00:00:00</DateOfTravel>
              <TicketNumber>5555588040244C2</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-32" id="32" index="2">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>SU</AirlineDesignator>
              <DocumentNumber>5588040244</DocumentNumber>
              <CommissionAmount>580</CommissionAmount>
              <BaseFare>58000</BaseFare>
              <TaxAmount>6008</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOVA ELENA MS</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>D</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-34" id="34" index="3">TE 5555588040244-RU IVANO/E 2FRH*AWT 1456/31JAN*D</ETicketNumber>
            <TicketDetails elementId="pnr-34" id="34" index="3">
              <OriginalTicketDetails>TE 5555588040244-RU IVANO/E 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>5555588040244</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2020-01-31T14:56:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <SpecialRequests>
            <APISRequest>
              <DOCSEntry id="24" type="G">
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
                <VendorCode>SU</VendorCode>
              </DOCSEntry>
            </APISRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>SU</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2020-09-08T00:00:00</DateOfTravel>
              <TicketNumber>5555588040245C2</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-42" id="42" index="3">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>SU</AirlineDesignator>
              <DocumentNumber>5588040245</DocumentNumber>
              <CommissionAmount>435</CommissionAmount>
              <BaseFare>43500</BaseFare>
              <TaxAmount>5704</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOV ANDREY CHD</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>D</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-43" id="43" index="4">TE 5555588040245-RU IVANO/A 2FRH*AWT 1456/31JAN*D</ETicketNumber>
            <TicketDetails elementId="pnr-43" id="43" index="4">
              <OriginalTicketDetails>TE 5555588040245-RU IVANO/A 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>5555588040245</TicketNumber>
              <PassengerName>IVANO/A</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2020-01-31T14:56:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
        <Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <LastName>IVANOVA</LastName>
          <FirstName>EKATERINA</FirstName>
          <SpecialRequests>
            <GenericSpecialRequest id="9" msgType="O" type="A">
              <FreeText>INF</FreeText>
              <AirlineCode>AA</AirlineCode>
              <FullText>AA INF</FullText>
            </GenericSpecialRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-48" id="48" index="4">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>SU</AirlineDesignator>
              <DocumentNumber>5588040246</DocumentNumber>
              <CommissionAmount>0</CommissionAmount>
              <BaseFare>0</BaseFare>
              <TaxAmount>0</TaxAmount>
              <GSTCode>C</GSTCode>
              <GSTAmount>0</GSTAmount>
              <PassengerName>IVANOVA EKATERINA INF</PassengerName>
              <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
              <TarriffBasis>D</TarriffBasis>
            </AccountingLine>
          </AccountingLines>
          <Remarks/>
          <PhoneNumbers/>
          <TicketingInfo>
            <ETicketNumber elementId="pnr-49" id="49" index="5">TE 5555588040246-RU IVANO/E 2FRH*AWT 1456/31JAN*D</ETicketNumber>
            <TicketDetails elementId="pnr-49" id="49" index="5">
              <OriginalTicketDetails>TE 5555588040246-RU IVANO/E 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>5555588040246</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2020-01-31T14:56:00</Timestamp>
              <PaymentType>*</PaymentType>
            </TicketDetails>
          </TicketingInfo>
        </Passenger>
      </Passengers>
      <Segments>
        <Poc>
          <Airport>SVO</Airport>
          <Departure>2020-08-31T06:05:00</Departure>
        </Poc>
        <Segment id="54" sequence="1">
          <Air id="54" isPast="false" segmentAssociationId="4" sequence="1">
            <DepartureAirport>SVO</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
            <DepartureTerminalCode>B</DepartureTerminalCode>
            <ArrivalAirport>AER</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <OperatingAirlineCode>SU</OperatingAirlineCode>
            <OperatingAirlineShortName>AEROFLOT</OperatingAirlineShortName>
            <OperatingFlightNumber>1120</OperatingFlightNumber>
            <EquipmentType>32A</EquipmentType>
            <MarketingAirlineCode>SU</MarketingAirlineCode>
            <MarketingFlightNumber>1120</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>0</Group>
              <Sequence>0</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCSU*</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2020-08-31T06:05:00</DepartureDateTime>
            <ArrivalDateTime>2020-08-31T08:35:00</ArrivalDateTime>
            <FlightNumber>1120</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests/>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2020-01-31T05:59:00</SegmentBookedDate>
            <ElapsedTime>02.30</ElapsedTime>
            <AirMilesFlown>0873</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
        <Segment id="17" sequence="2">
          <Air id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <DepartureAirport>AER</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <ArrivalAirport>SVO</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
            <ArrivalTerminalCode>B</ArrivalTerminalCode>
            <OperatingAirlineCode>SU</OperatingAirlineCode>
            <OperatingAirlineShortName>AEROFLOT</OperatingAirlineShortName>
            <OperatingFlightNumber>1129</OperatingFlightNumber>
            <EquipmentType>73H</EquipmentType>
            <MarketingAirlineCode>SU</MarketingAirlineCode>
            <MarketingFlightNumber>1129</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>0</Group>
              <Sequence>0</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCSU*BBDOPG</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
            <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
            <FlightNumber>1129</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="19" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="38" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>SU HK1 AERSVO1129Y08SEP/5555588040243C2</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <TicketNumber>5555588040243</TicketNumber>
                <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040243C2</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="40" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>SU HK1 AERSVO1129Y08SEP/5555588040244C2</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <TicketNumber>5555588040244</TicketNumber>
                <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040244C2</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="46" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>SU HK1 AERSVO1129Y08SEP/5555588040245C2</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <TicketNumber>5555588040245</TicketNumber>
                <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040245C2</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="52" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>SU HK1 AERSVO1129Y08SEP/INF5555588040246C2</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <TicketNumber>INF5555588040</TicketNumber>
                <FullText>TKNE SU HK1 AERSVO1129Y08SEP/INF5555588040246C2</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="30" msgType="S" type="A">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
                <ActionCode>KK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>SU</AirlineCode>
                <FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2020-01-31T05:55:00</SegmentBookedDate>
            <ElapsedTime>02.35</ElapsedTime>
            <AirMilesFlown>0873</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
      </Segments>
      <TicketingInfo>
        <AlreadyTicketed elementId="pnr-36" id="36" index="1">
          <Code>T-31JAN-2FRH*AWT</Code>
        </AlreadyTicketed>
        <ETicketNumber elementId="pnr-33" id="33" index="2">TE 5555588040243-RU IVANO/I 2FRH*AWT 1456/31JAN*D</ETicketNumber>
        <ETicketNumber elementId="pnr-34" id="34" index="3">TE 5555588040244-RU IVANO/E 2FRH*AWT 1456/31JAN*D</ETicketNumber>
        <ETicketNumber elementId="pnr-43" id="43" index="4">TE 5555588040245-RU IVANO/A 2FRH*AWT 1456/31JAN*D</ETicketNumber>
        <ETicketNumber elementId="pnr-49" id="49" index="5">TE 5555588040246-RU IVANO/E 2FRH*AWT 1456/31JAN*D</ETicketNumber>
        <TicketDetails elementId="pnr-33" id="33" index="2">
          <OriginalTicketDetails>TE 5555588040243-RU IVANO/I 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>5555588040243</TicketNumber>
          <PassengerName>IVANO/I</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2020-01-31T14:56:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-34" id="34" index="3">
          <OriginalTicketDetails>TE 5555588040244-RU IVANO/E 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>5555588040244</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2020-01-31T14:56:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-43" id="43" index="4">
          <OriginalTicketDetails>TE 5555588040245-RU IVANO/A 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>5555588040245</TicketNumber>
          <PassengerName>IVANO/A</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2020-01-31T14:56:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-49" id="49" index="5">
          <OriginalTicketDetails>TE 5555588040246-RU IVANO/E 2FRH*AWT 1456/31JAN*D</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>5555588040246</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2020-01-31T14:56:00</Timestamp>
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
      <Remark elementId="pnr-26" id="26" index="1" type="REG">
        <RemarkLines>
          <RemarkLine>
            <Text>TEXT REMARK</Text>
          </RemarkLine>
        </RemarkLines>
      </Remark>
      <Remark elementId="pnr-35" id="35" index="2" type="REG">
        <RemarkLines>
          <RemarkLine>
            <Text>XXTAW/</Text>
          </RemarkLine>
        </RemarkLines>
      </Remark>
      <Remark elementId="pnr-44" id="44" index="3" type="REG">
        <RemarkLines>
          <RemarkLine>
            <Text>XXTAW/</Text>
          </RemarkLine>
        </RemarkLines>
      </Remark>
      <Remark elementId="pnr-50" id="50" index="4" type="REG">
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
      <AccountingLine elementId="pnr-31" id="31" index="1">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>SU</AirlineDesignator>
        <DocumentNumber>5588040243</DocumentNumber>
        <CommissionAmount>580</CommissionAmount>
        <BaseFare>58000</BaseFare>
        <TaxAmount>6008</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOV IVAN MR</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>D</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-32" id="32" index="2">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>SU</AirlineDesignator>
        <DocumentNumber>5588040244</DocumentNumber>
        <CommissionAmount>580</CommissionAmount>
        <BaseFare>58000</BaseFare>
        <TaxAmount>6008</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOVA ELENA MS</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>D</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-42" id="42" index="3">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>SU</AirlineDesignator>
        <DocumentNumber>5588040245</DocumentNumber>
        <CommissionAmount>435</CommissionAmount>
        <BaseFare>43500</BaseFare>
        <TaxAmount>5704</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOV ANDREY CHD</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>D</TarriffBasis>
      </AccountingLine>
      <AccountingLine elementId="pnr-48" id="48" index="4">
        <FareApplication>ONE</FareApplication>
        <FormOfPaymentCode>CA</FormOfPaymentCode>
        <AirlineDesignator>SU</AirlineDesignator>
        <DocumentNumber>5588040246</DocumentNumber>
        <CommissionAmount>0</CommissionAmount>
        <BaseFare>0</BaseFare>
        <TaxAmount>0</TaxAmount>
        <GSTCode>C</GSTCode>
        <GSTAmount>0</GSTAmount>
        <PassengerName>IVANOVA EKATERINA INF</PassengerName>
        <NumberOfConjunctedDocuments>1</NumberOfConjunctedDocuments>
        <TarriffBasis>D</TarriffBasis>
      </AccountingLine>
    </AccountingLines>
    <AssociationMatrices>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-2.1"/>
        <Child ref="pnr-31">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-33">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-4.2"/>
        <Child ref="pnr-32">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-34">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-6.3"/>
        <Child ref="pnr-42">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-43">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
      <AssociationMatrix>
        <Name>PersonIDType</Name>
        <Parent ref="pnr-8.4"/>
        <Child ref="pnr-48">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
        <Child ref="pnr-49">
          <AssociationRule name="MoveOnDivide" value="ON"/>
        </Child>
      </AssociationMatrix>
    </AssociationMatrices>
    <OpenReservationElements>
      <or:OpenReservationElement elementId="pnr-9" id="9" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>INF</FreeText>
          <FullText>AA INF</FullText>
        </ServiceRequest>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>EKATERINA</FirstName>
          <ReferenceId>4</ReferenceId>
          <NameRefNumber>04.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-29" id="29" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
          <FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
        </ServiceRequest>
        <SegmentAssociation SegmentAssociationId="-1" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1138</FlightNumber>
            <DepartureDate>2020-09-01</DepartureDate>
            <BoardPoint>SVO</BoardPoint>
            <OffPoint>AER</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-30" id="30" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
          <FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-19" id="19" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
          <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-20" id="20" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/79851234567/RU</FreeText>
          <FullText>CTCM SU HK1/79851234567/RU</FullText>
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
      <or:OpenReservationElement elementId="pnr-21" id="21" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <Comment>COM/RU</Comment>
          <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
          <FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
      <or:OpenReservationElement elementId="pnr-22" id="22" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-23" id="23" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <ReferenceId>2</ReferenceId>
          <NameRefNumber>02.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-24" id="24" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <ReferenceId>3</ReferenceId>
          <NameRefNumber>03.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-25" id="25" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
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
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-38" id="38" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/5555588040243C2</FreeText>
          <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040243C2</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <ReferenceId>1</ReferenceId>
          <NameRefNumber>01.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-40" id="40" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/5555588040244C2</FreeText>
          <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040244C2</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <ReferenceId>2</ReferenceId>
          <NameRefNumber>02.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-46" id="46" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/5555588040245C2</FreeText>
          <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040245C2</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
          </AirSegment>
        </SegmentAssociation>
        <NameAssociation xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <LastName>IVANOV</LastName>
          <FirstName>ANDREY</FirstName>
          <ReferenceId>3</ReferenceId>
          <NameRefNumber>03.01</NameRefNumber>
        </NameAssociation>
      </or:OpenReservationElement>
      <or:OpenReservationElement elementId="pnr-52" id="52" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/INF5555588040246C2</FreeText>
          <FullText>TKNE SU HK1 AERSVO1129Y08SEP/INF5555588040246C2</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="17" SegmentAssociationId="3" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>SU</CarrierCode>
            <FlightNumber>1129</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AER</BoardPoint>
            <OffPoint>SVO</OffPoint>
            <ClassOfService>Y</ClassOfService>
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
<UpdatePassengerNameRecordRQ version="1.0.0" xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <Itinerary id="CSCQGD"/>
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
    <Success timeStamp="2020-01-31T06:00:05.636-06:00"/>
    <Warning timeStamp="2020-01-31T06:00:04.467-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: INFANT DETAILS REQUIRED IN SSR - ENTER 3INFT/...</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2020-01-31T06:00:04.891-06:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="CSCQGD"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <AccountingInfo Id="31">
        <Airline Code="SU"/>
        <BaseFare Amount="58000" CurrencyCode="RUB"/>
        <DocumentInfo>
          <Document Number="5588040243"/>
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
          <Document Number="5588040244"/>
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
          <Document Number="5588040245"/>
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
          <Document Number="5588040246"/>
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
                <Text>2FRH 9LSC*AWT 1455/31JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-31T14:55" TaxExempt="false" ValidatingCarrier="SU">
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
                <Text>2FRH 9LSC*AWT 1455/31JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-31T14:55" TaxExempt="false" ValidatingCarrier="SU">
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
                <Text>2FRH 9LSC*AWT 1455/31JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-31T14:55" TaxExempt="false" ValidatingCarrier="SU">
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
                <Text>2FRH 9LSC*AWT 1459/31JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WFRF" RPH="4" StatusCode="A" StoredDateTime="2020-01-31T14:55" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="58000" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="6008" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">304RI</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">304RI</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2600CP</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="64008" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="58000"/>
                    <Taxes>
                      <Tax Amount="6008"/>
                    </Taxes>
                    <TotalFare Amount="64008"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WFRF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>RUB58000 NONREFUNDABLE</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/YCLR"/>
                  <FareCalculation>
                    <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
                  </FareCalculation>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="08-31T06:05" FlightNumber="1120" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1120"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-08-31</NotValidAfter>
                      <NotValidBefore>2020-08-31</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="0" Status="OK">
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
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 26AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 26AUG</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="01.01">IVANOV/IVAN MR</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="217500.00"/>
            <Taxes>
              <Tax Amount="23728.00"/>
            </Taxes>
            <TotalFare Amount="241228.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="08-31T08:35" CodeShare="false" DayOfWeekInd="1" DepartureDateTime="2020-08-31T06:05" ElapsedTime="02.30" FlightNumber="1120" Id="54" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-31T05:59:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AER"/>
              <Equipment AirEquipType="32A"/>
              <MarketingAirline Code="SU" FlightNumber="1120" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1120" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <SupplierRef ID="DCSU*BBDOPG"/>
              <UpdatedArrivalTime>08-31T08:35</UpdatedArrivalTime>
              <UpdatedDepartureTime>08-31T06:05</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="1">
                  <DepartureAirport>SVO</DepartureAirport>
                  <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
                  <DepartureTerminalCode>B</DepartureTerminalCode>
                  <ArrivalAirport>AER</ArrivalAirport>
                  <EquipmentType>32A</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1120</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>150</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*BBDOPG</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-08-31T06:05:00</DepartureDateTime>
                  <ArrivalDateTime>2020-08-31T08:35:00</ArrivalDateTime>
                  <FlightNumber>1120</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-31T05:59:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-31T05:55:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AER"/>
              <SupplierRef ID="DCSU*BBDOPG"/>
              <UpdatedArrivalTime>09-08T05:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AER</DepartureAirport>
                  <ArrivalAirport>SVO</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
                  <ArrivalTerminalCode>B</ArrivalTerminalCode>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1129</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>155</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*BBDOPG</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
                  <FlightNumber>1129</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-31T05:55:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="T-31JAN-2FRH*AWT"/>
        <Ticketing RPH="02" eTicketNumber="TE 5555588040243-RU IVANO/I 2FRH*AWT 1456/31JAN*D">
          <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
        </Ticketing>
        <Ticketing RPH="03" eTicketNumber="TE 5555588040244-RU IVANO/E 2FRH*AWT 1456/31JAN*D">
          <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
        </Ticketing>
        <Ticketing RPH="04" eTicketNumber="TE 5555588040245-RU IVANO/A 2FRH*AWT 1456/31JAN*D">
          <PersonName NameNumber="3.1">IVANOV ANDREY</PersonName>
        </Ticketing>
        <Ticketing RPH="05" eTicketNumber="TE 5555588040246-RU IVANO/E 2FRH*AWT 1456/31JAN*D">
          <PersonName NameNumber="4.1">I IVANOVA EKATERINA</PersonName>
        </Ticketing>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="CSCQGD" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-31T05:55" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-31T06:00" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="5"/>
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
      <SpecialServiceInfo Id="19" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="38" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 AERSVO1129Y08SEP/5555588040243C2</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="40" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1 AERSVO1129Y08SEP/5555588040244C2</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="46" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1 AERSVO1129Y08SEP/5555588040245C2</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="52" RPH="011" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="TKNE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1 AERSVO1129Y08SEP/INF5555588040246C2</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="56" RPH="012" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="57" RPH="013" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="58" RPH="014" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="59" RPH="015" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="60" RPH="016" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="61" RPH="017" Type="GFX">
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
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
        <OpenReservationElement elementId="pnr-or-54" id="54"/>
        <OpenReservationElement elementId="pnr-or-54" id="54"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
        <OpenReservationElement elementId="pnr-38" id="38" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/5555588040243C2</FreeText>
            <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040243C2</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
        <OpenReservationElement elementId="pnr-40" id="40" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/5555588040244C2</FreeText>
            <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040244C2</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-46" id="46" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/5555588040245C2</FreeText>
            <FullText>TKNE SU HK1 AERSVO1129Y08SEP/5555588040245C2</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-52" id="52" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/INF5555588040246C2</FreeText>
            <FullText>TKNE SU HK1 AERSVO1129Y08SEP/INF5555588040246C2</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
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
        <OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
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
        <OpenReservationElement elementId="pnr-57" id="57" type="SRVC">
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
        <OpenReservationElement elementId="pnr-58" id="58" type="SRVC">
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
        <OpenReservationElement elementId="pnr-59" id="59" type="SRVC">
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
        <OpenReservationElement elementId="pnr-60" id="60" type="SRVC">
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
        <OpenReservationElement elementId="pnr-61" id="61" type="SRVC">
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

## Оформление билетов

Для завершения обмена билетов необходимо оформить новые билеты по сохраненным PQR. Подробнее о процессе оформления билетов см. [Оформление билетов и EMD](issue-ticket.md). Обратите внимание на раздел [Особенности оформления билетов в обмен](issue-ticket.md#osobennosti_oformleniya_biletov_v_obmen).
