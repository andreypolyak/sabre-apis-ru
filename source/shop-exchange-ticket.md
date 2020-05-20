# Поиск вариантов перелетов для обмена

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Подробнее об условиях выполнения обменов билетов см. в [Обмены и возвраты](exchanges-refunds.md#dobrovolnii_obmen_biletov).

## Информация о поиске

*Для поиска вариантов перелетов для обмена в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

**Поиск вариантов перелетов для обмена билетов всегда должен выполняться в том же PCC, где они были оформлены!**

Для поиска вариантов перелетов для обмена используется сервис [ExchangeShoppingRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/exchange_shopping).

В запросе требуется указать:
- ```/ExchangeShoppingRQ/STL_Header.RQ``` — пустой элемент
- ```/ExchangeShoppingRQ/POS/Pseudo``` — PCC, в котором были оформлены билеты
- ```/ExchangeShoppingRQ/POS/Actual``` — код города, к которому относится бронирование
- ```/ExchangeShoppingRQ/POS/ShoppingPath/@requestType``` — всегда ```TNEXC```
- ```/ExchangeShoppingRQ/POS/ShoppingPath/@bookingChannel``` — всегда ```TN```

## Билеты

Для каждого билета в бронировании, который требуется обменять, необходимо указать в последовательно расположенных элементах ```/ExchangeShoppingRQ/PassengerInformation/PassengerWithPNR```:
- ```/@pnrLocator``` — код бронирования (PNR Record Locator)
- ```/@referenceNumber``` — номер пассажира в бронировании
- ```/@firstName``` — имя пассажира (в точности так, как указано в бронировании, включая титул)
- ```/@lastName``` — фамилия пассажира
- ```/DocumentNumber``` — номер билета (13 цифр)
- ```/DocumentNumber/@localIssueDate``` — дата оформления билета в формате ```YYYY-MM-DD```
- ```/DocumentNumber/@validateAssociatedEMDs``` — признак необходимости проверки ассоциированных с билетом EMD на возможность повторного использования или возврата. Возможные варианты:
    - ```true``` — проверка требуется
    - ```false``` — проверка не требуется

## Маршрут и даты

Для каждого плеча в новом билете необходимо указать в последовательно расположенных элементах ```/ExchangeShoppingRQ/OriginDestinationInformation```:
- ```/@shopIndicator``` — признак необходимости поиска вариантов для обмена данного плеча. Возможные варианты:
    - ```true``` — для данного плеча необходимо произвести поиск вариантов обмена
    - ```false``` — данное плечо не будет обменено. В этом случае необходимо указать существующие сегменты, относящиеся к плечу в элементе ```/RelatedSegment``` (см. ниже)
- ```/@preserveConnectionsIndicator``` — признак необходимости сохранения места стыковки. Возможные варианты:
    - ```true``` — для данного плеча необходимо сохранять места стыковки. В этом случае необходимо указать существующие сегменты, относящиеся к плечу в элементе ```/RelatedSegment``` (только если плечо будет обменено)
    - ```false``` — для данного плеча не требуется сохранять места стыковки
- ```/DateTimeSelection/DepartureDate``` — дата вылета
- ```/IncludeVendor``` — белый список маркетинговых перевозчиков (только если плечо будет обменено)
- ```/StartLocation``` — аэропорт или город отправления
- ```/EndLocation``` — аэропорт или город прибытия
- ```/RelatedSegment``` — связанные с плечом сегменты:
    - ```/@operatingProvider``` — оперирующий перевозчик
    - ```/@marketingProvider``` — маркетинговый перевозчик
    - ```/@marketingFlightNumber``` — номер рейса
    - ```/@startDateTime``` — время отправления
    - ```/@endDateTime``` — время прибытия
    - ```/@startLocation``` — аэропорт отправления
    - ```/@endLocation``` — аэропорт прибытия
    - ```/@bookingClass``` — класс бронирования
    - ```/@reservationStatus``` — статус сегмента (обычно ```HK```)
    - ```/@bookingDateTime``` — время бронирования сегмента

Дополнительно в запросе можно указать:
- ```/ExchangeShoppingRQ/TravelPreferences/Flight/@maxConnections``` — максимальное число пересадок. Не может быть комбинировано с ```/@preserveConnectionsIndicator``` или ```/@maxStops```
- ```/ExchangeShoppingRQ/TravelPreferences/@maxStops``` — максимальное число остановок (как пересадок, так и технических посадок). Не может быть комбинировано с ```/@preserveConnectionsIndicator``` или ```/@maxConnections```

## Перевозчики

Помимо белого списка маркетинговых перевозчиков для каждого плеча сервис позволяет указать общий черный список маркетинговых перевозчиков для всех плеч нового билета, для этого необходимо перечислить их коды в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/ExcludeVendor```.

Для запрета поиска интерлайн перелетов необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/@onlineIndicator```.

## Приватные тарифы

По умолчанию сервис предлагает расчет стоимости новых билетов как по публичным, так и по приватным тарифам. Для того чтобы получать только публичные или приватные тарифы, требуется указать значение ```true``` у атрибутов ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/PublicFare/@ind``` и ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/PrivateFare/@ind``` соответственно.

Для расчета по приватным тарифам в запросе можно указать:
- ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/@corporateID``` — код корпоративной скидки (Corporate ID)
- ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/@accountCode``` — аккаунт код (Account Code)

## Брендированные тарифы

### Информация о примененных брендированных тарифах

По умолчанию ответ на запрос не содержит информацию о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.). Для того, чтобы получить эту информацию, необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@singleBrandedFare```.

### Список услуг у найденных брендированных тарифов

Для получения списка услуг у найденных брендированных тарифов необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@returnBrandAncillaries```. Эта опция может быть запрошена только при запросе информации о примененных брендированных тарифах (```/@SingleBrandedFare```) или при получении расчетов по всем доступным брендам (```/@MultipleBrandedFares```).

