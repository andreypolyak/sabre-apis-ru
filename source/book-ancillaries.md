# Бронирование дополнительных услуг

*Для бронирования дополнительных услуг в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для бронирования дополнительных услуг и отправки SSR используется сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary).

#### Параметры запроса

В запросе необходимо указать:

- ```/UpdateReservationRQ/RequestType``` — тип запроса. Всегда значение ```Stateless```
- ```/UpdateReservationRQ/ReturnOptions/@IncludeUpdateDetails``` — признак получения деталей изменения бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReturnOptions/@RetrievePNR``` — признак получения состояния бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReservationUpdateList/Locator``` — код бронирования
- ```/UpdateReservationRQ/ReservationUpdateList/ReceivedFrom/AgentName``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

#### Бронирование дополнительных услуг

Для каждой бронируемой дополнительной услуги необходимо добавить элемент ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem/AncillaryServicesUpdate```, содержащий следующие элементы и атрибуты (в скобках обозначен соответствующий элемент из ответа на запрос к сервису [GetAncillaryOffersRQ](get-ancillaries.md)):

- ```/AncillaryServicesUpdate/@op``` — код типа операции. Всегда значение ```C``` (Create, создание)
- ```/AncillaryServicesUpdate/NameAssociationList``` — информация о пассажирах (одна услуга может быть забронирована сразу для нескольких пассажиров в том случае, если они имеют одинаковую категорию пассажира, а также количество требуемых услуг равно):
    - ```/NameAssociationList/NameAssociationTag/LastName``` — фамилия пассажира
    - ```/NameAssociationList/NameAssociationTag/FirstName``` — имя пассажира
    - ```/NameAssociationList/NameAssociationTag/NameRefNumber``` — номер пассажира
- ```/AncillaryServicesUpdate/SegmentAssociationList``` — информация о сегментах:
    - ```/SegmentAssociationList/SegmentAssociationTag/CarrierCode``` — маркетинговый перевозчик
    - ```/SegmentAssociationList/SegmentAssociationTag/FlightNumber``` — номер рейса
    - ```/SegmentAssociationList/SegmentAssociationTag/DepartureDate``` — дата вылета
    - ```/SegmentAssociationList/SegmentAssociationTag/BoardPoint``` — аэропорт отправления
    - ```/SegmentAssociationList/SegmentAssociationTag/OffPoint``` — аэропорт прибытия
    - ```/SegmentAssociationList/SegmentAssociationTag/ClassOfService``` — класс бронирования
    - ```/SegmentAssociationList/SegmentAssociationTag/BookingStatus``` — статус сегмента
