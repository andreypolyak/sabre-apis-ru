# Бронирование дополнительных услуг

-----

**Оглавление:**
<!-- toc -->

-----

## Алгоритм бронирования дополнительных услуг

{% imgsec "Схема", "0", "ancillaries" %}./assets/svg/Book Ancillaries/[RU]Book Ancillaries-0.svg{% endimgsec %}

<!--## Получение списка дополнительных услуг

Многие авиакомпании предлагают различные дополнительные услуги для приобретения клиентами.

Существует два варианта получения списков дополнительных услуг, которые возможно забронировать для определенного перелета:
- в результатах поиска в ответе от сервисов Bargain Finder Max
- после отправки дополнительного запроса ([AncillaryPriceRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_extras/resources)) для существующего бронирования

Однако, для того, чтобы в дальнейшем забронировать дополнительную услугу в любом случае потребуется отправить запрос к сервису AncillaryPriceRQ.

Все дополнительные услуги разбиты на группы по их типу. Каждая группа дополнительных услуг имеет двухбуквенный код. Ниже представлен список некоторых групп дополнительных услуг вместе с кодами:
- ```BG``` — багаж
- ```GT``` — наземные перевозки
- ```IE``` — развлечения на борту
- ```LG``` — доступ в залы ожидания
- ```MD``` — медицинские услуги
- ```PT``` — перевозка животных
- ```SA``` — бронирование мест в салоне
- ```ML``` — питание и напитки
- ```UN``` — несопровождаемые дети

### Получение списка дополнительных услуг в результатах поиска

Для того чтобы получить список дополнительных услуг в результатх поиска необходимо добавить элемент ```/OTA_AirLowFareSearchRQ/TravelPreferences/AncillaryFees``` в запрос и указать у этого элемента атрибут ```Enable``` со значением ```true```:

```XML
<AncillaryFees Enable="true"/>
```

В ответе на запрос будет присутствовать элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/TPA_Extensions/AncillaryFeeGroups```, содержащий информацию о предлагаемых дополнительных услуг:

```XML
<AncillaryFeeGroups>
  <AncillaryFeeGroup Code="BG" Name="BAGGAGE">
    <AncillaryFeeItem Amount="3375" Description="1ST ADDITIONAL BAG" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
    <AncillaryFeeItem Amount="3375" Description="2ND ADDITIONAL BAG" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
    <AncillaryFeeItem Amount="3375" Description="3RD OR MORE ADDITIONAL BAG" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
  </AncillaryFeeGroup>
  <AncillaryFeeGroup Code="SA" Name="SEAT ASSIGNMENT">
    <AncillaryFeeItem Amount="1050" Description="PREFERRED" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
    <AncillaryFeeItem Amount="900" Description="PREFERRED" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
    <AncillaryFeeItem Amount="1950" Description="LEG SPACE" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
    <AncillaryFeeItem Amount="1500" Description="LEG SPACE" OriginAirport="SVO" DestinationAirport="AMS" Carrier="KL" PassengerCode="ADT" Date="2016-06-01" StartSegment="1" EndSegment="1"/>
  </AncillaryFeeGroup>
</AncillaryFeeGroups>
```

Все предложенные дополнительные услуги разбитые по группам (```AncillaryFeeGroup```). У каждой группы в атрибуте указано название группы (```Name```) и код (```Code```).

Каждая группа содержит одну или несколько дополнительных услуг (```AncillaryFeeItem```), содержащих следующие данные в атрибутах:
- ```Amount``` — стоимость в валюте эквивалента
- ```Description``` — описание услуги
- ```OriginAirport``` — начало маршрута, на котором предоставляется услуга
- ```DestinationAirport``` — конец маршрута, на котором предоставляется услуга
- ```Carrier``` — перевозчик
- ```PassengerCode``` — код категории пассажира, для которого предоставляется услуга
- ```Date``` — дата предоставления услуги
- ```StartSegment``` — начальный номер сегмента на котором предоставляется услуга
- ```EndSegment``` — конечный номер сегмента на котором предоставляется услуга
-->

## Чтение бронирования (TravelItineraryReadRQ)

В качестве параметра ```UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса" %}
<TravelItineraryReadRQ Version="3.6.0" xmlns="http://services.sabre.com/res/tir/v3_6">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="RTZQZN"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<TravelItineraryReadRS Version="3.6.0" xmlns="http://services.sabre.com/res/tir/v3_6" xmlns:or="http://services.sabre.com/res/or/v1_4" xmlns:stl="http://services.sabre.com/STL/v01">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2016-05-06T08:50:36.579-05:00"/>
  </stl:ApplicationResults>
  <TravelItinerary>
    <CustomerInfo>
      <ContactNumbers>
        <ContactNumber LocationCode="MOW" Phone="9999999-M" RPH="001"/>
      </ContactNumbers>
      <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false">
        <GivenName>IVAN MR</GivenName>
        <Surname>IVANOV</Surname>
      </PersonName>
      <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false">
        <GivenName>ELENA MS</GivenName>
        <Surname>IVANOVA</Surname>
      </PersonName>
    </CustomerInfo>
    <ItineraryInfo>
      <ReservationItems>
        <Item RPH="1">
          <FlightSegment AirMilesFlown="0299" ArrivalDateTime="06-01T07:35" DayOfWeekInd="3" DepartureDateTime="2016-06-01T06:20" ElapsedTime="01.15" FlightNumber="6181" IsPast="false" NumberInParty="02" ResBookDesigCode="Y" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <DestinationLocation LocationCode="MUC" Terminal="TERMINAL 1" TerminalCode="1"/>
            <Equipment AirEquipType="321"/>
            <MarketingAirline Code="AB" FlightNumber="6181"/>
            <Meal Code="M"/>
            <OriginLocation LocationCode="TXL"/>
            <SupplierRef ID="DCAB*RTZQIO"/>
            <UpdatedArrivalTime>06-01T07:35</UpdatedArrivalTime>
            <UpdatedDepartureTime>06-01T06:20</UpdatedDepartureTime>
          </FlightSegment>
        </Item>
        <Item RPH="2">
          <FlightSegment AirMilesFlown="0299" ArrivalDateTime="06-02T07:30" DayOfWeekInd="4" DepartureDateTime="2016-06-02T06:20" ElapsedTime="01.10" FlightNumber="6180" IsPast="false" NumberInParty="02" ResBookDesigCode="Y" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <DestinationLocation LocationCode="TXL"/>
            <Equipment AirEquipType="320"/>
            <MarketingAirline Code="AB" FlightNumber="6180"/>
            <Meal Code="M"/>
            <OriginLocation LocationCode="MUC" Terminal="TERMINAL 1" TerminalCode="1"/>
            <SupplierRef ID="DCAB*RTZQIO"/>
            <UpdatedArrivalTime>06-02T07:30</UpdatedArrivalTime>
            <UpdatedDepartureTime>06-02T06:20</UpdatedDepartureTime>
          </FlightSegment>
        </Item>
      </ReservationItems>
      <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
    </ItineraryInfo>
    <ItineraryRef AirExtras="false" ID="RTZQZN" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <Source AAA_PseudoCityCode="9LSC" CreateDateTime="2016-05-06T08:49" CreationAgent="HPA" HomePseudoCityCode="NSU" LastUpdateDateTime="2016-05-06T08:49" PseudoCityCode="9LSC" ReceivedFrom="AP" SequenceNumber="1"/>
    </ItineraryRef>
  </TravelItinerary>
