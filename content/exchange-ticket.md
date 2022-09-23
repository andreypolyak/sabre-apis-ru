---
title: Обмен билетов
---

{{< toc >}}

## Введение

Подробнее об условиях выполнения обменов билетов см. [Обмены и возвраты](exchanges-refunds.html#добровольный-обмен-билетов).

Для подготовки бронирования и расчета стоимости обмена используется сервис [ExchangeBookingRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/exchange_booking). Сервис автоматизирует многие процессы, связанные с подготовкой к обмену билетов:
- переход в другой PCC
- чтение бронирование
- удаление старых и бронирование новых сегментов
- расчет стоимости обмена и сохранение масок расчета обмена — PQR (Price Quote Reissue)
- сохранение бронирования

После вызова этого сервиса необходимо будет оформить билеты по сохраненным PQR (см. [Оформление билетов и EMD](issue-ticket.html#особенности-оформления-билетов-в-обмен)).

## Переход в другой PCC

Для обмена билетов в других PCC (т.е. не в iPCC, в котором была создана сессия или токен) необходимо указать его в качестве значения атрибута ```/ExchangeBookingRQ/@targetCity```.

{{< hint warning >}}
Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).
{{< /hint >}}

## Чтение бронирования

Код бронирования (PNR Record Locator), в котором необходимо произвести обмен билетов, указывается в качестве значения атрибута ```/ExchangeBookingRQ/Itinerary/@id```.

## Выбор сегментов

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

## Проверка минимального стыковочного времени

Для проверки минимального стыковочного времени в запросе необходимо указать значение ```true``` у атрибута ```/ExchangeBookingRQ/AirBook/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку.

## Отправка SSR сообщений

После отмены старых сегментов и бронирования новых сегментов необходимо повторно отправить все SSR, которые должны быть привязаны к новым сегментам.

{{< hint warning >}}
Обратите внимание на то, что повторно требуется отправить только те SSR, которые "привязываются" к сегментам (например, ```DOCS```, ```DOCO```, ```DOCA```, ```INFT```, ```CHLD```, ```CTCM```, ```CTCE``` и другие). SSR, которые не привязываются к сегментам (например, ```FOID```), а также OSI сообщения повторно отправлять не требуется.
{{< /hint >}}

Для отправки SSR сообщений типа ```DOCS```, ```DOCO``` и ```DOCA``` необходимо указать элемент ```/ExchangeBookingRQ/SpecialService/SpecialServiceInfo/AdvancePassenger``` (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.html#паспортные-данные-ssr-docs)).

Для отправки других SSR сообщений необходимо указать элемент ```/ExchangeBookingRQ/SpecialService/SpecialServiceInfo/Service``` (подробнее см. [Создание бронирований в 1 шаг](create-booking-1step.html#другие-ssr-сообщения)).

## Расчет стоимости обмена

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

## Сравнение стоимости обмена с заданной

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

## Сохранение маски расчета стоимости обмена

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

## Завершающая обработка бронирования

В запросе необходимо указать значение поля Received From для сохранения бронирования в атрибуте ```/ExchangeBookingRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom```. Поле используется для идентификации инициатора изменений в истории бронирования.

Для получения в ответе информации о созданной PQR необходимо указать значение ```true``` у атрибута ```/ExchangeBookingRQ/PostProcessing/@returnPQRInfo```.

Сервис позволяет прочитать полученное бронирование после успешного завершения работы всех предыдущих операций (включая сохранение бронирования) и вернуть его содержимое в ответе. Для этого необходимо добавить элемент ```/ExchangeBookingRQ/PostProcessing/@redisplayReservation```.

## Задержка между обработкой билетов

В случае обмена нескольких билетов в одном бронировании, чтобы избежать проблем одновременного изменения бронирования (Simultaneous Changes) рекомендуется указать задержку между обработками билетов в качестве значения атрибута ```/ExchangeBookingRQ/@multipleExchangesWaitInterval``` (задается в миллисекундах).

## Пример

{{< details title="Пример запроса" >}}
```XML
<ExchangeBookingRQ multipleExchangesWaitInterval="3000" targetCity="2FRH" version="1.0.1" xmlns="http://services.sabre.com/sp/exchange/booking/v1_0_1">
  <Itinerary id="EHNGSD">
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
      <FlightSegment DepartureDateTime="2022-11-24T00:00:00" FlightNumber="4067" NumberInParty="3" ResBookDesigCode="D" Status="NN">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="4067"/>
        <MarriageGrp>O</MarriageGrp>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-11-25T00:00:00" FlightNumber="19" NumberInParty="3" ResBookDesigCode="D" Status="NN">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="19"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </AirBook>
  <AutomatedExchanges>
    <ExchangeComparison OriginalTicketNumber="6075259207312">
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
    <PriceComparison amountSpecified="124025">
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
    <ExchangeComparison OriginalTicketNumber="6075259207313">
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
    <PriceComparison amountSpecified="124025">
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
    <ExchangeComparison OriginalTicketNumber="6075259207314">
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
    <PriceComparison amountSpecified="145220">
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
    <ExchangeComparison OriginalTicketNumber="6075259207315">
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
    <PriceComparison amountSpecified="19475">
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
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-09-23T10:40:16.666-05:00"/>
    <Warning timeStamp="2022-09-23T10:39:54.608-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ExchangeConfirmation PQR_Number="04">
    <PriceComparison amountReturned="124025" amountSpecified="124025"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="05">
    <PriceComparison amountReturned="124025" amountSpecified="124025"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="06">
    <PriceComparison amountReturned="145220" amountSpecified="145220"/>
  </ExchangeConfirmation>
  <ExchangeConfirmation PQR_Number="07">
    <PriceComparison amountReturned="19475" amountSpecified="19475"/>
  </ExchangeConfirmation>
  <PriceQuoteReissue PQR_Number="4">
    <MiscInformation>
      <SignatureLine CreateDateTime="2022-09-23T18:39" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6075259207312" PQR_Status="E" TicketValue="191601">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOV/IVAN MR</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 124025</Text>
          <TransactionInformation Amount="124025" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON3635.19EY X/AUH Q25.00EY SYD1414.61NUC507</Text>
          <Text>4.80END ROE1.439264</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="7304.00" CurrencyCode="AUD"/>
          <EquivFare Amount="299465" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="16161">
            <Tax Amount="2460" PaidInd="PD" TaxCode="AU"/>
            <Tax Amount="2632" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="168" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1166" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="5838" PaidInd="PD" TaxCode="GB"/>
            <Tax Amount="3897" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="315626" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="4067" RPH="01" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AU"/>
            <MarketingAirline Code="EY" FlightNumber="4067"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T08:20" FlightNumber="19" RPH="02" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AU"/>
            <MarketingAirline Code="EY" FlightNumber="19"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T19:50" FlightNumber="26" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="26"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-09T10:50" FlightNumber="59" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="59"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-09</NotValidAfter>
              <NotValidBefore>2022-12-09</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
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
      <SignatureLine CreateDateTime="2022-09-23T18:39" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6075259207313" PQR_Status="E" TicketValue="191601">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOVA/ELENA M</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 124025</Text>
          <TransactionInformation Amount="124025" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON3635.19EY X/AUH Q25.00EY SYD1414.61NUC507</Text>
          <Text>4.80END ROE1.439264</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="7304.00" CurrencyCode="AUD"/>
          <EquivFare Amount="299465" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="16161">
            <Tax Amount="2460" PaidInd="PD" TaxCode="AU"/>
            <Tax Amount="2632" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="168" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1166" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="5838" PaidInd="PD" TaxCode="GB"/>
            <Tax Amount="3897" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="315626" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="4067" RPH="01" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AU"/>
            <MarketingAirline Code="EY" FlightNumber="4067"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T08:20" FlightNumber="19" RPH="02" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AU"/>
            <MarketingAirline Code="EY" FlightNumber="19"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T19:50" FlightNumber="26" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="26"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-09T10:50" FlightNumber="59" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AU"/>
            <MarketingAirline Code="EY" FlightNumber="59"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-09</NotValidAfter>
              <NotValidBefore>2022-12-09</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
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
      <SignatureLine CreateDateTime="2022-09-23T18:40" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6075259207314" PQR_Status="E" TicketValue="141238">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOV/ANDREY C</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 145220</Text>
          <TransactionInformation Amount="145220" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON3635.19EY X/AUH Q25.00EY SYD1060.95NUC472</Text>
          <Text>1.14END ROE1.439264</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="6795.00" CurrencyCode="AUD"/>
          <EquivFare Amount="278595" CurrencyCode="RUB"/>
          <Taxes TaxCode="XT" TotalAmount="7863">
            <Tax Amount="2632" PaidInd="PD" TaxCode="WY"/>
            <Tax Amount="168" PaidInd="PD" TaxCode="ZR"/>
            <Tax Amount="1166" PaidInd="PD" TaxCode="F6"/>
            <Tax Amount="3897" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="286458" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="4067" RPH="01" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="4067"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T08:20" FlightNumber="19" RPH="02" ResBookDesigCode="D">
            <BaggageAllowance Number="40K"/>
            <FareBasis Code="DXAC4AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="19"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T19:50" FlightNumber="26" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="26"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-09T10:50" FlightNumber="59" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="35K"/>
            <FareBasis Code="YLXF2AUCH"/>
            <MarketingAirline Code="EY" FlightNumber="59"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-09</NotValidAfter>
              <NotValidBefore>2022-12-09</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
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
      <SignatureLine CreateDateTime="2022-09-23T18:40" CreationAgent="AWT" HomePseudoCityCode="9LSC" PseudoCityCode="2FRH" Source="SYS"/>
    </MiscInformation>
    <PricedItinerary InputMessage="WFRF">
      <AirItineraryPricingInfo>
        <ExchangeDetails CurrencyCode="RUB" DocNumber="6075259207315" PQR_Status="E" TicketValue="29157">
          <ChangeFeeInformation Amount="N/A"/>
          <PersonName>
            <Surname>IVANOVA/EKATERI</Surname>
          </PersonName>
          <Text>FEE TO BE COLLECTED ON SEPARATE DOCUMENT N/A</Text>
          <Text>TOTAL AMOUNT COLLECTED THIS TRANSACTION 19475</Text>
          <TransactionInformation Amount="19475" CurrencyCode="RUB">
            <Text>A/C</Text>
          </TransactionInformation>
        </ExchangeDetails>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON545.27EY X/AUH EY SYD212.19NUC757.46END R</Text>
          <Text>OE1.439264</Text>
        </FareCalculation>
        <ItinTotalFare>
          <BaseFare Amount="1091.00" CurrencyCode="AUD"/>
          <EquivFare Amount="44735" CurrencyCode="RUB"/>
          <Taxes TaxCode="UB" TotalAmount="3897">
            <Tax Amount="3897" PaidInd="PD" TaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="48632" CurrencyCode="RUB"/>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="01"/>
        <PTC_FareBreakdown>
          <FlightSegment ConnectionInd="O" DepartureDateTime="11-24T23:25" FlightNumber="4067" RPH="01" ResBookDesigCode="D">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="DXAC4AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="4067"/>
            <OriginLocation LocationCode="SYD"/>
            <ValidityDates>
              <NotValidAfter>2022-11-24</NotValidAfter>
              <NotValidBefore>2022-11-24</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="11-25T08:20" FlightNumber="19" RPH="02" ResBookDesigCode="D">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="DXAC4AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="19"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-11-25</NotValidAfter>
              <NotValidBefore>2022-11-25</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T19:50" FlightNumber="26" RPH="03" ResBookDesigCode="Y">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="YLXF2AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="26"/>
            <OriginLocation LocationCode="LHR"/>
            <ValidityDates>
              <NotValidAfter>2022-12-08</NotValidAfter>
              <NotValidBefore>2022-12-08</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment ConnectionInd="X" DepartureDateTime="12-09T10:50" FlightNumber="59" RPH="04" ResBookDesigCode="Y">
            <BaggageAllowance Number="10K"/>
            <FareBasis Code="YLXF2AUIN"/>
            <MarketingAirline Code="EY" FlightNumber="59"/>
            <OriginLocation LocationCode="AUH"/>
            <ValidityDates>
              <NotValidAfter>2022-12-09</NotValidAfter>
              <NotValidBefore>2022-12-09</NotValidBefore>
            </ValidityDates>
          </FlightSegment>
          <FlightSegment>
            <OriginLocation LocationCode="SYD"/>
          </FlightSegment>
        </PTC_FareBreakdown>
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
      <RecordLocator>EHNGSD</RecordLocator>
      <CreationTimestamp>2022-09-23T10:38:00</CreationTimestamp>
      <SystemCreationTimestamp>2022-09-23T10:38:00</SystemCreationTimestamp>
      <CreationAgentID>AWT</CreationAgentID>
      <UpdateTimestamp>2022-09-23T10:40:12</UpdateTimestamp>
      <PNRSequence>6</PNRSequence>
      <FlightsRange End="2022-12-09T19:55:00" Start="2022-11-24T23:25:00"/>
      <DivideSplitDetails/>
      <EstimatedPurgeTimestamp>2022-12-24T00:00:00</EstimatedPurgeTimestamp>
      <UpdateToken>1f988e40dcab032c9fbb656771a6c902310e55fa9e78f408</UpdateToken>
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
            <GenericSpecialRequest id="65" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 SYDAUH4067D24NOV/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="66" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 AUHLHR0019D25NOV/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="67" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 LHRAUH0026Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="68" msgType="S" type="G">
              <Code>INFT</Code>
              <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
              <ActionCode>NN</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>INFT EY NN1 AUHSYD0059Y09DEC/IVANOVA/EKATERINA/20FEB22</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="69" msgType="S" type="G">
              <Code>CTCM</Code>
              <FreeText>/79851234567/RU</FreeText>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <AirlineCode>EY</AirlineCode>
              <FullText>CTCM EY HK1/79851234567/RU</FullText>
            </GenericSpecialRequest>
            <GenericSpecialRequest id="70" msgType="S" type="G">
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
            <APISRequest>
              <DOCSEntry id="61" type="G">
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
              <DOCSEntry id="64" type="G">
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
              <TicketNumber>6075259207312C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-09T00:00:00</DateOfTravel>
              <TicketNumber>6075259207312C4</TicketNumber>
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
              <TicketNumber>INF6075259207315C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-09T00:00:00</DateOfTravel>
              <TicketNumber>INF6075259207315C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-32" id="32" index="1">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>5259207312</DocumentNumber>
              <CommissionAmount>1754</CommissionAmount>
              <BaseFare>175440</BaseFare>
              <TaxAmount>16161</TaxAmount>
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
            <ETicketNumber elementId="pnr-36" id="36" index="2">TE 6075259207312-RU IVANO/I 2FRH*AWT 1838/23SEP*I</ETicketNumber>
            <TicketDetails elementId="pnr-36" id="36" index="2">
              <OriginalTicketDetails>TE 6075259207312-RU IVANO/I 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6075259207312</TicketNumber>
              <PassengerName>IVANO/I</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-09-23T18:38:00</Timestamp>
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
            <APISRequest>
              <DOCSEntry id="62" type="G">
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
              <TicketNumber>6075259207313C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-09T00:00:00</DateOfTravel>
              <TicketNumber>6075259207313C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-33" id="33" index="2">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>5259207313</DocumentNumber>
              <CommissionAmount>1754</CommissionAmount>
              <BaseFare>175440</BaseFare>
              <TaxAmount>16161</TaxAmount>
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
            <ETicketNumber elementId="pnr-37" id="37" index="3">TE 6075259207313-RU IVANO/E 2FRH*AWT 1838/23SEP*I</ETicketNumber>
            <TicketDetails elementId="pnr-37" id="37" index="3">
              <OriginalTicketDetails>TE 6075259207313-RU IVANO/E 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6075259207313</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-09-23T18:38:00</Timestamp>
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
            <APISRequest>
              <DOCSEntry id="63" type="G">
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
              <TicketNumber>6075259207314C3</TicketNumber>
            </TicketingRequest>
            <TicketingRequest>
              <TicketType>G</TicketType>
              <ValidatingCarrier>EY</ValidatingCarrier>
              <ActionCode>HK</ActionCode>
              <NumberInParty>1</NumberInParty>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <DateOfTravel>2022-12-09T00:00:00</DateOfTravel>
              <TicketNumber>6075259207314C4</TicketNumber>
            </TicketingRequest>
          </SpecialRequests>
          <Seats/>
          <AccountingLines>
            <AccountingLine elementId="pnr-34" id="34" index="3">
              <FareApplication>ONE</FareApplication>
              <FormOfPaymentCode>CA</FormOfPaymentCode>
              <AirlineDesignator>EY</AirlineDesignator>
              <DocumentNumber>5259207314</DocumentNumber>
              <CommissionAmount>1334</CommissionAmount>
              <BaseFare>133375</BaseFare>
              <TaxAmount>7863</TaxAmount>
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
            <ETicketNumber elementId="pnr-38" id="38" index="4">TE 6075259207314-RU IVANO/A 2FRH*AWT 1838/23SEP*I</ETicketNumber>
            <TicketDetails elementId="pnr-38" id="38" index="4">
              <OriginalTicketDetails>TE 6075259207314-RU IVANO/A 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6075259207314</TicketNumber>
              <PassengerName>IVANO/A</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-09-23T18:38:00</Timestamp>
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
              <DocumentNumber>5259207315</DocumentNumber>
              <CommissionAmount>253</CommissionAmount>
              <BaseFare>25260</BaseFare>
              <TaxAmount>3897</TaxAmount>
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
            <ETicketNumber elementId="pnr-39" id="39" index="5">TE 6075259207315-RU IVANO/E 2FRH*AWT 1838/23SEP*I</ETicketNumber>
            <TicketDetails elementId="pnr-39" id="39" index="5">
              <OriginalTicketDetails>TE 6075259207315-RU IVANO/E 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
              <TransactionIndicator>TE</TransactionIndicator>
              <TicketNumber>6075259207315</TicketNumber>
              <PassengerName>IVANO/E</PassengerName>
              <AgencyLocation>2FRH</AgencyLocation>
              <DutyCode>*</DutyCode>
              <AgentSine>AWT</AgentSine>
              <Timestamp>2022-09-23T18:38:00</Timestamp>
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
            <OperatingFlightNumber>4067</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>4067</MarketingFlightNumber>
            <OperatingClassOfService>D</OperatingClassOfService>
            <MarketingClassOfService>D</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>3</Group>
              <Sequence>1</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EHNGKF</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-11-24T23:25:00</DepartureDateTime>
            <ArrivalDateTime>2022-11-25T06:40:00</ArrivalDateTime>
            <FlightNumber>4067</FlightNumber>
            <ClassOfService>D</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="65" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 SYDAUH4067D24NOV/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>true</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-09-23T10:39:00</SegmentBookedDate>
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
            <ArrivalTerminalName>TERMINAL 4</ArrivalTerminalName>
            <ArrivalTerminalCode>4</ArrivalTerminalCode>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>0019</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0019</MarketingFlightNumber>
            <OperatingClassOfService>D</OperatingClassOfService>
            <MarketingClassOfService>D</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>3</Group>
              <Sequence>2</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EHNGKF</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-11-25T08:20:00</DepartureDateTime>
            <ArrivalDateTime>2022-11-25T12:00:00</ArrivalDateTime>
            <FlightNumber>0019</FlightNumber>
            <ClassOfService>D</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="66" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 AUHLHR0019D25NOV/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>true</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-09-23T10:39:00</SegmentBookedDate>
            <ElapsedTime>07.40</ElapsedTime>
            <AirMilesFlown>3420</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
        <Segment id="18" sequence="3">
          <Air id="18" isPast="false" segmentAssociationId="4" sequence="3">
            <DepartureAirport>LHR</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <DepartureTerminalName>TERMINAL 4</DepartureTerminalName>
            <DepartureTerminalCode>4</DepartureTerminalCode>
            <ArrivalAirport>AUH</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
            <ArrivalTerminalCode>3</ArrivalTerminalCode>
            <OperatingAirlineCode>EY</OperatingAirlineCode>
            <OperatingAirlineShortName>ETIHAD AIRWAYS</OperatingAirlineShortName>
            <OperatingFlightNumber>0026</OperatingFlightNumber>
            <EquipmentType>789</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0026</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>2</Group>
              <Sequence>1</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EHNGKF</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-12-08T19:50:00</DepartureDateTime>
            <ArrivalDateTime>2022-12-09T06:35:00</ArrivalDateTime>
            <FlightNumber>0026</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="44" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0026Y08DEC/6075259207312C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207312</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207312C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="48" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0026Y08DEC/6075259207313C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207313</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207313C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="52" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0026Y08DEC/6075259207314C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207314</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207314C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="56" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 LHRAUH0026Y08DEC/INF6075259207315C3</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>INF6075259207</TicketNumber>
                <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/INF6075259207315C3</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="67" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 LHRAUH0026Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>true</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-09-23T10:38:00</SegmentBookedDate>
            <ElapsedTime>06.45</ElapsedTime>
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
            <OperatingFlightNumber>0059</OperatingFlightNumber>
            <EquipmentType>781</EquipmentType>
            <MarketingAirlineCode>EY</MarketingAirlineCode>
            <MarketingFlightNumber>0059</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <MarriageGrp>
              <Ind>0</Ind>
              <Group>2</Group>
              <Sequence>2</Sequence>
            </MarriageGrp>
            <Seats/>
            <AirlineRefId>DCEY*EHNGKF</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2022-12-09T10:50:00</DepartureDateTime>
            <ArrivalDateTime>2022-12-09T19:55:00</ArrivalDateTime>
            <FlightNumber>0059</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>3</NumberInParty>
            <SegmentSpecialRequests>
              <GenericSpecialRequest id="45" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0059Y09DEC/6075259207312C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207312</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207312C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="49" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0059Y09DEC/6075259207313C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207313</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207313C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="53" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0059Y09DEC/6075259207314C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>6075259207314</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207314C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="57" msgType="S" type="G">
                <Code>TKNE</Code>
                <FreeText>EY HK1 AUHSYD0059Y09DEC/INF6075259207315C4</FreeText>
                <ActionCode>HK</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <TicketNumber>INF6075259207</TicketNumber>
                <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/INF6075259207315C4</FullText>
              </GenericSpecialRequest>
              <GenericSpecialRequest id="68" msgType="S" type="G">
                <Code>INFT</Code>
                <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
                <ActionCode>NN</ActionCode>
                <NumberInParty>1</NumberInParty>
                <AirlineCode>EY</AirlineCode>
                <FullText>INFT EY NN1 AUHSYD0059Y09DEC/IVANOVA/EKATERINA/20FEB22</FullText>
              </GenericSpecialRequest>
            </SegmentSpecialRequests>
            <inboundConnection>true</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2022-09-23T10:38:00</SegmentBookedDate>
            <ElapsedTime>03.05</ElapsedTime>
            <AirMilesFlown>7506</AirMilesFlown>
            <FunnelFlight>false</FunnelFlight>
            <ChangeOfGauge>false</ChangeOfGauge>
          </Air>
        </Segment>
      </Segments>
      <TicketingInfo>
        <AlreadyTicketed elementId="pnr-41" id="41" index="1">
          <Code>T-23SEP-2FRH*AWT</Code>
        </AlreadyTicketed>
        <ETicketNumber elementId="pnr-36" id="36" index="2">TE 6075259207312-RU IVANO/I 2FRH*AWT 1838/23SEP*I</ETicketNumber>
        <ETicketNumber elementId="pnr-37" id="37" index="3">TE 6075259207313-RU IVANO/E 2FRH*AWT 1838/23SEP*I</ETicketNumber>
        <ETicketNumber elementId="pnr-38" id="38" index="4">TE 6075259207314-RU IVANO/A 2FRH*AWT 1838/23SEP*I</ETicketNumber>
        <ETicketNumber elementId="pnr-39" id="39" index="5">TE 6075259207315-RU IVANO/E 2FRH*AWT 1838/23SEP*I</ETicketNumber>
        <TicketDetails elementId="pnr-36" id="36" index="2">
          <OriginalTicketDetails>TE 6075259207312-RU IVANO/I 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6075259207312</TicketNumber>
          <PassengerName>IVANO/I</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-09-23T18:38:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-37" id="37" index="3">
          <OriginalTicketDetails>TE 6075259207313-RU IVANO/E 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6075259207313</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-09-23T18:38:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-38" id="38" index="4">
          <OriginalTicketDetails>TE 6075259207314-RU IVANO/A 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6075259207314</TicketNumber>
          <PassengerName>IVANO/A</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-09-23T18:38:00</Timestamp>
          <PaymentType>*</PaymentType>
        </TicketDetails>
        <TicketDetails elementId="pnr-39" id="39" index="5">
          <OriginalTicketDetails>TE 6075259207315-RU IVANO/E 2FRH*AWT 1838/23SEP*I</OriginalTicketDetails>
          <TransactionIndicator>TE</TransactionIndicator>
          <TicketNumber>6075259207315</TicketNumber>
          <PassengerName>IVANO/E</PassengerName>
          <AgencyLocation>2FRH</AgencyLocation>
          <DutyCode>*</DutyCode>
          <AgentSine>AWT</AgentSine>
          <Timestamp>2022-09-23T18:38:00</Timestamp>
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
        <DocumentNumber>5259207312</DocumentNumber>
        <CommissionAmount>1754</CommissionAmount>
        <BaseFare>175440</BaseFare>
        <TaxAmount>16161</TaxAmount>
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
        <DocumentNumber>5259207313</DocumentNumber>
        <CommissionAmount>1754</CommissionAmount>
        <BaseFare>175440</BaseFare>
        <TaxAmount>16161</TaxAmount>
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
        <DocumentNumber>5259207314</DocumentNumber>
        <CommissionAmount>1334</CommissionAmount>
        <BaseFare>133375</BaseFare>
        <TaxAmount>7863</TaxAmount>
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
        <DocumentNumber>5259207315</DocumentNumber>
        <CommissionAmount>253</CommissionAmount>
        <BaseFare>25260</BaseFare>
        <TaxAmount>3897</TaxAmount>
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
          <FreeText>/6075259207312C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207312C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0026</FlightNumber>
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
          <FreeText>/6075259207312C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207312C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0059</FlightNumber>
            <DepartureDate>2022-12-09</DepartureDate>
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
          <FreeText>/6075259207313C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207313C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0026</FlightNumber>
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
          <FreeText>/6075259207313C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207313C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0059</FlightNumber>
            <DepartureDate>2022-12-09</DepartureDate>
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
          <FreeText>/6075259207314C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/6075259207314C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0026</FlightNumber>
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
          <FreeText>/6075259207314C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/6075259207314C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0059</FlightNumber>
            <DepartureDate>2022-12-09</DepartureDate>
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
          <FreeText>/INF6075259207315C3</FreeText>
          <FullText>TKNE EY HK1 LHRAUH0026Y08DEC/INF6075259207315C3</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0026</FlightNumber>
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
          <FreeText>/INF6075259207315C4</FreeText>
          <FullText>TKNE EY HK1 AUHSYD0059Y09DEC/INF6075259207315C4</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0059</FlightNumber>
            <DepartureDate>2022-12-09</DepartureDate>
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
      <or:OpenReservationElement elementId="pnr-61" id="61" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
      <or:OpenReservationElement elementId="pnr-62" id="62" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
      <or:OpenReservationElement elementId="pnr-63" id="63" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
      <or:OpenReservationElement elementId="pnr-64" id="64" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
      <or:OpenReservationElement elementId="pnr-65" id="65" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 SYDAUH4067D24NOV/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="59" SegmentAssociationId="6" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>4067</FlightNumber>
            <DepartureDate>2022-11-24</DepartureDate>
            <BoardPoint>SYD</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>D</ClassOfService>
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
      <or:OpenReservationElement elementId="pnr-66" id="66" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 AUHLHR0019D25NOV/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="60" SegmentAssociationId="7" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0019</FlightNumber>
            <DepartureDate>2022-11-25</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>LHR</OffPoint>
            <ClassOfService>D</ClassOfService>
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
      <or:OpenReservationElement elementId="pnr-67" id="67" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 LHRAUH0026Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="18" SegmentAssociationId="4" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0026</FlightNumber>
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
      <or:OpenReservationElement elementId="pnr-68" id="68" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
        <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
          <FullText>INFT EY NN1 AUHSYD0059Y09DEC/IVANOVA/EKATERINA/20FEB22</FullText>
        </ServiceRequest>
        <SegmentAssociation Id="19" SegmentAssociationId="5" xmlns="http://services.sabre.com/res/or/v1_11/sp">
          <AirSegment>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>0059</FlightNumber>
            <DepartureDate>2022-12-09</DepartureDate>
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
      <or:OpenReservationElement elementId="pnr-69" id="69" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
      <or:OpenReservationElement elementId="pnr-70" id="70" type="SRVC" xmlns:or="http://services.sabre.com/res/or/v1_11/sp">
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