- ```/AncillaryServicesUpdate/CommercialName``` — название услуги (```/GetAncillaryOffersRS/AncillaryDefinition/CommercialName```)
- ```/AncillaryServicesUpdate/RficCode``` —  RFIC код (```/GetAncillaryOffersRS/AncillaryDefinition/ReasonForIssuance/@code```)
- ```/AncillaryServicesUpdate/RficSubcode``` — RFIC субкод (```/GetAncillaryOffersRS/AncillaryDefinition/SubCode```)
- ```/AncillaryServicesUpdate/SSRCode``` — код требуемого SSR сообщения (```/GetAncillaryOffersRS/AncillaryDefinition/SpecialService```)
- ```/AncillaryServicesUpdate/OwningCarrierCode``` — код перевозчика, продающего услугу (```/GetAncillaryOffersRS/AncillaryDefinition/Airline```)
- ```/AncillaryServicesUpdate/BookingIndicator``` — индикатор бронирования (```/GetAncillaryOffersRS/AncillaryDefinition/BookingMethod/@code```)
- ```/AncillaryServicesUpdate/Vendor``` — код системы, в которой размещена дополнительная услуга (```/GetAncillaryOffersRS/AncillaryDefinition/Vendor```)
- ```/AncillaryServicesUpdate/EMDType``` — тип EMD (```/GetAncillaryOffersRS/AncillaryDefinition/ElectronicMiscDocType/@code```)
- ```/AncillaryServicesUpdate/ServiceType``` — тип услуги (```/GetAncillaryOffersRS/Ancillary/ServiceType```)
- ```/AncillaryServicesUpdate/EquivalentPrice/Price``` — стоимость услуги в валюте эквивалента (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/EquivAmount```)
- ```/AncillaryServicesUpdate/EquivalentPrice/Currency``` — валюта эквивалента (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/EquivAmount/@currency```)
- ```/AncillaryServicesUpdate/TTLPrice/Price``` — общая стоимость услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/TTL_Price/EquivAmount```)
- ```/AncillaryServicesUpdate/TTLPrice/Currency``` — валюта общей стоимости услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/TTL_Price/EquivAmount/@currency```)
- ```/AncillaryServicesUpdate/OriginalBasePrice/Price``` — оригинальная стоимость услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/Amount```)
- ```/AncillaryServicesUpdate/OriginalBasePrice/Currency``` — валюта оригинальной стоимости услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/Amount/@currency```)
- ```/AncillaryServicesUpdate/RefundIndicator``` — индикатор возвратности (```/GetAncillaryOffersRS/Offers/AncillaryRules/RefundableReissuable```)
- ```/AncillaryServicesUpdate/CommisionIndicator``` — индикатор наличия комиссии (```/GetAncillaryOffersRS/Offers/AncillaryRules/Commissionable```, требуется изменение значения с ```true``` на ```Y``` и с ```false``` на ```N```)
- ```/AncillaryServicesUpdate/InterlineIndicator``` — индикатор интерлайна (```/GetAncillaryOffersRS/Offers/AncillaryRules/Interlineable```, требуется изменение значения с ```true``` на ```Y``` и с ```false``` на ```N```)
- ```/AncillaryServicesUpdate/FeeApplicationIndicator``` — индикатор применимости оплаты (```/GetAncillaryOffersRS/Offers/AncillaryRules/FeeApplicationMethod```)
- ```/AncillaryServicesUpdate/PassengerTypeCode``` — категория пассажира (```/GetAncillaryOffersRS/PassengerOffers/PassengerReference/@passengerType```)
- ```/AncillaryServicesUpdate/BoardPoint``` — аэропорт отправления для услуги  (```/GetAncillaryOffersRS/Offers/Origin```)
- ```/AncillaryServicesUpdate/OffPoint``` — аэропорт прибытия для услуги (```/GetAncillaryOffersRS/Offers/Destination```)
- ```/AncillaryServicesUpdate/Taxes/Tax/TaxAmount``` — величина таксы (```/GetAncillaryOffersRS/Offers/AncillaryFee/Tax/EquivAmount```)
- ```/AncillaryServicesUpdate/Taxes/Tax/TaxCode``` — код таксы (```/GetAncillaryOffersRS/Offers/AncillaryFee/Tax/@code```)
- ```/AncillaryServicesUpdate/SimultaneousTicketIndicator``` — индикатор необходимости одновременного оформления билета (```/GetAncillaryOffersRS/Offers/AncillaryRules/SimultaneousTicketIndicator```)
- ```/AncillaryServicesUpdate/TravelDateEffective``` — дата окончания действия предложения (```/GetAncillaryOffersRS/Ancillary/TravelDateEffective```)
- ```/AncillaryServicesUpdate/LatestTravelDatePermitted``` — дата начала действия предложения (```/GetAncillaryOffersRS/Ancillary/LatestTravelDatePermitted```)
- ```/AncillaryServicesUpdate/PurchaseByDate``` — дата необходимости оформления EMD для дополнительной услуги (```/GetAncillaryOffersRS/Offers/PurchaseByDate```)
- ```/AncillaryServicesUpdate/TotalOriginalBasePrice/Price``` — общая оригинальная стоимость всех услуг выбранного типа в валюте эквивалента (количество бронируемых услуг умножить на ```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/Amount```)
- ```/AncillaryServicesUpdate/TotalOriginalBasePrice/Currency``` — валюта оригинальной стоимости услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/Amount/@currency```)
- ```/AncillaryServicesUpdate/TotalEquivalentPrice/Price``` — общая стоимость всех услуг выбранного типа в валюте эквивалента (количество бронируемых услуг умножить на ```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/EquivAmount```)
- ```/AncillaryServicesUpdate/TotalEquivalentPrice/Currency``` — валюта эквивалента (```/GetAncillaryOffersRS/Offers/AncillaryFee/Base/EquivAmount```)
- ```/AncillaryServicesUpdate/TotalTTLPrice/Price``` — общая стоимость всех услуг выбранного типа в валюте эквивалента (количество бронируемых услуг умножить на ```/GetAncillaryOffersRS/Offers/AncillaryFee/TTL_Price/EquivAmount/@currency```)
- ```/AncillaryServicesUpdate/TotalTTLPrice/Currency``` — валюта общей стоимости услуги (```/GetAncillaryOffersRS/Offers/AncillaryFee/TTL_Price/EquivAmount/@currency```)
- ```/AncillaryServicesUpdate/TotalTaxes/Tax/TaxAmount``` — общая величина каждой таксы (количество бронируемых услуг умножить на ```/GetAncillaryOffersRS/Offers/AncillaryFee/Tax/EquivAmount```)
- ```/AncillaryServicesUpdate/TotalTaxes/Tax/TaxCode``` — код таксы (```/GetAncillaryOffersRS/Offers/AncillaryFee/Tax/@code```)
- ```/AncillaryServicesUpdate/NumberOfItems``` — количество бронируемых услуг
- ```/AncillaryServicesUpdate/SegmentIndicator``` — индикатор применимости услуги к сегментам или части бронирования (```/GetAncillaryOffersRS/Ancillary/SectorPortionInd```)
- ```/AncillaryServicesUpdate/RefundFormIndicator``` — индикатор возвратности (```/GetAncillaryOffersRS/Offers/AncillaryRules/FormOfRefund/@code```)
- ```/AncillaryServicesUpdate/FirstTravelDate``` — дата самого раннего перелета, для которого возможно бронирование услуги (```/GetAncillaryOffersRS/Ancillary/TravelDateEffective```, требуется смена формата даты с ```yyyy-MM-dd``` на ```yyMMdd```, например с ```1980-01-01``` на ```800101```)
- ```/AncillaryServicesUpdate/LastTravelDate``` — дата самого позднего перелета, для которого возможно бронирование услуги (```/GetAncillaryOffersRS/Ancillary/LatestTravelDatePermitted```, требуется смена формата даты с ```yyyy-MM-dd``` на ```yyMMdd```, например с ```9999-12-31``` на ```991231```)
- ```/AncillaryServicesUpdate/PurchaseTimestamp``` — дата и время бронирования услуги в формате ```yyyy-MM-ddTHH:mm:ss```, например ```2018-12-31T23:59:59```
- ```/AncillaryServicesUpdate/GroupCode``` — код категории услуги (```/GetAncillaryOffersRS/AncillaryDefinition/Group```)
- ```/AncillaryServicesUpdate/PriceMismatchAction``` — действие при несовпадении реальной стоимости услуги с заданной в запросе. Возможные значения:
    - ```REJECT``` — не бронировать услугу
    - ```ACCEPT_ANY_PRICE``` — забронировать в любом случае
    - ```ACCEPT_LOWER_PRICE``` — забронировать услугу только если ее реальная стоимость ниже указанной в запросе

#### Отправка SSR

Некоторые перевозчики требуют отправлять SSR сообщения для получения подтверждения дополнительных услуг. Определить необходимость отправки SSR сообщения для подтверждения дополнительных услуг можно по значению элемента ```/GetAncillaryOffersRS/AncillaryDefinition/SpecialService``` в ответе на запрос к сервису [GetAncillaryOffersRQ](https://developer.sabre.com/docs/soap_apis/air/search/get_ancillary_offers) (см. [Получение списка дополнительных услуг](get-ancillaries.md)). Если значение элемента равно ```ASVC```, то отправлять SSR не нужно. Во всех остальных случаях в этом элементе будет указан код SSR сообщения.

Некоторые перевозчики так же требуют отправлять SSR сообщения с текстом. Определить необходимость отправки текста в SSR сообщении можно по значению атрибута ```/GetAncillaryOffersRS/AncillaryDefinition/SpecialServiceDetails/@type```. Возможные значения:
- ```STRUCTURED``` — требуется текст сообщения в формате, установленном перевозчиком
- ```NOTALLOWED``` — сообщения с текстом не разрешаются
- ```REQUIRED``` — требуется текст сообщения в любом формате
- ```OPTIONAL``` — текст сообщения опционален

Примеры текста SSR сообщения для дополнительных услуг доступны в [таблице на портале Dev Studio](https://developer.sabre.com/sites/default/files/SSR_-__Free_Text_Table_for_Air_Extras.xlsx?a), в [Finder](introduction.md#finder), а также на сайтах и в рассылках перевозчиков.

Для отправки SSR необходимо добавить элемент ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem/SpecialServiceRequestUpdate```, содержащий следующие элементы и атрибуты:

- ```SpecialServiceRequestUpdate/@op``` — код типа операции. Всегда значение ```C``` (Create, создание)
- ```SpecialServiceRequestUpdate/@type``` — тип SSR. Значение ```H``` для перевозчика American Airlines (AA), значение ```G``` — для всех остальных
- ```SpecialServiceRequestUpdate/NameAssociationList/NameAssociationTag/NameRefNumber``` — номер пассажира
- ```SpecialServiceRequestUpdate/SpecialService/Code``` — код SSR сообщения (4 буквы)
- ```SpecialServiceRequestUpdate/SpecialService/Text``` — текст SSR сообщения
- ```/SpecialServiceRequestUpdate/SegmentAssociationList``` — информация о сегментах:
    - ```/SegmentAssociationList/SegmentAssociationTag/CarrierCode``` — маркетинговый перевозчик
    - ```/SegmentAssociationList/SegmentAssociationTag/FlightNumber``` — номер рейса
    - ```/SegmentAssociationList/SegmentAssociationTag/DepartureDate``` — дата вылета
    - ```/SegmentAssociationList/SegmentAssociationTag/BoardPoint``` — аэропорт отправления
    - ```/SegmentAssociationList/SegmentAssociationTag/OffPoint``` — аэропорт прибытия
    - ```/SegmentAssociationList/SegmentAssociationTag/ClassOfService``` — класс бронирования
    - ```/SegmentAssociationList/SegmentAssociationTag/BookingStatus``` — статус сегмента

{% xmlsec "Пример отправки SSR сообщения", true %}
<ReservationUpdateItem>
  <SpecialServiceRequestUpdate op="C" type="G">
    <NameAssociationList>
      <NameAssociationTag>
        <NameRefNumber>01.01</NameRefNumber>
      </NameAssociationTag>
    </NameAssociationList>
    <SegmentAssociationList>
      <SegmentAssociationTag>
        <CarrierCode>AF</CarrierCode>
        <FlightNumber>1845</FlightNumber>
        <DepartureDate>2020-09-01</DepartureDate>
        <BoardPoint>SVO</BoardPoint>
        <OffPoint>CDG</OffPoint>
        <ClassOfService>E</ClassOfService>
        <BookingStatus>HK</BookingStatus>
      </SegmentAssociationTag>
    </SegmentAssociationList>
    <SpecialService>
      <Code>ABAG</Code>
      <Text>PREPAID</Text>
    </SpecialService>
  </SpecialServiceRequestUpdate>
</ReservationUpdateItem>
{% endxmlsec %}

*Обратите внимание на то, что для дополнительных услуг обязательно требуется оформление EMD. EMD должны быть оформлены в бронировании после оформления билетов. Процесс оформления EMD подробно описан в разделе [Оформление билетов и EMD](issue-ticket.md).*