</TravelItineraryReadRS>
{% endxmlsec %}

## Получение списка дополнительных услуг для бронирования (AncillaryPriceRQ)

Для получения списка доступных дополнительных услуг для текущего бронирования используется сервис [AncillaryPriceRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_extras/resources).

Сервис имеет несколько режимов работы:
- Stateful — получение списка дополнительных услуг для бронирования открытого в текущей сессии
- Stateless — получение списка дополнительных услуг для бронирования по его коду
- Payload — получение списка дополнительных услуг для бронирования заданного в запросе к сервису

В данном руководстве рассматривается только первый режим работы — Stateful.

Все дополнительные услуги разбиты на группы по их типу. Каждая группа дополнительных услуг имеет двухбуквенный код. Ниже представлен список некоторых групп дополнительных услуг вместе с кодами:
- ```BG``` — багаж
- ```GT``` — наземные перевозки
- ```IE``` — развлечения на борту
- ```LG``` — доступ в залы ожидания
- ```MD``` — медицинские услуги
- ```PT``` — перевозка животных
- ```SA``` — бронирование мест в салоне
- ```ML``` — питание и напитки
- ```UN``` — несопровождаемые дети

{% xmlsec "Пример запроса" %}
<GetPriceListRQ Version="1.3.1" xmlns="http://webservices.sabre.com/pnrbuilder">
  <RequestType>Stateful</RequestType>
</GetPriceListRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<GetPriceListRS xmlns="http://webservices.sabre.com/pnrbuilder" xmlns:ns2="http://services.sabre.com/STL/v01">
  <AncillaryPriceList>
    <Itinerary ItineraryID="1">
      <AncillaryGroup GroupCode="BD"/>
      <AncillaryGroup GroupCode="BG">
        <AncillaryService>
          <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0DA</RficSubcode>
          <SSRCode>WBAG</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>50.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-06-01T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>BICYCLE</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0EC</RficSubcode>
          <SSRCode>BIKE</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>5250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>5250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>70.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>10</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>SPORTING FIREARMS</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0ED</RficSubcode>
          <SSRCode>WEAP</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>50.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-06-01T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>999</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>OVER70LB 32KG BAGGAGE</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0ES</RficSubcode>
          <SSRCode>BULK</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>15000</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>15000</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>200.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>999</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>SPORTING EQUIPMENT</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0F8</RficSubcode>
          <SSRCode>SPEQ</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>50.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>PREPAID 2ND TO 5TH ADD PC 23</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0IB</RficSubcode>
          <SSRCode>CBAG</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>5250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>5250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>70.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>PREPAID 2ND TO 5TH ADD PC 32</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0IF</RficSubcode>
          <SSRCode>DBAG</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>9000</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>9000</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>120.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="FF"/>
      <AncillaryGroup GroupCode="GT"/>
      <AncillaryGroup GroupCode="IE"/>
      <AncillaryGroup GroupCode="LG">
        <AncillaryService>
          <CommercialName>EXECUTIVE LOUNGE ON ARRIVAL</CommercialName>
          <RficCode>E</RficCode>
          <RficSubcode>013</RficSubcode>
          <SSRCode>LOGV</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3000</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3000</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>40.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-04-11</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>15</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="MD">
        <AncillaryService>
          <CommercialName>MEDICAL ASSISTANCE</CommercialName>
          <RficCode>E</RficCode>
          <RficSubcode>0B2</RficSubcode>
          <SSRCode>AOXY</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3750</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>50.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <ServiceAvailableIndicator>true</ServiceAvailableIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-02-17</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>10</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="ML">
        <AncillaryService>
          <CommercialName>LARGE BOTTLE OF CHAMPAGNE</CommercialName>
          <RficCode>G</RficCode>
          <RficSubcode>01S</RficSubcode>
          <SSRCode>CHAM</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>30.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <ServiceAvailableIndicator>true</ServiceAvailableIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-02-26</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>KOSHER DINNER</CommercialName>
          <RficCode>G</RficCode>
          <RficSubcode>0AO</RficSubcode>
          <SSRCode>HMML</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>375</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>375</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>5.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-02-17</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>4</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>ALCOHOLIC DRINK CHAMPAIGN</CommercialName>
          <RficCode>G</RficCode>
          <RficSubcode>0AV</RficSubcode>
          <SSRCode>CHAM</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>0</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>0</Price>
            </OriginalBasePrice>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <NoChargeNotAvailIndicator>X</NoChargeNotAvailIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>999</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>XTRA LARGE BOTTLE OF CHAMPAGNE</CommercialName>
          <RficCode>G</RficCode>
          <RficSubcode>S20</RficSubcode>
          <SSRCode>CHAM</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>30.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-02-17</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>SPARKLING WINE</CommercialName>
          <RficCode>G</RficCode>
          <RficSubcode>SET</RficSubcode>
          <SSRCode>SEKT</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>0</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>0</Price>
            </OriginalBasePrice>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <NoChargeNotAvailIndicator>X</NoChargeNotAvailIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="PT">
        <AncillaryService>
          <CommercialName>AVIH UP TO 12 KG 60X45X40 CM</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>036</RficSubcode>
          <SSRCode>AVIH</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>5625</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>5625</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>75.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-06-01T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>AVIH 13 TO 50 KG 100X65X70 CM</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>037</RficSubcode>
          <SSRCode>AVIH</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>7500</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>7500</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>100.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-06-01T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>AVIH 50 TO 100 KG 125X75X85 CM</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>038</RficSubcode>
          <SSRCode>AVIH</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>9375</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>9375</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>125.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-06-01T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
        <AncillaryService>
          <CommercialName>PET IN CABIN</CommercialName>
          <RficCode>C</RficCode>
          <RficSubcode>0BT</RficSubcode>
          <SSRCode>PETC</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>3000</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>3000</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>P</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>40.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="SA">
        <AncillaryService>
          <CommercialName>SEAT ASSIGNMENT</CommercialName>
          <RficCode>A</RficCode>
          <RficSubcode>0B5</RficSubcode>
          <SSRCode>SEAT</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>ATP</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>19.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>27.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>27.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>O</Code>
                  <DisplayDescription>PREFERRED</DisplayDescription>
                  <AbbreviatedDescription>PREM</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>1125</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>1125</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>15.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>19.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>19.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>30.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>30.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2250</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>30.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>FC</Code>
                  <DisplayDescription>FRONT OF CABIN</DisplayDescription>
                  <AbbreviatedDescription>FCAB</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>1425</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>19.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>27.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2025</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>27.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>2550</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>34.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <SeatCharacteristics>
              <SeatCharacteristicSequence>
                <SeatCharacteristicData>
                  <Code>L</Code>
                  <DisplayDescription>LEG SPACE</DisplayDescription>
                  <AbbreviatedDescription>LEGSP</AbbreviatedDescription>
                </SeatCharacteristicData>
              </SeatCharacteristicSequence>
            </SeatCharacteristics>
          </optionalAncillaryServiceInformation>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>675</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>675</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>9.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <InterlineIndicator>Y</InterlineIndicator>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <TaxIndication>X</TaxIndication>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <TravelDateEffective>1980-01-01</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-31T00:00:00</PurchaseByDate>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="SB"/>
      <AncillaryGroup GroupCode="TS"/>
      <AncillaryGroup GroupCode="UN">
        <AncillaryService>
          <CommercialName>MEET AND GREET 3</CommercialName>
          <RficCode>E</RficCode>
          <RficSubcode>02Y</RficSubcode>
          <SSRCode>UMNR</SSRCode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator>01</BookingIndicator>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>6000</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>6000</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>80.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <ServiceAvailableIndicator>true</ServiceAvailableIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-02-17</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
            <AEInventory segmentId="1">
              <Count>5</Count>
            </AEInventory>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
      <AncillaryGroup GroupCode="UP">
        <AncillaryService>
          <CommercialName>UPGRADE ECON TO PREM</CommercialName>
          <RficCode>A</RficCode>
          <RficSubcode>UP1</RficSubcode>
          <OwningCarrierCode>AB</OwningCarrierCode>
          <BookingIndicator/>
          <Vendor>MMGR</Vendor>
          <EMDType>2</EMDType>
          <optionalAncillaryServiceInformation>
            <SegmentNumber>1</SegmentNumber>
            <EquivalentPrice>
              <Price>7500</Price>
              <Currency>RUB</Currency>
            </EquivalentPrice>
            <TTLPrice>
              <Price>7500</Price>
              <Currency>RUB</Currency>
            </TTLPrice>
            <PortionOfTravelIndicator>S</PortionOfTravelIndicator>
            <OriginalBasePrice>
              <Price>100.00</Price>
              <Currency>EUR</Currency>
            </OriginalBasePrice>
            <RefundIndicator>Y</RefundIndicator>
            <CommisionIndicator>N</CommisionIndicator>
            <FeeApplicationIndicator>3</FeeApplicationIndicator>
            <PassengerTypeCode>ADT</PassengerTypeCode>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <SoftMatchIndicator>false</SoftMatchIndicator>
            <SimultaneousTicketIndicator>X</SimultaneousTicketIndicator>
            <FormOfRefund>1</FormOfRefund>
            <FeeNotGuaranteedIndicator>true</FeeNotGuaranteedIndicator>
            <TravelDateEffective>2016-04-27</TravelDateEffective>
            <LatestTravelDatePermitted>9999-12-31</LatestTravelDatePermitted>
            <PurchaseByDate>2016-05-06T23:59:59</PurchaseByDate>
            <TaxExemptIndicator>N</TaxExemptIndicator>
            <TravelerRefNrType RPH="1" SurnameRefNr="1"/>
          </optionalAncillaryServiceInformation>
        </AncillaryService>
      </AncillaryGroup>
    </Itinerary>
  </AncillaryPriceList>
</GetPriceListRS>
{% endxmlsec %}

## Добавление дополнительной услуги в бронирование (UpdateReservationRQ)

Для добавления услуги в бронирование используется сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary/resources). Он также может работать в нескольких режимах, в данном документе рассматривается только Stateful режим.