Подробнее см. в разделе [Брендированные тарифы](brands.md#spisok_uslug_u_brendirovannih_tarifov).

### Черный и белый список брендов

Черный список брендов задается в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```Preference/@Code``` — код бренда
- ```Preference/@Level``` — значение ```Unacceptable```

Белый список брендов задается в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```Preference/@Code``` — код бренда
- ```Preference/@Level``` — значение ```Preferred```

Обратите внимание на то, что даже передав один или несколько кодов брендов в белом списке, в ответе расчет для этого плеча может быть выполнен по небрендированному тарифу. Для того, чтобы этого избежать, необходимо указать значение ```Unacceptable``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/NonBrandedFares/@preferLevel``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/NonBrandedFares/@preferLevel``` (для плеча). Для того, чтобы расчет был выполнен только по небрендированным тарифам, необходимо указать значение ```Preferred``` у этого атрибута.

## Нормы провоза багажа

Для получения информации о нормах провоза багажа в структурированном виде (максимальное количество мест багажа или максимальный вес багажа) необходимо указать значение ```A``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/Baggage/@RequestType```.

Для получения дополнительной информации в текстовом виде (максимальный вес и размеры багажа) необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/Baggage/@Description```.

## Дополнительные услуги

Атрибут ```/ExchangeShoppingRQ/TravelPreferences/AncillaryFees/@Enable``` со значением равным ```true``` позволяет запросить информацию о наличии у перевозчика дополнительных услуг и их стоимости.

При необходимости можно ограничить список возвращаемых дополнительных услуг, указав их коды в качестве значений атрибута ```/@Code``` последовательно расположенных элементов ```/ExchangeShoppingRQ/TravelPreferences/AncillaryFees/AncillaryFeeGroup```.

Доступные категории дополнительных услуг:
- ```BG``` — багаж
- ```GT``` — наземные перевозки
- ```IE``` — развлечения на борту
- ```LG``` — доступ в залы ожидания
- ```MD``` — медицинские услуги
- ```PT``` — перевозка животных
- ```SA``` — бронирование мест в салоне
- ```ML``` — питание и напитки
- ```UN``` — несопровождаемые дети

Подробнее о дополнительных услугах см. в [Бронирование дополнительных услуг](ancillaries.md).

## Пример

{% xmlsec "Пример запроса" %}
<ExchangeShoppingRQ version="2.3.0" xmlns="http://services.sabre.com/sp/exchange/shopping/v2_3">
  <STL_Header.RQ/>
  <POS>
    <Pseudo>2FRH</Pseudo>
    <Actual>MOW</Actual>
    <ShoppingPath bookingChannel="TN" requestType="TNEXC"/>
  </POS>
  <TicketingProvider>1S</TicketingProvider>
  <PassengerInformation>
    <PassengerWithPNR firstName="IVAN MR" lastName="IVANOV" pnrLocator="CSCQGD" referenceNumber="1.1">
      <DocumentNumber localIssueDate="2020-01-31">5555588040243</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="ELENA MS" lastName="IVANOVA" pnrLocator="CSCQGD" referenceNumber="2.1">
      <DocumentNumber localIssueDate="2020-01-31">5555588040244</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="ANDREY" lastName="IVANOV" pnrLocator="CSCQGD" referenceNumber="3.1">
      <DocumentNumber localIssueDate="2020-01-31">5555588040245</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="EKATERINA" lastName="IVANOVA" pnrLocator="CSCQGD" referenceNumber="4.1">
      <DocumentNumber localIssueDate="2020-01-31">5555588040246</DocumentNumber>
    </PassengerWithPNR>
  </PassengerInformation>
  <OriginDestinationInformation shopIndicator="true">
    <DateTimeSelection>
      <DepartureDate>2020-08-31</DepartureDate>
    </DateTimeSelection>
    <StartLocation>MOW</StartLocation>
    <EndLocation>AER</EndLocation>
    <BrandFilters>
      <Brand code="EC" preferLevel="Preferred"/>
    </BrandFilters>
  </OriginDestinationInformation>
  <OriginDestinationInformation shopIndicator="false">
    <DateTimeSelection>
      <DepartureDate>2020-09-08</DepartureDate>
    </DateTimeSelection>
    <StartLocation>AER</StartLocation>
    <EndLocation>SVO</EndLocation>
    <BrandFilters>
      <Brand code="EC" preferLevel="Preferred"/>
    </BrandFilters>
    <RelatedSegment bookingClass="Y" bookingDateTime="2020-01-31T10:00:00" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" operatingProvider="SU" reservationStatus="HK" startDateTime="2020-09-08T02:45:00" startLocation="AER"/>
  </OriginDestinationInformation>
  <TravelPreferences>
    <Baggage Description="true" RequestType="A"/>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators returnBrandAncillaries="true" singleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelPreferences>
</ExchangeShoppingRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<ExchangeShoppingRS solutions="11" xmlns="http://services.sabre.com/sp/exchange/shopping/v2_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-31T05:56:50.228-06:00"/>
  </ApplicationResults>
  <BrandFeatures>
    <BrandFeature application="F" commercialName="BASIC SEAT" id="1" serviceGroup="BF" serviceType="Z" subCode="050" vendor="ATP"/>
    <BrandFeature application="C" commercialName="CHANGEABLE TICKET" id="2" serviceGroup="BF" serviceType="Z" subCode="059" vendor="ATP"/>
    <BrandFeature application="N" commercialName="25 PERCENT MILES EARNED" id="3" serviceGroup="BF" serviceType="Z" subCode="06A" vendor="ATP"/>
    <BrandFeature application="N" commercialName="150 PERCENT MILES EARNED" id="4" serviceGroup="BF" serviceType="Z" subCode="06M" vendor="ATP"/>
    <BrandFeature application="N" commercialName="200 PERCENT MILES EARNED" id="5" serviceGroup="BF" serviceType="Z" subCode="06N" vendor="ATP"/>
    <BrandFeature application="N" commercialName="CHANGE IN CASE OF NO SHOW" id="6" serviceGroup="BF" serviceType="Z" subCode="CNS" vendor="ATP"/>
    <BrandFeature application="N" commercialName="75 TO 125 PCNT MILES EARNED" id="7" serviceGroup="BF" serviceType="Z" subCode="ME1" vendor="ATP"/>
    <BrandFeature application="F" commercialName="100 TO 150 PCNT MILES EARNED" id="8" serviceGroup="BF" serviceType="Z" subCode="ME2" vendor="ATP"/>
    <BrandFeature application="N" commercialName="150 TO 200 PCNT MILES EARNED" id="9" serviceGroup="BF" serviceType="Z" subCode="ME3" vendor="ATP"/>
    <BrandFeature application="N" commercialName="200 TO 250 PCNT MILES EARNED" id="10" serviceGroup="BF" serviceType="Z" subCode="ME4" vendor="ATP"/>
    <BrandFeature application="N" commercialName="OPEN RETURN DATE" id="11" serviceGroup="BF" serviceType="Z" subCode="ORD" vendor="ATP"/>
    <BrandFeature application="N" commercialName="REFUND AFTER CHECKIN CLOSURE" id="12" serviceGroup="BF" serviceType="Z" subCode="RBA" vendor="ATP"/>
    <BrandFeature application="C" commercialName="REFUND BEFORE CHECKIN CLOSURE" id="13" serviceGroup="BF" serviceType="Z" subCode="RBC" vendor="ATP"/>
    <BrandFeature application="F" commercialName="STOPOVER" id="14" serviceGroup="BF" serviceType="Z" subCode="STO" vendor="ATP"/>
    <BrandFeature application="C" commercialName="UPGRADE TO COMFORT" id="15" serviceGroup="BF" serviceType="Z" subCode="UTC" vendor="ATP"/>
    <BrandFeature application="F" commercialName="CARRY10KG 22LB 55L X 40W X 25H" id="16" serviceGroup="BG" serviceType="C" subCode="08A" vendor="ATP"/>
    <BrandFeature application="N" commercialName="CARRY15KG 33LB 55L X 40W X 25H" id="17" serviceGroup="BG" serviceType="C" subCode="08B" vendor="ATP"/>
    <BrandFeature application="C" commercialName="CHECKED BAG SECOND" id="18" serviceGroup="BG" serviceType="C" subCode="0CD" vendor="ATP"/>
    <BrandFeature application="N" commercialName="UPTO70LB 32KG AND62LI 158LCM" id="19" serviceGroup="BG" serviceType="C" subCode="0FM" vendor="ATP"/>
    <BrandFeature application="F" commercialName="UPTO50LB 23KG AND62LI 158LCM" id="20" serviceGroup="BG" serviceType="C" subCode="0GO" vendor="ATP"/>
    <BrandFeature application="C" commercialName="INTERNET ACCESS" id="21" serviceGroup="IE" serviceType="F" subCode="0CL" vendor="ATP"/>
    <BrandFeature application="N" commercialName="LOUNGE ACCESS" id="22" serviceGroup="LG" serviceType="F" subCode="0BX" vendor="ATP"/>
    <BrandFeature application="N" commercialName="PRIORITY CHECK IN" id="23" serviceGroup="TS" serviceType="F" subCode="03P" vendor="ATP"/>
    <BrandFeature application="N" commercialName="PRIORITY BOARDING" id="24" serviceGroup="TS" serviceType="F" subCode="0G6" vendor="ATP"/>
    <BrandFeature application="N" commercialName="PRIORITY BAGGAGE" id="25" serviceGroup="TS" serviceType="F" subCode="0LF" vendor="ATP"/>
    <BrandFeature application="N" commercialName="UPGRADE WITH MILES BONUS" id="26" serviceGroup="UP" serviceType="F" subCode="0NI" vendor="ATP"/>
    <BrandFeature application="C" commercialName="UPGRADE AT CHECKIN TO BUSINESS" id="27" serviceGroup="UP" serviceType="F" subCode="UPF" vendor="ATP"/>
  </BrandFeatures>
  <Solution pricingSequence="1" sequence="1">
    <BookItinerary>
      <OriginDestination elapsedTime="145" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="145" electronicTicketingIndicator="true" endDateTime="2020-08-31T12:55:00" endLocation="AER" marketingFlightNumber="1116" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T10:30:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1116"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="1" pricingSequence="1" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="2" sequence="2">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T03:05:00" endLocation="AER" marketingFlightNumber="1132" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T00:35:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1132"/>
          <Equipment type="SU9"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="2" pricingSequence="2" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="3" sequence="3">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T08:35:00" endLocation="AER" marketingFlightNumber="1120" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T06:05:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1120"/>
          <Equipment type="32A"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="3" pricingSequence="3" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="4" sequence="4">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T10:15:00" endLocation="AER" marketingFlightNumber="1138" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T07:45:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1138"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="4" pricingSequence="4" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="5" sequence="5">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T16:40:00" endLocation="AER" marketingFlightNumber="1124" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T14:10:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1124"/>
          <Equipment type="32A"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="5" pricingSequence="5" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="6" sequence="6">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T20:15:00" endLocation="AER" marketingFlightNumber="1130" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T17:45:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1130"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="6" pricingSequence="6" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="7" sequence="7">
    <BookItinerary>
      <OriginDestination elapsedTime="150" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="150" electronicTicketingIndicator="true" endDateTime="2020-08-31T21:30:00" endLocation="AER" marketingFlightNumber="1118" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T19:00:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1118"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="7" pricingSequence="7" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="8" sequence="8">
    <BookItinerary>
      <OriginDestination elapsedTime="155" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-08-31T11:40:00" endLocation="AER" marketingFlightNumber="1134" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T09:05:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1134"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="8" pricingSequence="8" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="9" sequence="9">
    <BookItinerary>
      <OriginDestination elapsedTime="155" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-08-31T14:55:00" endLocation="AER" marketingFlightNumber="1122" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T12:20:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1122"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="9" pricingSequence="9" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="10" sequence="10">
    <BookItinerary>
      <OriginDestination elapsedTime="155" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-08-31T23:25:00" endLocation="AER" marketingFlightNumber="1140" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T20:50:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1140"/>
          <Equipment type="32A"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="10" pricingSequence="10" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <Solution pricingSequence="11" sequence="11">
    <BookItinerary>
      <OriginDestination elapsedTime="155" endLocation="AER" segmentQuantity="1" startLocation="SVO">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-01T01:45:00" endLocation="AER" marketingFlightNumber="1128" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="1" startDateTime="2020-08-31T23:10:00" startLocation="SVO" stopQuantity="0">
          <StartLocationDetails GMTOffset="3" terminalID="B"/>
          <EndLocationDetails GMTOffset="3"/>
          <OperatingProviderDetails flightNumber="1128"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="155" endLocation="SVO" segmentQuantity="1" startLocation="AER">
        <ReservationSegment book="true" elapsedTime="155" electronicTicketingIndicator="true" endDateTime="2020-09-08T05:20:00" endLocation="SVO" marketingFlightNumber="1129" marketingProvider="SU" marriageGroup="O" operatingProvider="SU" segmentNumber="2" startDateTime="2020-09-08T02:45:00" startLocation="AER" stopQuantity="0">
          <StartLocationDetails GMTOffset="3"/>
          <EndLocationDetails GMTOffset="3" terminalID="B"/>
          <OperatingProviderDetails flightNumber="1129"/>
          <Equipment type="73H"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brand="ECONOMY CLASSIC" brandingProgram="113697" mixedBrands="false" passengersInDifferentCabins="false" postCalcIndex="11" pricingSequence="11" requireSplitPNR="true" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="FROM" endLocation="AER" startLocation="SVO"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040243" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040244" fareBasis="YCLR" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040245" fareBasis="YCLR/CH25" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="B" brand="EC" brandingProgram="113697" cabin="Y" documentNumber="5555588040246" fareBasis="BCLR/IN00" meal="S">
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="2"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="14"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <FareComponent directionality="TO" endLocation="SVO" startLocation="AER"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="YQ">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="RI">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">2600</TotalFee>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">2600</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="Even">
            <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">0</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">0</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">0</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFee currencyCode="RUB" decimalPlaces="0" type="CHG">7800</TotalFee>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">7800</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="5555588040243" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040244" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040245" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 50 POUNDS/23 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="5555588040246" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="1"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="SU" ProvisionType="A">
            <Segment Id="2"/>
            <Allowance Description1="UP TO 22 POUNDS/10 KILOGRAMS" Description2="UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS" Pieces="1"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
</ExchangeShoppingRS>
{% endxmlsec %}