#### Пример

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>QXQNGD</Locator>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate op="C">
        <NameAssociationList>
          <NameAssociationTag>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociationTag>
        </NameAssociationList>
        <SegmentAssociationList>
          <SegmentAssociationTag>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>68</FlightNumber>
            <DepartureDate>2020-09-01</DepartureDate>
            <BoardPoint>DME</BoardPoint>
            <OffPoint>AUH</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <CommercialName>UPTO33LB 15KG BAGGAGE</CommercialName>
        <RficCode>C</RficCode>
        <RficSubcode>0C1</RficSubcode>
        <SSRCode>ASVC</SSRCode>
        <OwningCarrierCode>EY</OwningCarrierCode>
        <BookingIndicator>01</BookingIndicator>
        <Vendor>ATP</Vendor>
        <EMDType>2</EMDType>
        <ServiceType>C</ServiceType>
        <EquivalentPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </EquivalentPrice>
        <TTLPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <OriginalBasePrice>
          <Price>338.00</Price>
          <Currency>USD</Currency>
        </OriginalBasePrice>
        <RefundIndicator>R</RefundIndicator>
        <CommisionIndicator>N</CommisionIndicator>
        <InterlineIndicator>Y</InterlineIndicator>
        <FeeApplicationIndicator>4</FeeApplicationIndicator>
        <PassengerTypeCode>ADT</PassengerTypeCode>
        <BoardPoint>DME</BoardPoint>
        <OffPoint>AUH</OffPoint>
        <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
        <TravelDateEffective>1980-01-01</TravelDateEffective>
        <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
        <PurchaseByDate>2020-08-30</PurchaseByDate>
        <TotalOriginalBasePrice>
          <Price>338.00</Price>
          <Currency>USD</Currency>
        </TotalOriginalBasePrice>
        <TotalEquivalentPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TotalEquivalentPrice>
        <TotalTTLPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TotalTTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <SegmentIndicator>P</SegmentIndicator>
        <FirstTravelDate>800101</FirstTravelDate>
        <LastTravelDate>991231</LastTravelDate>
        <GroupCode>BG</GroupCode>
        <PriceMismatchAction>ACCEPT_LOWER_PRICE</PriceMismatchAction>
      </AncillaryServicesUpdate>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate op="C">
        <NameAssociationList>
          <NameAssociationTag>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociationTag>
        </NameAssociationList>
        <SegmentAssociationList>
          <SegmentAssociationTag>
            <CarrierCode>EY</CarrierCode>
            <FlightNumber>65</FlightNumber>
            <DepartureDate>2020-09-08</DepartureDate>
            <BoardPoint>AUH</BoardPoint>
            <OffPoint>DME</OffPoint>
            <ClassOfService>B</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <CommercialName>UPTO33LB 15KG BAGGAGE</CommercialName>
        <RficCode>C</RficCode>
        <RficSubcode>0C1</RficSubcode>
        <SSRCode>ASVC</SSRCode>
        <OwningCarrierCode>EY</OwningCarrierCode>
        <BookingIndicator>01</BookingIndicator>
        <Vendor>ATP</Vendor>
        <EMDType>2</EMDType>
        <ServiceType>C</ServiceType>
        <EquivalentPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </EquivalentPrice>
        <TTLPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <OriginalBasePrice>
          <Price>338.00</Price>
          <Currency>USD</Currency>
        </OriginalBasePrice>
        <RefundIndicator>R</RefundIndicator>
        <CommisionIndicator>N</CommisionIndicator>
        <InterlineIndicator>Y</InterlineIndicator>
        <FeeApplicationIndicator>4</FeeApplicationIndicator>
        <PassengerTypeCode>ADT</PassengerTypeCode>
        <BoardPoint>AUH</BoardPoint>
        <OffPoint>DME</OffPoint>
        <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
        <TravelDateEffective>1980-01-01</TravelDateEffective>
        <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
        <PurchaseByDate>2020-09-06</PurchaseByDate>
        <TotalOriginalBasePrice>
          <Price>338.00</Price>
          <Currency>USD</Currency>
        </TotalOriginalBasePrice>
        <TotalEquivalentPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TotalEquivalentPrice>
        <TotalTTLPrice>
          <Price>20790</Price>
          <Currency>RUB</Currency>
        </TotalTTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <SegmentIndicator>P</SegmentIndicator>
        <FirstTravelDate>800101</FirstTravelDate>
        <LastTravelDate>991231</LastTravelDate>
        <GroupCode>BG</GroupCode>
        <PriceMismatchAction>ACCEPT_LOWER_PRICE</PriceMismatchAction>
      </AncillaryServicesUpdate>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>QXQNGD</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-01-23T07:00:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-01-23T07:00:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-01-23T08:03:36</stl19:UpdateTimestamp>
      <stl19:PNRSequence>5</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T06:50:00" Start="2020-09-01T12:40:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-10-23T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-1c35c06e7c25e98fb19db668a23e4a922d61633beb4226df</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="true" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="18" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="19" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="20" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>CTCM EY HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="21" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>EY</stl19:AirlineCode>
              <stl19:FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="22" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="25" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031885C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031885C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>INF6075588031888C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>INF6075588031888C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-27" id="27" index="1">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031885</stl19:DocumentNumber>
              <stl19:CommissionAmount>1065</stl19:CommissionAmount>
              <stl19:BaseFare>106520</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:AncillaryServices>
            <stl19:AncillaryService elementId="pnr-50" id="50" sequenceNumber="1">
              <stl19:CommercialName>UPTO33LB 15KG BAGGAGE</stl19:CommercialName>
              <stl19:RficCode>C</stl19:RficCode>
              <stl19:RficSubcode>0C1</stl19:RficSubcode>
              <stl19:SSRCode>ASVC</stl19:SSRCode>
              <stl19:OwningCarrierCode>EY</stl19:OwningCarrierCode>
              <stl19:BookingIndicator>01</stl19:BookingIndicator>
              <stl19:Vendor>ATP</stl19:Vendor>
              <stl19:EMDType>2</stl19:EMDType>
              <stl19:EquivalentPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:EquivalentPrice>
              <stl19:TTLPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TTLPrice>
              <stl19:OriginalBasePrice>
                <stl19:Price>338.00</stl19:Price>
                <stl19:Currency>USD</stl19:Currency>
              </stl19:OriginalBasePrice>
              <stl19:RefundIndicator>R</stl19:RefundIndicator>
              <stl19:CommisionIndicator>N</stl19:CommisionIndicator>
              <stl19:InterlineIndicator>Y</stl19:InterlineIndicator>
              <stl19:FeeApplicationIndicator>4</stl19:FeeApplicationIndicator>
              <stl19:PassengerTypeCode>ADT</stl19:PassengerTypeCode>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:TotalOriginalBasePrice>
                <stl19:Price>338.00</stl19:Price>
                <stl19:Currency>USD</stl19:Currency>
              </stl19:TotalOriginalBasePrice>
              <stl19:TotalEquivalentPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TotalEquivalentPrice>
              <stl19:TotalTTLPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TotalTTLPrice>
              <stl19:FareCalculationModeIndicator>0</stl19:FareCalculationModeIndicator>
              <stl19:FareCalculationPriceIndicator>0</stl19:FareCalculationPriceIndicator>
              <stl19:StatusIndicator>0</stl19:StatusIndicator>
              <stl19:NumberOfItems>1</stl19:NumberOfItems>
              <stl19:ActionCode>HD</stl19:ActionCode>
              <stl19:SegmentIndicator>P</stl19:SegmentIndicator>
              <stl19:FareGuaranteedIndicator>T</stl19:FareGuaranteedIndicator>
              <stl19:BookingSource>0</stl19:BookingSource>
              <stl19:TicketingIndicator>0</stl19:TicketingIndicator>
              <stl19:FirstTravelDate>800101</stl19:FirstTravelDate>
              <stl19:LastTravelDate>991231</stl19:LastTravelDate>
              <stl19:PurchaseTimestamp>2020-08-30T23:59:00</stl19:PurchaseTimestamp>
              <stl19:GroupCode>BG</stl19:GroupCode>
              <stl19:TicketUsedForEMDPricing>N</stl19:TicketUsedForEMDPricing>
              <stl19:EMDConsummedAtIssuance/>
              <stl19:PaperDocRequired>N</stl19:PaperDocRequired>
              <stl19:TaxExemption>N</stl19:TaxExemption>
              <stl19:ACSCount>0</stl19:ACSCount>
              <stl19:Segment id="16" sequence="1">
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FlightNumber>0068</stl19:FlightNumber>
                <stl19:ClassOfService>Y</stl19:ClassOfService>
                <stl19:DepartureDate>2020-09-01</stl19:DepartureDate>
                <stl19:BoardPoint>DME</stl19:BoardPoint>
                <stl19:OffPoint>AUH</stl19:OffPoint>
                <stl19:MarketingCarrier>EY</stl19:MarketingCarrier>
                <stl19:OperatingCarrier>EY</stl19:OperatingCarrier>
              </stl19:Segment>
            </stl19:AncillaryService>
            <stl19:AncillaryService elementId="pnr-52" id="52" sequenceNumber="2">
              <stl19:CommercialName>UPTO33LB 15KG BAGGAGE</stl19:CommercialName>
              <stl19:RficCode>C</stl19:RficCode>
              <stl19:RficSubcode>0C1</stl19:RficSubcode>
              <stl19:SSRCode>ASVC</stl19:SSRCode>
              <stl19:OwningCarrierCode>EY</stl19:OwningCarrierCode>
              <stl19:BookingIndicator>01</stl19:BookingIndicator>
              <stl19:Vendor>ATP</stl19:Vendor>
              <stl19:EMDType>2</stl19:EMDType>
              <stl19:EquivalentPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:EquivalentPrice>
              <stl19:TTLPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TTLPrice>
              <stl19:OriginalBasePrice>
                <stl19:Price>338.00</stl19:Price>
                <stl19:Currency>USD</stl19:Currency>
              </stl19:OriginalBasePrice>
              <stl19:RefundIndicator>R</stl19:RefundIndicator>
              <stl19:CommisionIndicator>N</stl19:CommisionIndicator>
              <stl19:InterlineIndicator>Y</stl19:InterlineIndicator>
              <stl19:FeeApplicationIndicator>4</stl19:FeeApplicationIndicator>
              <stl19:PassengerTypeCode>ADT</stl19:PassengerTypeCode>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:TotalOriginalBasePrice>
                <stl19:Price>338.00</stl19:Price>
                <stl19:Currency>USD</stl19:Currency>
              </stl19:TotalOriginalBasePrice>
              <stl19:TotalEquivalentPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TotalEquivalentPrice>
              <stl19:TotalTTLPrice>
                <stl19:Price>20790</stl19:Price>
                <stl19:Currency>RUB</stl19:Currency>
              </stl19:TotalTTLPrice>
              <stl19:FareCalculationModeIndicator>0</stl19:FareCalculationModeIndicator>
              <stl19:FareCalculationPriceIndicator>0</stl19:FareCalculationPriceIndicator>
              <stl19:StatusIndicator>0</stl19:StatusIndicator>
              <stl19:NumberOfItems>1</stl19:NumberOfItems>
              <stl19:ActionCode>HD</stl19:ActionCode>
              <stl19:SegmentIndicator>P</stl19:SegmentIndicator>
              <stl19:FareGuaranteedIndicator>T</stl19:FareGuaranteedIndicator>
              <stl19:BookingSource>0</stl19:BookingSource>
              <stl19:TicketingIndicator>0</stl19:TicketingIndicator>
              <stl19:FirstTravelDate>800101</stl19:FirstTravelDate>
              <stl19:LastTravelDate>991231</stl19:LastTravelDate>
              <stl19:PurchaseTimestamp>2020-09-06T23:59:00</stl19:PurchaseTimestamp>
              <stl19:GroupCode>BG</stl19:GroupCode>
              <stl19:TicketUsedForEMDPricing>N</stl19:TicketUsedForEMDPricing>
              <stl19:EMDConsummedAtIssuance/>
              <stl19:PaperDocRequired>N</stl19:PaperDocRequired>
              <stl19:TaxExemption>N</stl19:TaxExemption>
              <stl19:ACSCount>0</stl19:ACSCount>
              <stl19:Segment id="17" sequence="2">
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FlightNumber>0065</stl19:FlightNumber>
                <stl19:ClassOfService>B</stl19:ClassOfService>
                <stl19:DepartureDate>2020-09-08</stl19:DepartureDate>
                <stl19:BoardPoint>AUH</stl19:BoardPoint>
                <stl19:OffPoint>DME</stl19:OffPoint>
                <stl19:MarketingCarrier>EY</stl19:MarketingCarrier>
                <stl19:OperatingCarrier>EY</stl19:OperatingCarrier>
              </stl19:Segment>
            </stl19:AncillaryService>
          </stl19:AncillaryServices>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-29" id="29" index="2">TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-29" id="29" index="2">
              <stl19:OriginalTicketDetails>TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/I</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="23" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031886C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031886C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-28" id="28" index="2">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031886</stl19:DocumentNumber>
              <stl19:CommissionAmount>1065</stl19:CommissionAmount>
              <stl19:BaseFare>106520</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOVA ELENA MS</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-30" id="30" index="3">TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-30" id="30" index="3">
              <stl19:OriginalTicketDetails>TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/E</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="24" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>EY</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>DME</stl19:BoardPoint>
              <stl19:OffPoint>AUH</stl19:OffPoint>
              <stl19:ClassOfService>Y</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-01T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031887C1</stl19:TicketNumber>
            </stl19:TicketingRequest>
            <stl19:TicketingRequest>
              <stl19:TicketType>G</stl19:TicketType>
              <stl19:ValidatingCarrier>EY</stl19:ValidatingCarrier>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:BoardPoint>AUH</stl19:BoardPoint>
              <stl19:OffPoint>DME</stl19:OffPoint>
              <stl19:ClassOfService>B</stl19:ClassOfService>
              <stl19:DateOfTravel>2020-09-08T00:00:00</stl19:DateOfTravel>
              <stl19:TicketNumber>6075588031887C2</stl19:TicketNumber>
            </stl19:TicketingRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-38" id="38" index="3">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031887</stl19:DocumentNumber>
              <stl19:CommissionAmount>800</stl19:CommissionAmount>
              <stl19:BaseFare>80010</stl19:BaseFare>
              <stl19:TaxAmount>17600</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOV ANDREY CHD</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-39" id="39" index="4">TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-39" id="39" index="4">
              <stl19:OriginalTicketDetails>TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/A</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
          <stl19:AccountingLines>
            <stl19:AccountingLine elementId="pnr-44" id="44" index="4">
              <stl19:FareApplication>ONE</stl19:FareApplication>
              <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
              <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
              <stl19:DocumentNumber>5588031888</stl19:DocumentNumber>
              <stl19:CommissionAmount>110</stl19:CommissionAmount>
              <stl19:BaseFare>11030</stl19:BaseFare>
              <stl19:TaxAmount>2460</stl19:TaxAmount>
              <stl19:GSTCode>C</stl19:GSTCode>
              <stl19:GSTAmount>0</stl19:GSTAmount>
              <stl19:PassengerName>IVANOVA EKATERINA INF</stl19:PassengerName>
              <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
              <stl19:TarriffBasis>F</stl19:TarriffBasis>
            </stl19:AccountingLine>
          </stl19:AccountingLines>
          <stl19:Remarks/>
          <stl19:PhoneNumbers/>
          <stl19:TicketingInfo>
            <stl19:ETicketNumber elementId="pnr-45" id="45" index="5">TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
            <stl19:TicketDetails elementId="pnr-45" id="45" index="5">
              <stl19:OriginalTicketDetails>TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
              <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
              <stl19:TicketNumber>6075588031888</stl19:TicketNumber>
              <stl19:PassengerName>IVANO/E</stl19:PassengerName>
              <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
              <stl19:DutyCode>*</stl19:DutyCode>
              <stl19:AgentSine>AWT</stl19:AgentSine>
              <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
              <stl19:PaymentType>*</stl19:PaymentType>
            </stl19:TicketDetails>
          </stl19:TicketingInfo>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>DME</stl19:Airport>
          <stl19:Departure>2020-09-01T12:40:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>DME</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AUH</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>EY</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>ETIHAD AIRWAYS</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>0068</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>321</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>EY</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>0068</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCEY*YJJCAR</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T12:40:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T18:55:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>0068</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="18" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="33" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031885C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031885C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="35" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031886C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031886C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="41" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/6075588031887C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031887C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="47" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>INF6075588031</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:AncillaryServices>
              <stl19:AncillaryService ref="50"/>
            </stl19:AncillaryServices>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-01-23T07:00:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY ETIHAD AIRWAYS</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="B" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AUH</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>DME</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>EY</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>ETIHAD AIRWAYS</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>0065</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>321</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>EY</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>0065</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>B</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>B</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCEY*YJJCAR</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:25:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T06:50:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>0065</stl19:FlightNumber>
            <stl19:ClassOfService>B</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="19" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="34" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031885C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031885C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="36" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031886C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031886C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="42" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/6075588031887C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031887C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="48" msgType="S" type="G">
                <stl19:Code>TKNE</stl19:Code>
                <stl19:FreeText>EY HK1 AUHDME0065B08SEP/INF6075588031888C2</stl19:FreeText>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>EY</stl19:AirlineCode>
                <stl19:TicketNumber>INF6075588031</stl19:TicketNumber>
                <stl19:FullText>TKNE EY HK1 AUHDME0065B08SEP/INF6075588031888C2</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:AncillaryServices>
              <stl19:AncillaryService ref="52"/>
            </stl19:AncillaryServices>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-01-23T07:00:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY ETIHAD AIRWAYS</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:AlreadyTicketed elementId="pnr-46" id="46" index="1">
          <stl19:Code>T-23JAN-2FRH*AWT</stl19:Code>
        </stl19:AlreadyTicketed>
        <stl19:ETicketNumber elementId="pnr-29" id="29" index="2">TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-30" id="30" index="3">TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-39" id="39" index="4">TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
        <stl19:ETicketNumber elementId="pnr-45" id="45" index="5">TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:ETicketNumber>
        <stl19:TicketDetails elementId="pnr-29" id="29" index="2">
          <stl19:OriginalTicketDetails>TE 6075588031885-RU IVANO/I 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031885</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/I</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-30" id="30" index="3">
          <stl19:OriginalTicketDetails>TE 6075588031886-RU IVANO/E 2FRH*AWT 1600/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031886</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/E</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:00:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-39" id="39" index="4">
          <stl19:OriginalTicketDetails>TE 6075588031887-RU IVANO/A 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031887</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/A</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
        <stl19:TicketDetails elementId="pnr-45" id="45" index="5">
          <stl19:OriginalTicketDetails>TE 6075588031888-RU IVANO/E 2FRH*AWT 1601/23JAN*I</stl19:OriginalTicketDetails>
          <stl19:TransactionIndicator>TE</stl19:TransactionIndicator>
          <stl19:TicketNumber>6075588031888</stl19:TicketNumber>
          <stl19:PassengerName>IVANO/E</stl19:PassengerName>
          <stl19:AgencyLocation>2FRH</stl19:AgencyLocation>
          <stl19:DutyCode>*</stl19:DutyCode>
          <stl19:AgentSine>AWT</stl19:AgentSine>
          <stl19:Timestamp>2020-01-23T16:01:00</stl19:Timestamp>
          <stl19:PaymentType>*</stl19:PaymentType>
        </stl19:TicketDetails>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-31" id="31" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>XXTAW/</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:AccountingLines>
      <stl19:AccountingLine elementId="pnr-27" id="27" index="1">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031885</stl19:DocumentNumber>
        <stl19:CommissionAmount>1065</stl19:CommissionAmount>
        <stl19:BaseFare>106520</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOV IVAN MR</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-28" id="28" index="2">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031886</stl19:DocumentNumber>
        <stl19:CommissionAmount>1065</stl19:CommissionAmount>
        <stl19:BaseFare>106520</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOVA ELENA MS</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-38" id="38" index="3">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031887</stl19:DocumentNumber>
        <stl19:CommissionAmount>800</stl19:CommissionAmount>
        <stl19:BaseFare>80010</stl19:BaseFare>
        <stl19:TaxAmount>17600</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOV ANDREY CHD</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
      <stl19:AccountingLine elementId="pnr-44" id="44" index="4">
        <stl19:FareApplication>ONE</stl19:FareApplication>
        <stl19:FormOfPaymentCode>CA</stl19:FormOfPaymentCode>
        <stl19:AirlineDesignator>EY</stl19:AirlineDesignator>
        <stl19:DocumentNumber>5588031888</stl19:DocumentNumber>
        <stl19:CommissionAmount>110</stl19:CommissionAmount>
        <stl19:BaseFare>11030</stl19:BaseFare>
        <stl19:TaxAmount>2460</stl19:TaxAmount>
        <stl19:GSTCode>C</stl19:GSTCode>
        <stl19:GSTAmount>0</stl19:GSTAmount>
        <stl19:PassengerName>IVANOVA EKATERINA INF</stl19:PassengerName>
        <stl19:NumberOfConjunctedDocuments>1</stl19:NumberOfConjunctedDocuments>
        <stl19:TarriffBasis>F</stl19:TarriffBasis>
      </stl19:AccountingLine>
    </stl19:AccountingLines>
    <stl19:AssociationMatrices>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-2.1"/>
        <stl19:Child ref="pnr-27">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-29">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-4.2"/>
        <stl19:Child ref="pnr-28">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-30">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-6.3"/>
        <stl19:Child ref="pnr-38">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-39">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
      <stl19:AssociationMatrix>
        <stl19:Name>PersonIDType</stl19:Name>
        <stl19:Parent ref="pnr-8.4"/>
        <stl19:Child ref="pnr-44">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
        <stl19:Child ref="pnr-45">
          <stl19:AssociationRule name="MoveOnDivide" value="ON"/>
        </stl19:Child>
      </stl19:AssociationMatrix>
    </stl19:AssociationMatrices>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement elementId="pnr-or-674f7fd0-cbe4-4e24-970c-7c3db6f65938" id="674f7fd0-cbe4-4e24-970c-7c3db6f65938" type="APO">
        <or114:AncillaryProduct Id="1">
          <or114:XmlData>
            <or114:AncillaryServiceData id="50">
              <or114:NameAssociationList>
                <or114:NameAssociationTag>
                  <or114:LastName>IVANOV</or114:LastName>
                  <or114:FirstName>IVAN MR</or114:FirstName>
                  <or114:ReferenceId>1</or114:ReferenceId>
                </or114:NameAssociationTag>
              </or114:NameAssociationList>
              <or114:SegmentAssociationList>
                <or114:SegmentAssociationTag>
                  <or114:CarrierCode>EY</or114:CarrierCode>
                  <or114:FlightNumber>68</or114:FlightNumber>
                  <or114:DepartureDate>2020-09-01</or114:DepartureDate>
                  <or114:BoardPoint>DME</or114:BoardPoint>
                  <or114:OffPoint>AUH</or114:OffPoint>
                  <or114:ClassOfService>Y</or114:ClassOfService>
                  <or114:BookingStatus>HK</or114:BookingStatus>
                </or114:SegmentAssociationTag>
                <or114:SegmentAssociationId>2</or114:SegmentAssociationId>
              </or114:SegmentAssociationList>
              <or114:CommercialName>UPTO33LB 15KG BAGGAGE</or114:CommercialName>
              <or114:RficCode>C</or114:RficCode>
              <or114:RficSubcode>0C1</or114:RficSubcode>
              <or114:SSRCode>ASVC</or114:SSRCode>
              <or114:OwningCarrierCode>EY</or114:OwningCarrierCode>
              <or114:BookingIndicator>01</or114:BookingIndicator>
              <or114:Vendor>ATP</or114:Vendor>
              <or114:EMDType>2</or114:EMDType>
              <or114:ServiceType>C</or114:ServiceType>
              <or114:EquivalentPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:EquivalentPrice>
              <or114:TTLPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TTLPrice>
              <or114:OriginalBasePrice>
                <or114:Price>338.00</or114:Price>
                <or114:Currency>USD</or114:Currency>
              </or114:OriginalBasePrice>
              <or114:RefundIndicator>R</or114:RefundIndicator>
              <or114:CommisionIndicator>N</or114:CommisionIndicator>
              <or114:InterlineIndicator>Y</or114:InterlineIndicator>
              <or114:FeeApplicationIndicator>4</or114:FeeApplicationIndicator>
              <or114:PassengerTypeCode>ADT</or114:PassengerTypeCode>
              <or114:BoardPoint>DME</or114:BoardPoint>
              <or114:OffPoint>AUH</or114:OffPoint>
              <or114:SimultaneousTicketIndicator>X</or114:SimultaneousTicketIndicator>
              <or114:TravelDateEffective>1980-01-01</or114:TravelDateEffective>
              <or114:LatestTravelDatePermitted>9999-12-31</or114:LatestTravelDatePermitted>
              <or114:PurchaseByDate>2020-08-30</or114:PurchaseByDate>
              <or114:TotalOriginalBasePrice>
                <or114:Price>338.00</or114:Price>
                <or114:Currency>USD</or114:Currency>
              </or114:TotalOriginalBasePrice>
              <or114:TotalEquivalentPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TotalEquivalentPrice>
              <or114:TotalTTLPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TotalTTLPrice>
              <or114:FareCalculationModeIndicator>0</or114:FareCalculationModeIndicator>
              <or114:FareCalculationPriceIndicator>0</or114:FareCalculationPriceIndicator>
              <or114:NumberOfItems>1</or114:NumberOfItems>
              <or114:ActionCode>HD</or114:ActionCode>
              <or114:SegmentIndicator>P</or114:SegmentIndicator>
              <or114:FareGuaranteedIndicator>T</or114:FareGuaranteedIndicator>
              <or114:BookingSource>0</or114:BookingSource>
              <or114:TicketingIndicator>0</or114:TicketingIndicator>
              <or114:FirstTravelDate>800101</or114:FirstTravelDate>
              <or114:LastTravelDate>991231</or114:LastTravelDate>
              <or114:PurchaseTimestamp>2020-08-30T23:59:59</or114:PurchaseTimestamp>
              <or114:GroupCode>BG</or114:GroupCode>
              <or114:TicketUsedForEMDPricing>N</or114:TicketUsedForEMDPricing>
              <or114:PaperDocRequired>N</or114:PaperDocRequired>
              <or114:EMDConsummedAtIssuance/>
              <or114:TaxExemption>N</or114:TaxExemption>
              <or114:PriceMismatchAction>ACCEPT_LOWER_PRICE</or114:PriceMismatchAction>
              <or114:ACSCount>0</or114:ACSCount>
              <or114:Segment id="16" sequence="1">
                <or114:AirlineCode>EY</or114:AirlineCode>
                <or114:FlightNumber>0068</or114:FlightNumber>
                <or114:OperatingFlightNumber>0068</or114:OperatingFlightNumber>
                <or114:ClassOfService>Y</or114:ClassOfService>
                <or114:DepartureDate>2020-09-01</or114:DepartureDate>
                <or114:BoardPoint>DME</or114:BoardPoint>
                <or114:OffPoint>AUH</or114:OffPoint>
                <or114:MarketingCarrier>EY</or114:MarketingCarrier>
                <or114:OperatingCarrier>EY</or114:OperatingCarrier>
              </or114:Segment>
            </or114:AncillaryServiceData>
          </or114:XmlData>
        </or114:AncillaryProduct>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-or-61ac4c0a-ec09-4424-8227-a1309e36ab5c" id="61ac4c0a-ec09-4424-8227-a1309e36ab5c" type="APO">
        <or114:AncillaryProduct Id="2">
          <or114:XmlData>
            <or114:AncillaryServiceData id="52">
              <or114:NameAssociationList>
                <or114:NameAssociationTag>
                  <or114:LastName>IVANOV</or114:LastName>
                  <or114:FirstName>IVAN MR</or114:FirstName>
                  <or114:ReferenceId>1</or114:ReferenceId>
                </or114:NameAssociationTag>
              </or114:NameAssociationList>
              <or114:SegmentAssociationList>
                <or114:SegmentAssociationTag>
                  <or114:CarrierCode>EY</or114:CarrierCode>
                  <or114:FlightNumber>65</or114:FlightNumber>
                  <or114:DepartureDate>2020-09-08</or114:DepartureDate>
                  <or114:BoardPoint>AUH</or114:BoardPoint>
                  <or114:OffPoint>DME</or114:OffPoint>
                  <or114:ClassOfService>B</or114:ClassOfService>
                  <or114:BookingStatus>HK</or114:BookingStatus>
                </or114:SegmentAssociationTag>
                <or114:SegmentAssociationId>3</or114:SegmentAssociationId>
              </or114:SegmentAssociationList>
              <or114:CommercialName>UPTO33LB 15KG BAGGAGE</or114:CommercialName>
              <or114:RficCode>C</or114:RficCode>
              <or114:RficSubcode>0C1</or114:RficSubcode>
              <or114:SSRCode>ASVC</or114:SSRCode>
              <or114:OwningCarrierCode>EY</or114:OwningCarrierCode>
              <or114:BookingIndicator>01</or114:BookingIndicator>
              <or114:Vendor>ATP</or114:Vendor>
              <or114:EMDType>2</or114:EMDType>
              <or114:ServiceType>C</or114:ServiceType>
              <or114:EquivalentPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:EquivalentPrice>
              <or114:TTLPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TTLPrice>
              <or114:OriginalBasePrice>
                <or114:Price>338.00</or114:Price>
                <or114:Currency>USD</or114:Currency>
              </or114:OriginalBasePrice>
              <or114:RefundIndicator>R</or114:RefundIndicator>
              <or114:CommisionIndicator>N</or114:CommisionIndicator>
              <or114:InterlineIndicator>Y</or114:InterlineIndicator>
              <or114:FeeApplicationIndicator>4</or114:FeeApplicationIndicator>
              <or114:PassengerTypeCode>ADT</or114:PassengerTypeCode>
              <or114:BoardPoint>AUH</or114:BoardPoint>
              <or114:OffPoint>DME</or114:OffPoint>
              <or114:SimultaneousTicketIndicator>X</or114:SimultaneousTicketIndicator>
              <or114:TravelDateEffective>1980-01-01</or114:TravelDateEffective>
              <or114:LatestTravelDatePermitted>9999-12-31</or114:LatestTravelDatePermitted>
              <or114:PurchaseByDate>2020-09-06</or114:PurchaseByDate>
              <or114:TotalOriginalBasePrice>
                <or114:Price>338.00</or114:Price>
                <or114:Currency>USD</or114:Currency>
              </or114:TotalOriginalBasePrice>
              <or114:TotalEquivalentPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TotalEquivalentPrice>
              <or114:TotalTTLPrice>
                <or114:Price>20790</or114:Price>
                <or114:Currency>RUB</or114:Currency>
              </or114:TotalTTLPrice>
              <or114:FareCalculationModeIndicator>0</or114:FareCalculationModeIndicator>
              <or114:FareCalculationPriceIndicator>0</or114:FareCalculationPriceIndicator>
              <or114:NumberOfItems>1</or114:NumberOfItems>
              <or114:ActionCode>HD</or114:ActionCode>
              <or114:SegmentIndicator>P</or114:SegmentIndicator>
              <or114:FareGuaranteedIndicator>T</or114:FareGuaranteedIndicator>
              <or114:BookingSource>0</or114:BookingSource>
              <or114:TicketingIndicator>0</or114:TicketingIndicator>
              <or114:FirstTravelDate>800101</or114:FirstTravelDate>
              <or114:LastTravelDate>991231</or114:LastTravelDate>
              <or114:PurchaseTimestamp>2020-09-06T23:59:59</or114:PurchaseTimestamp>
              <or114:GroupCode>BG</or114:GroupCode>
              <or114:TicketUsedForEMDPricing>N</or114:TicketUsedForEMDPricing>
              <or114:PaperDocRequired>N</or114:PaperDocRequired>
              <or114:EMDConsummedAtIssuance/>
              <or114:TaxExemption>N</or114:TaxExemption>
              <or114:PriceMismatchAction>ACCEPT_LOWER_PRICE</or114:PriceMismatchAction>
              <or114:ACSCount>0</or114:ACSCount>
              <or114:Segment id="17" sequence="2">
                <or114:AirlineCode>EY</or114:AirlineCode>
                <or114:FlightNumber>0065</or114:FlightNumber>
                <or114:OperatingFlightNumber>0065</or114:OperatingFlightNumber>
                <or114:ClassOfService>B</or114:ClassOfService>
                <or114:DepartureDate>2020-09-08</or114:DepartureDate>
                <or114:BoardPoint>AUH</or114:BoardPoint>
                <or114:OffPoint>DME</or114:OffPoint>
                <or114:MarketingCarrier>EY</or114:MarketingCarrier>
                <or114:OperatingCarrier>EY</or114:OperatingCarrier>
              </or114:Segment>
            </or114:AncillaryServiceData>
          </or114:XmlData>
        </or114:AncillaryProduct>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT EY NN1 DMEAUH0068Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT EY NN1 AUHDME0065B08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM EY HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-33" id="33" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031885C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031885C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-34" id="34" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031885C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031885C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-35" id="35" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031886C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031886C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-36" id="36" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031886C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031886C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-41" id="41" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031887C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/6075588031887C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/6075588031887C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/6075588031887C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-47" id="47" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/INF6075588031888C1</or114:FreeText>
          <or114:FullText>TKNE EY HK1 DMEAUH0068Y01SEP/INF6075588031888C1</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0068</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>DME</or114:BoardPoint>
            <or114:OffPoint>AUH</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-48" id="48" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="EY" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/INF6075588031888C2</or114:FreeText>
          <or114:FullText>TKNE EY HK1 AUHDME0065B08SEP/INF6075588031888C2</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>EY</or114:CarrierCode>
            <or114:FlightNumber>0065</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AUH</or114:BoardPoint>
            <or114:OffPoint>DME</or114:OffPoint>
            <or114:ClassOfService>B</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="50" op="C" type="P"/>
    </stl19:UpdateResult>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="52" op="C" type="P"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}