Для каждой добавляемой дополнительной услуги (элемент ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem/AncillaryServicesUpdate```) необходимо указать:
- информацию о пассажире (```NameAssociationList/NameAssociationTag```):
    - ```LastName``` — фамилия
    - ```FirstName``` — имя (с титулом! Например ```IVAN MR```)
    - ```NameRefNumber``` — номер пассажира
- информацию о сегменте (```SegmentAssociationList/SegmentAssociationTag```):
    - ```CarrierCode``` — двухбуквенный код перевозчика
    - ```FlightNumber``` — номер рейса
    - ```DepartureDate``` — дата вылета
    - ```BoardPoint``` — аэропорт вылета
    - ```OffPoint``` — аэропорт прилета
    - ```ClassOfService``` — класс бронирования
    - ```BookingStatus``` — статус сегмента
- информацию о дополнительной услуге, которую можно получить из результата выполнения запроса к сервису GetPriceListRQ:
    - ```RficCode``` — код RFIC услуги, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/RficCode```
    - ```RficSubcode``` — субкод RFIC услуги, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/RficCode```
    - ```OwningCarrierCode``` — двухбуквенный код перевозчика, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/OwningCarrierCode```
    - ```OriginalBasePrice/Price``` — стоимость услуги, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/optionalAncillaryServiceInformation/OriginalBasePrice/Price```
    - ```OriginalBasePrice/Currency``` — валюта стоимости услуги, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/optionalAncillaryServiceInformation/OriginalBasePrice/Currency```
    - ```NumberOfItems``` — количество предоставляемых услуг
    - ```GroupCode``` — код группы услуг, из ```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/@GroupCode```

{% xmlsec "Пример запроса" %}
<UpdateReservationRQ Version="1.12.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_12">
  <RequestType>Stateful</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
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
            <CarrierCode>AB</CarrierCode>
            <FlightNumber>6180</FlightNumber>
            <DepartureDate>2016-06-01</DepartureDate>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <RficCode>C</RficCode>
        <RficSubcode>0DA</RficSubcode>
        <OwningCarrierCode>AB</OwningCarrierCode>
        <TTLPrice>
          <Price>3750</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <GroupCode>BG</GroupCode>
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
            <CarrierCode>AB</CarrierCode>
            <FlightNumber>6181</FlightNumber>
            <DepartureDate>2016-06-02</DepartureDate>
            <BoardPoint>TXL</BoardPoint>
            <OffPoint>MUC</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <RficCode>C</RficCode>
        <RficSubcode>0DA</RficSubcode>
        <OwningCarrierCode>AB</OwningCarrierCode>
        <TTLPrice>
          <Price>3750</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <GroupCode>BG</GroupCode>
      </AncillaryServicesUpdate>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate op="C">
        <NameAssociationList>
          <NameAssociationTag>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociationTag>
        </NameAssociationList>
        <SegmentAssociationList>
          <SegmentAssociationTag>
            <CarrierCode>AB</CarrierCode>
            <FlightNumber>6180</FlightNumber>
            <DepartureDate>2016-06-01</DepartureDate>
            <BoardPoint>MUC</BoardPoint>
            <OffPoint>TXL</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <RficCode>C</RficCode>
        <RficSubcode>0DA</RficSubcode>
        <OwningCarrierCode>AB</OwningCarrierCode>
        <TTLPrice>
          <Price>3750</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <GroupCode>BG</GroupCode>
      </AncillaryServicesUpdate>
    </ReservationUpdateItem>
    <ReservationUpdateItem>
      <AncillaryServicesUpdate op="C">
        <NameAssociationList>
          <NameAssociationTag>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociationTag>
        </NameAssociationList>
        <SegmentAssociationList>
          <SegmentAssociationTag>
            <CarrierCode>AB</CarrierCode>
            <FlightNumber>6181</FlightNumber>
            <DepartureDate>2016-06-02</DepartureDate>
            <BoardPoint>TXL</BoardPoint>
            <OffPoint>MUC</OffPoint>
            <ClassOfService>Y</ClassOfService>
            <BookingStatus>HK</BookingStatus>
          </SegmentAssociationTag>
        </SegmentAssociationList>
        <RficCode>C</RficCode>
        <RficSubcode>0DA</RficSubcode>
        <OwningCarrierCode>AB</OwningCarrierCode>
        <TTLPrice>
          <Price>3750</Price>
          <Currency>RUB</Currency>
        </TTLPrice>
        <NumberOfItems>1</NumberOfItems>
        <GroupCode>BG</GroupCode>
      </AncillaryServicesUpdate>
    </ReservationUpdateItem>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<UpdateReservationRS xmlns="http://webservices.sabre.com/pnrbuilder/v1_12" xmlns:ns3="http://tds.sabre.com/itinerary" xmlns:ns4="http://services.sabre.com/res/or/v1_5" xmlns:ns4_="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0">
  <Success>OK</Success>
  <Reservation NumberInSegment="2" numberInParty="2" numberOfInfants="0">
    <BookingDetails>
      <RecordLocator>KBFUBP</RecordLocator>
      <CreationTimestamp>2016-05-05T09:52:00</CreationTimestamp>
      <SystemCreationTimestamp>2016-05-05T09:52:00</SystemCreationTimestamp>
      <CreationAgentID>HPA</CreationAgentID>
      <UpdateTimestamp>2016-05-05T09:55:39</UpdateTimestamp>
      <PNRSequence>2</PNRSequence>
      <FlightsRange End="2016-06-02T07:35:00" Start="2016-06-01T06:20:00"/>
      <DivideSplitDetails/>
      <EstimatedPurgeTimestamp>2016-06-02T00:00:00</EstimatedPurgeTimestamp>
      <UpdateToken>-8127bbbdc0aa0465d5be42f46443b97ee54e825c15a1da8</UpdateToken>
    </BookingDetails>
    <POS>
      <Source AgentDutyCode="*" AgentSine="HPA" AirlineVendorID="AA" BookingSource="02AA" HomePseudoCityCode="NSU" ISOCountry="RU" PseudoCityCode="02AA"/>
    </POS>
    <PassengerReservation>
      <Passengers>
        <Passenger id="4" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT">
          <LastName>IVANOV</LastName>
          <FirstName>IVAN MR</FirstName>
          <Seats/>
          <AncillaryServices>
            <AncillaryService elementId="pnr-14" id="14" sequenceNumber="1">
              <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
              <RficCode>C</RficCode>
              <RficSubcode>0DA</RficSubcode>
              <SSRCode>WBAG</SSRCode>
              <OwningCarrierCode>AB</OwningCarrierCode>
              <BookingIndicator>01</BookingIndicator>
              <Vendor>ATP</Vendor>
              <EMDType>2</EMDType>
              <EquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </EquivalentPrice>
              <TTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TTLPrice>
              <OriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </OriginalBasePrice>
              <RefundIndicator>Y</RefundIndicator>
              <CommisionIndicator>N</CommisionIndicator>
              <InterlineIndicator>Y</InterlineIndicator>
              <FeeApplicationIndicator>4</FeeApplicationIndicator>
              <PassengerTypeCode>ADT</PassengerTypeCode>
              <BoardPoint>MUC</BoardPoint>
              <OffPoint>TXL</OffPoint>
              <TaxesIncluded>true</TaxesIncluded>
              <Taxes/>
              <TotalOriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </TotalOriginalBasePrice>
              <TotalEquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalEquivalentPrice>
              <TotalTTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalTTLPrice>
              <TotalTaxes/>
              <NumberOfItems>1</NumberOfItems>
              <ActionCode>HD</ActionCode>
              <SegmentIndicator>P</SegmentIndicator>
              <RefundFormIndicator>1</RefundFormIndicator>
              <AdvancePurchaseIndicator>X</AdvancePurchaseIndicator>
              <BookingSource>0</BookingSource>
              <TicketingIndicator>0</TicketingIndicator>
              <FirstTravelDate>800101</FirstTravelDate>
              <LastTravelDate>991231</LastTravelDate>
              <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
              <GroupCode>BG</GroupCode>
              <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
              <EMDConsummedAtIssuance/>
              <PaperDocRequired>N</PaperDocRequired>
              <TaxExemption>N</TaxExemption>
              <ACSCount>0</ACSCount>
              <Segment id="11" sequence="1">
                <AirlineCode>AB</AirlineCode>
                <FlightNumber>6180</FlightNumber>
                <ClassOfService>Y</ClassOfService>
                <DepartureDate>2016-06-01</DepartureDate>
                <BoardPoint>MUC</BoardPoint>
                <OffPoint>TXL</OffPoint>
                <MarketingCarrier>AB</MarketingCarrier>
                <OperatingCarrier>AB</OperatingCarrier>
              </Segment>
            </AncillaryService>
            <AncillaryService elementId="pnr-16" id="16" sequenceNumber="2">
              <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
              <RficCode>C</RficCode>
              <RficSubcode>0DA</RficSubcode>
              <SSRCode>WBAG</SSRCode>
              <OwningCarrierCode>AB</OwningCarrierCode>
              <BookingIndicator>01</BookingIndicator>
              <Vendor>ATP</Vendor>
              <EMDType>2</EMDType>
              <EquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </EquivalentPrice>
              <TTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TTLPrice>
              <OriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </OriginalBasePrice>
              <RefundIndicator>Y</RefundIndicator>
              <CommisionIndicator>N</CommisionIndicator>
              <InterlineIndicator>Y</InterlineIndicator>
              <FeeApplicationIndicator>4</FeeApplicationIndicator>
              <PassengerTypeCode>ADT</PassengerTypeCode>
              <BoardPoint>TXL</BoardPoint>
              <OffPoint>MUC</OffPoint>
              <TaxesIncluded>true</TaxesIncluded>
              <Taxes/>
              <TotalOriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </TotalOriginalBasePrice>
              <TotalEquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalEquivalentPrice>
              <TotalTTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalTTLPrice>
              <TotalTaxes/>
              <NumberOfItems>1</NumberOfItems>
              <ActionCode>HD</ActionCode>
              <SegmentIndicator>P</SegmentIndicator>
              <RefundFormIndicator>1</RefundFormIndicator>
              <AdvancePurchaseIndicator>X</AdvancePurchaseIndicator>
              <BookingSource>0</BookingSource>
              <TicketingIndicator>0</TicketingIndicator>
              <FirstTravelDate>800101</FirstTravelDate>
              <LastTravelDate>991231</LastTravelDate>
              <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
              <GroupCode>BG</GroupCode>
              <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
              <EMDConsummedAtIssuance/>
              <PaperDocRequired>N</PaperDocRequired>
              <TaxExemption>N</TaxExemption>
              <ACSCount>0</ACSCount>
              <Segment id="12" sequence="2">
                <AirlineCode>AB</AirlineCode>
                <FlightNumber>6181</FlightNumber>
                <ClassOfService>Y</ClassOfService>
                <DepartureDate>2016-06-02</DepartureDate>
                <BoardPoint>TXL</BoardPoint>
                <OffPoint>MUC</OffPoint>
                <MarketingCarrier>AB</MarketingCarrier>
                <OperatingCarrier>AB</OperatingCarrier>
              </Segment>
            </AncillaryService>
          </AncillaryServices>
        </Passenger>
        <Passenger id="6" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <LastName>IVANOVA</LastName>
          <FirstName>ELENA MS</FirstName>
          <Seats/>
          <AncillaryServices>
            <AncillaryService elementId="pnr-18" id="18" sequenceNumber="3">
              <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
              <RficCode>C</RficCode>
              <RficSubcode>0DA</RficSubcode>
              <SSRCode>WBAG</SSRCode>
              <OwningCarrierCode>AB</OwningCarrierCode>
              <BookingIndicator>01</BookingIndicator>
              <Vendor>ATP</Vendor>
              <EMDType>2</EMDType>
              <EquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </EquivalentPrice>
              <TTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TTLPrice>
              <OriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </OriginalBasePrice>
              <RefundIndicator>Y</RefundIndicator>
              <CommisionIndicator>N</CommisionIndicator>
              <InterlineIndicator>Y</InterlineIndicator>
              <FeeApplicationIndicator>4</FeeApplicationIndicator>
              <PassengerTypeCode>ADT</PassengerTypeCode>
              <BoardPoint>MUC</BoardPoint>
              <OffPoint>TXL</OffPoint>
              <TaxesIncluded>true</TaxesIncluded>
              <Taxes/>
              <TotalOriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </TotalOriginalBasePrice>
              <TotalEquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalEquivalentPrice>
              <TotalTTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalTTLPrice>
              <TotalTaxes/>
              <NumberOfItems>1</NumberOfItems>
              <ActionCode>HD</ActionCode>
              <SegmentIndicator>P</SegmentIndicator>
              <RefundFormIndicator>1</RefundFormIndicator>
              <AdvancePurchaseIndicator>X</AdvancePurchaseIndicator>
              <BookingSource>0</BookingSource>
              <TicketingIndicator>0</TicketingIndicator>
              <FirstTravelDate>800101</FirstTravelDate>
              <LastTravelDate>991231</LastTravelDate>
              <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
              <GroupCode>BG</GroupCode>
              <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
              <EMDConsummedAtIssuance/>
              <PaperDocRequired>N</PaperDocRequired>
              <TaxExemption>N</TaxExemption>
              <ACSCount>0</ACSCount>
              <Segment id="11" sequence="1">
                <AirlineCode>AB</AirlineCode>
                <FlightNumber>6180</FlightNumber>
                <ClassOfService>Y</ClassOfService>
                <DepartureDate>2016-06-01</DepartureDate>
                <BoardPoint>MUC</BoardPoint>
                <OffPoint>TXL</OffPoint>
                <MarketingCarrier>AB</MarketingCarrier>
                <OperatingCarrier>AB</OperatingCarrier>
              </Segment>
            </AncillaryService>
            <AncillaryService elementId="pnr-20" id="20" sequenceNumber="4">
              <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
              <RficCode>C</RficCode>
              <RficSubcode>0DA</RficSubcode>
              <SSRCode>WBAG</SSRCode>
              <OwningCarrierCode>AB</OwningCarrierCode>
              <BookingIndicator>01</BookingIndicator>
              <Vendor>ATP</Vendor>
              <EMDType>2</EMDType>
              <EquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </EquivalentPrice>
              <TTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TTLPrice>
              <OriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </OriginalBasePrice>
              <RefundIndicator>Y</RefundIndicator>
              <CommisionIndicator>N</CommisionIndicator>
              <InterlineIndicator>Y</InterlineIndicator>
              <FeeApplicationIndicator>4</FeeApplicationIndicator>
              <PassengerTypeCode>ADT</PassengerTypeCode>
              <BoardPoint>TXL</BoardPoint>
              <OffPoint>MUC</OffPoint>
              <TaxesIncluded>true</TaxesIncluded>
              <Taxes/>
              <TotalOriginalBasePrice>
                <Price>50.00</Price>
                <Currency>EUR</Currency>
              </TotalOriginalBasePrice>
              <TotalEquivalentPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalEquivalentPrice>
              <TotalTTLPrice>
                <Price>3750</Price>
                <Currency>RUB</Currency>
              </TotalTTLPrice>
              <TotalTaxes/>
              <NumberOfItems>1</NumberOfItems>
              <ActionCode>HD</ActionCode>
              <SegmentIndicator>P</SegmentIndicator>
              <RefundFormIndicator>1</RefundFormIndicator>
              <AdvancePurchaseIndicator>X</AdvancePurchaseIndicator>
              <BookingSource>0</BookingSource>
              <TicketingIndicator>0</TicketingIndicator>
              <FirstTravelDate>800101</FirstTravelDate>
              <LastTravelDate>991231</LastTravelDate>
              <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
              <GroupCode>BG</GroupCode>
              <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
              <EMDConsummedAtIssuance/>
              <PaperDocRequired>N</PaperDocRequired>
              <TaxExemption>N</TaxExemption>
              <ACSCount>0</ACSCount>
              <Segment id="12" sequence="2">
                <AirlineCode>AB</AirlineCode>
                <FlightNumber>6181</FlightNumber>
                <ClassOfService>Y</ClassOfService>
                <DepartureDate>2016-06-02</DepartureDate>
                <BoardPoint>TXL</BoardPoint>
                <OffPoint>MUC</OffPoint>
                <MarketingCarrier>AB</MarketingCarrier>
                <OperatingCarrier>AB</OperatingCarrier>
              </Segment>
            </AncillaryService>
          </AncillaryServices>
        </Passenger>
      </Passengers>
      <Segments>
        <Poc>
          <Airport>MUC</Airport>
          <Departure>2016-06-01T06:20:00</Departure>
        </Poc>
        <Segment id="11" sequence="1">
          <Air id="11" isPast="false" segmentAssociationId="3" sequence="1">
            <DepartureAirport>MUC</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <ArrivalAirport>TXL</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <OperatingAirlineCode>AB</OperatingAirlineCode>
            <OperatingAirlineShortName>AIR BERLIN PLC AND CO</OperatingAirlineShortName>
            <EquipmentType>320</EquipmentType>
            <MarketingAirlineCode>AB</MarketingAirlineCode>
            <MarketingFlightNumber>6180</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <Seats/>
            <AirlineRefId>DCAB*NIERVQ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2016-06-01T06:20:00</DepartureDateTime>
            <ArrivalDateTime>2016-06-01T07:30:00</ArrivalDateTime>
            <FlightNumber>6180</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>2</NumberInParty>
            <SegmentSpecialRequests/>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <AncillaryServices>
              <AncillaryService ref="14"/>
              <AncillaryService ref="18"/>
            </AncillaryServices>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2016-05-05T09:52:00</SegmentBookedDate>
          </Air>
        </Segment>
        <Segment id="12" sequence="2">
          <Air id="12" isPast="false" segmentAssociationId="2" sequence="2">
            <DepartureAirport>TXL</DepartureAirport>
            <DepartureAirportCodeContext>IATA</DepartureAirportCodeContext>
            <ArrivalAirport>MUC</ArrivalAirport>
            <ArrivalAirportCodeContext>IATA</ArrivalAirportCodeContext>
            <OperatingAirlineCode>AB</OperatingAirlineCode>
            <OperatingAirlineShortName>AIR BERLIN PLC AND CO</OperatingAirlineShortName>
            <EquipmentType>321</EquipmentType>
            <MarketingAirlineCode>AB</MarketingAirlineCode>
            <MarketingFlightNumber>6181</MarketingFlightNumber>
            <OperatingClassOfService>Y</OperatingClassOfService>
            <MarketingClassOfService>Y</MarketingClassOfService>
            <Seats/>
            <AirlineRefId>DCAB*NIERVQ</AirlineRefId>
            <Eticket>true</Eticket>
            <DepartureDateTime>2016-06-02T06:20:00</DepartureDateTime>
            <ArrivalDateTime>2016-06-02T07:35:00</ArrivalDateTime>
            <FlightNumber>6181</FlightNumber>
            <ClassOfService>Y</ClassOfService>
            <ActionCode>HK</ActionCode>
            <NumberInParty>2</NumberInParty>
            <SegmentSpecialRequests/>
            <inboundConnection>false</inboundConnection>
            <outboundConnection>false</outboundConnection>
            <AncillaryServices>
              <AncillaryService ref="16"/>
              <AncillaryService ref="20"/>
            </AncillaryServices>
            <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
            <SegmentBookedDate>2016-05-05T09:55:00</SegmentBookedDate>
          </Air>
        </Segment>
      </Segments>
      <TicketingInfo>
        <FutureTicketing id="8" index="1">
          <Code>TAW</Code>
        </FutureTicketing>
      </TicketingInfo>
      <ItineraryPricing/>
    </PassengerReservation>
    <ReceivedFrom>
      <Name>AP</Name>
    </ReceivedFrom>
    <PhoneNumbers>
      <PhoneNumber id="10" index="1">
        <CityCode>MOW</CityCode>
        <Number>99999999-M</Number>
      </PhoneNumber>
    </PhoneNumbers>
    <EmailAddresses/>
  </Reservation>
  <Results>
    <UpdateResult Status="SUCCESS" UpdateId="">
      <Item id="18" op="C" type="P">
        <AncillaryServicePricing>
          <OriginalBasePrice>
            <Price>50.00</Price>
            <Currency>EUR</Currency>
          </OriginalBasePrice>
          <EquivalentPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </EquivalentPrice>
          <TTLPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </TTLPrice>
        </AncillaryServicePricing>
        <OpenReservationElement/>
      </Item>
    </UpdateResult>
    <UpdateResult Status="SUCCESS" UpdateId="">
      <Item id="20" op="C" type="P">
        <AncillaryServicePricing>
          <OriginalBasePrice>
            <Price>50.00</Price>
            <Currency>EUR</Currency>
          </OriginalBasePrice>
          <EquivalentPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </EquivalentPrice>
          <TTLPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </TTLPrice>
        </AncillaryServicePricing>
        <OpenReservationElement/>
      </Item>
    </UpdateResult>
    <UpdateResult Status="SUCCESS" UpdateId="">
      <Item id="14" op="C" type="P">
        <AncillaryServicePricing>
          <OriginalBasePrice>
            <Price>50.00</Price>
            <Currency>EUR</Currency>
          </OriginalBasePrice>
          <EquivalentPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </EquivalentPrice>
          <TTLPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </TTLPrice>
        </AncillaryServicePricing>
        <OpenReservationElement/>
      </Item>
    </UpdateResult>
    <UpdateResult Status="SUCCESS" UpdateId="">
      <Item id="16" op="C" type="P">
        <AncillaryServicePricing>
          <OriginalBasePrice>
            <Price>50.00</Price>
            <Currency>EUR</Currency>
          </OriginalBasePrice>
          <EquivalentPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </EquivalentPrice>
          <TTLPrice>
            <Price>3750</Price>
            <Currency>RUB</Currency>
          </TTLPrice>
        </AncillaryServicePricing>
        <OpenReservationElement/>
      </Item>
    </UpdateResult>
  </Results>
</UpdateReservationRS>
{% endxmlsec %}

## Отправка SSR и сохранение бронирования (PassengerDetailsRQ)

Некоторые перевозчики требуют отправить SSR с запросом на добавленные в бронирование дополнительные услуги. Для этого используется сервис [PassengerDetailsRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/passenger_details/resources) (см. [Создание бронирований](/create-booking.md)).

В запросе для каждого SSR (```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service```) указывается:
- ```@SSR_Code``` — категория SSR, можно получить из ответа на запрос к сервису GetPriceListRQ (```/GetPriceListRS/AncillaryPriceList/Itinerary/AncillaryGroup/AncillaryService/SSRCode```)
- ```@SegmentNumber``` — номер сегмента
- ```PersonName/@NameNumber``` — номер пассажира
- ```Text``` — текст запроса (регламентируется перевозчиком)

После отправки SSR бронирование сохраняется (```/PassengerDetailsRQ/PostProcessing/EndTransactionRQ/EndTransaction```).

{% xmlsec "Пример запроса" %}
<PassengerDetailsRQ HaltOnError="true" IgnoreOnError="true" version="3.3.0" xmlns="http://services.sabre.com/sp/pd/v3_3">
  <PostProcessing IgnoreAfter="false" RedisplayReservation="true">
    <EndTransactionRQ>
      <EndTransaction Ind="true"/>
      <Source ReceivedFrom="SWS"/>
    </EndTransactionRQ>
  </PostProcessing>
  <SpecialReqDetails>
    <SpecialServiceRQ>
      <SpecialServiceInfo>
        <Service SSR_Code="WBAG" SegmentNumber="1">
          <PersonName NameNumber="1.1"/>
          <Text>PREPAID</Text>
          <VendorPrefs>
            <Airline Hosted="false"/>
          </VendorPrefs>
        </Service>
        <Service SSR_Code="WBAG" SegmentNumber="2">
          <PersonName NameNumber="1.1"/>
          <Text>PREPAID</Text>
          <VendorPrefs>
            <Airline Hosted="false"/>
          </VendorPrefs>
        </Service>
        <Service SSR_Code="WBAG" SegmentNumber="1">
          <PersonName NameNumber="2.1"/>
          <Text>PREPAID</Text>
          <VendorPrefs>
            <Airline Hosted="false"/>
          </VendorPrefs>
        </Service>
        <Service SSR_Code="WBAG" SegmentNumber="2">
          <PersonName NameNumber="2.1"/>
          <Text>PREPAID</Text>
          <VendorPrefs>
            <Airline Hosted="false"/>
          </VendorPrefs>
        </Service>
      </SpecialServiceInfo>
    </SpecialServiceRQ>
  </SpecialReqDetails>
</PassengerDetailsRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<PassengerDetailsRS xmlns="http://services.sabre.com/sp/pd/v3_3">
  <ns2:ApplicationResults status="Complete" xmlns:ns2="http://services.sabre.com/STL_Payload/v02_01">
    <ns2:Success timeStamp="2016-05-05T10:01:15.648-05:00"/>
    <ns2:Warning timeStamp="2016-05-05T10:01:15.183-05:00" type="BusinessLogic">
      <ns2:SystemSpecificResults>
        <ns2:Message code="WARN.SWS.HOST.WARNING_RESPONSE">TTY REQ PEND</ns2:Message>
      </ns2:SystemSpecificResults>
    </ns2:Warning>
  </ns2:ApplicationResults>
  <ItineraryRef ID="KBFUBP"/>
  <TravelItineraryReadRS>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber LocationCode="MOW" Phone="99999999-M" RPH="001"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false">
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false">
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="0299" ArrivalDateTime="06-01T07:30" DayOfWeekInd="3" DepartureDateTime="2016-06-01T06:20" ElapsedTime="01.10" FlightNumber="6180" NumberInParty="02" ResBookDesigCode="Y" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="TXL"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="AB" FlightNumber="6180"/>
              <Meal Code="M"/>
              <OriginLocation LocationCode="MUC" Terminal="TERMINAL 1" TerminalCode="1"/>
              <SupplierRef ID="DCAB*NIERVQ"/>
              <UpdatedArrivalTime>06-01T07:30</UpdatedArrivalTime>
              <UpdatedDepartureTime>06-01T06:20</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0299" ArrivalDateTime="06-02T07:35" DayOfWeekInd="4" DepartureDateTime="2016-06-02T06:20" ElapsedTime="01.15" FlightNumber="6181" NumberInParty="02" ResBookDesigCode="Y" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="MUC" Terminal="TERMINAL 1" TerminalCode="1"/>
              <Equipment AirEquipType="321"/>
              <MarketingAirline Code="AB" FlightNumber="6181"/>
              <Meal Code="M"/>
              <OriginLocation LocationCode="TXL"/>
              <SupplierRef ID="DCAB*NIERVQ"/>
              <UpdatedArrivalTime>06-02T07:35</UpdatedArrivalTime>
              <UpdatedDepartureTime>06-02T06:20</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="3">
            <Ancillaries>
              <AncillaryService ActionCode="HD" AdvancePurchaseIndicator="X" BookingIndicator="01" CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="800101" InterlineIndicator="Y" LastTravelDate="991231" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator="1" RefundIndicator="Y" SegmentIndicator="P" SequenceNumber="1" TicketingIndicator="0" id="14">
                <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
                <RficCode>C</RficCode>
                <RficSubcode>0DA</RficSubcode>
                <SSRCode>WBAG</SSRCode>
                <OwningCarrierCode>AB</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="3750"/>
                <TTLPrice Currency="RUB" Price="3750"/>
                <OriginalBasePrice Currency="EUR" Price="50.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>MUC</BoardPoint>
                <OffPoint>TXL</OffPoint>
                <TotalOriginalBasePrice Currency="EUR" Price="50.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="3750"/>
                <TotalTTLPrice Currency="RUB" Price="3750"/>
                <BookingSource>0</BookingSource>
                <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
                <GroupCode>BG</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>AB</AirlineCode>
                  <FlightNumber>6180</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2016-06-01</DepartureDate>
                  <BoardPoint>MUC</BoardPoint>
                  <OffPoint>TXL</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="4">
            <Ancillaries>
              <AncillaryService ActionCode="HD" AdvancePurchaseIndicator="X" BookingIndicator="01" CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="800101" InterlineIndicator="Y" LastTravelDate="991231" NameNumber="01.01" NumberOfItems="1" RefundFormIndicator="1" RefundIndicator="Y" SegmentIndicator="P" SequenceNumber="2" TicketingIndicator="0" id="16">
                <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
                <RficCode>C</RficCode>
                <RficSubcode>0DA</RficSubcode>
                <SSRCode>WBAG</SSRCode>
                <OwningCarrierCode>AB</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="3750"/>
                <TTLPrice Currency="RUB" Price="3750"/>
                <OriginalBasePrice Currency="EUR" Price="50.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>TXL</BoardPoint>
                <OffPoint>MUC</OffPoint>
                <TotalOriginalBasePrice Currency="EUR" Price="50.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="3750"/>
                <TotalTTLPrice Currency="RUB" Price="3750"/>
                <BookingSource>0</BookingSource>
                <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
                <GroupCode>BG</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>AB</AirlineCode>
                  <FlightNumber>6181</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2016-06-02</DepartureDate>
                  <BoardPoint>TXL</BoardPoint>
                  <OffPoint>MUC</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="5">
            <Ancillaries>
              <AncillaryService ActionCode="HD" AdvancePurchaseIndicator="X" BookingIndicator="01" CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="800101" InterlineIndicator="Y" LastTravelDate="991231" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator="1" RefundIndicator="Y" SegmentIndicator="P" SequenceNumber="3" TicketingIndicator="0" id="18">
                <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
                <RficCode>C</RficCode>
                <RficSubcode>0DA</RficSubcode>
                <SSRCode>WBAG</SSRCode>
                <OwningCarrierCode>AB</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="3750"/>
                <TTLPrice Currency="RUB" Price="3750"/>
                <OriginalBasePrice Currency="EUR" Price="50.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>MUC</BoardPoint>
                <OffPoint>TXL</OffPoint>
                <TotalOriginalBasePrice Currency="EUR" Price="50.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="3750"/>
                <TotalTTLPrice Currency="RUB" Price="3750"/>
                <BookingSource>0</BookingSource>
                <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
                <GroupCode>BG</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>AB</AirlineCode>
                  <FlightNumber>6180</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2016-06-01</DepartureDate>
                  <BoardPoint>MUC</BoardPoint>
                  <OffPoint>TXL</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
          <Item RPH="6">
            <Ancillaries>
              <AncillaryService ActionCode="HD" AdvancePurchaseIndicator="X" BookingIndicator="01" CommisionIndicator="N" FeeApplicationIndicator="4" FirstTravelDate="800101" InterlineIndicator="Y" LastTravelDate="991231" NameNumber="02.01" NumberOfItems="1" RefundFormIndicator="1" RefundIndicator="Y" SegmentIndicator="P" SequenceNumber="4" TicketingIndicator="0" id="20">
                <CommercialName>BAGGAGE BETWEEN 51LB AND 70 LB</CommercialName>
                <RficCode>C</RficCode>
                <RficSubcode>0DA</RficSubcode>
                <SSRCode>WBAG</SSRCode>
                <OwningCarrierCode>AB</OwningCarrierCode>
                <Vendor>ATP</Vendor>
                <EMDType>2</EMDType>
                <EquivalentPrice Currency="RUB" Price="3750"/>
                <TTLPrice Currency="RUB" Price="3750"/>
                <OriginalBasePrice Currency="EUR" Price="50.00"/>
                <PassengerTypeCode>ADT</PassengerTypeCode>
                <BoardPoint>TXL</BoardPoint>
                <OffPoint>MUC</OffPoint>
                <TotalOriginalBasePrice Currency="EUR" Price="50.00"/>
                <TotalEquivalentPrice Currency="RUB" Price="3750"/>
                <TotalTTLPrice Currency="RUB" Price="3750"/>
                <BookingSource>0</BookingSource>
                <PurchaseTimestamp>2016-05-07T01:59:00</PurchaseTimestamp>
                <GroupCode>BG</GroupCode>
                <TicketUsedForEMDPricing>N</TicketUsedForEMDPricing>
                <TaxExemption>N</TaxExemption>
                <Segment>
                  <AirlineCode>AB</AirlineCode>
                  <FlightNumber>6181</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <DepartureDate>2016-06-02</DepartureDate>
                  <BoardPoint>TXL</BoardPoint>
                  <OffPoint>MUC</OffPoint>
                </Segment>
              </AncillaryService>
            </Ancillaries>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="true" ID="KBFUBP" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Source AAA_PseudoCityCode="02AA" CreateDateTime="2016-05-05T09:52" CreationAgent="HPA" HomePseudoCityCode="NSU" LastUpdateDateTime="2016-05-05T10:01" PseudoCityCode="02AA" ReceivedFrom="AP" SequenceNumber="3"/>
      </ItineraryRef>
      <SpecialServiceInfo RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="WBAG">
          <Airline Code="AB"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 MUCTXL6180Y01JUN/PREPAID</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="WBAG">
          <Airline Code="AB"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 TXLMUC6181Y02JUN/PREPAID</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="WBAG">
          <Airline Code="AB"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>NN1 MUCTXL6180Y01JUN/PREPAID</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="WBAG">
          <Airline Code="AB"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>NN1 TXLMUC6181Y02JUN/PREPAID</Text>
        </Service>
      </SpecialServiceInfo>
    </TravelItinerary>
  </TravelItineraryReadRS>
</PassengerDetailsRS>
{% endxmlsec %}
