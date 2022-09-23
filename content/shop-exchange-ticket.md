---
title: Поиск вариантов обмена
---

{{< toc >}}

## Введение

Подробнее об условиях выполнения обменов билетов см. [Обмены и возвраты](exchanges-refunds.html#добровольный-обмен-билетов).

Для получения вариантов обмена используется сервис [ExchangeShoppingRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/exchange_shopping).


## Переход в другой PCC

Для поиска вариантов обмена в другом PCC (т.е. не в iPCC, в котором была создана сессия или токен) необходимо указать его в качестве значения атрибута ```/ExchangeShoppingRQ/@targetCity```.

{{< hint warning >}}
Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).
{{< /hint >}}

## Информация о поиске

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
- ```/DocumentNumber/@validateAssociatedEMDs``` — признак необходимости проверки ассоциированных с билетом EMD на возможность повторного использования или возврата. Возможные значения:
    - ```true``` — проверка требуется
    - ```false``` — проверка не требуется

## Маршрут и даты

Для каждого плеча в новом билете необходимо указать в последовательно расположенных элементах ```/ExchangeShoppingRQ/OriginDestinationInformation```:
- ```/@shopIndicator``` — признак необходимости поиска вариантов для обмена данного плеча. Возможные значения:
    - ```true``` — для данного плеча необходимо произвести поиск вариантов обмена
    - ```false``` — данное плечо не будет обменено. В этом случае необходимо указать существующие сегменты, относящиеся к плечу в элементе ```/RelatedSegment``` (см. ниже)
- ```/@preserveConnectionsIndicator``` — признак необходимости сохранения места стыковки. Возможные значения:
    - ```true``` — для данного плеча необходимо сохранять места стыковки. В этом случае необходимо указать существующие сегменты, относящиеся к плечу в элементе ```/RelatedSegment``` (только если плечо будет обменено)
    - ```false``` — для данного плеча не требуется сохранять места стыковки
- ```/DateTimeSelection/DepartureDate``` — дата вылета
- ```/IncludeVendor``` — белый список маркетинговых перевозчиков (только если плечо будет обменено)
- ```/StartLocation``` — аэропорт или город отправления
- ```/EndLocation``` — аэропорт или город прибытия
- ```/RelatedSegment``` — сегменты, относящиеся к данному плечу (только если плечо **не** будет обменено):
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
    - ```/@brand``` — код бренда (требуется указать, если [бренд должен быть сохранен](shop-exchange-ticket.html#сохранение-брендов-у-неизменяемых-сегментов))
    - ```/@keepBookingClass``` — признак необходимости сохранить текущий класс бронирования. Возможные значения:
      - ```true``` — класс бронирования для данного сегмента будет сохранен
      - ```false``` — класс бронирования для данного сегмента может быть изменен (значение по умолчанию)

Дополнительно в запросе можно указать:
- ```/ExchangeShoppingRQ/TravelPreferences/Flight/@maxConnections``` — максимальное число пересадок. Не может быть комбинировано с ```/@preserveConnectionsIndicator``` или ```/@maxStops```
- ```/ExchangeShoppingRQ/TravelPreferences/@maxStops``` — максимальное число остановок (как пересадок, так и технических посадок). Не может быть комбинировано с ```/@preserveConnectionsIndicator``` или ```/@maxConnections```

## Перевозчики

Помимо белого списка маркетинговых перевозчиков для каждого плеча сервис позволяет указать общий черный список маркетинговых перевозчиков для всех плеч нового билета, для этого необходимо перечислить их коды в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/ExcludeVendor```.

Для запрета поиска интерлайн перелетов необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/@onlineIndicator```.

## Приватные тарифы

По умолчанию сервис предлагает расчет стоимости новых билетов как по публичным, так и по приватным тарифам. Для того чтобы получать только публичные или приватные тарифы, требуется указать значение ```true``` у атрибутов ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/PublicFare/@ind``` и ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/PrivateFare/@ind``` соответственно.

Для расчета по приватным тарифам в запросе можно указать:
- ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/NegotiatedFareCode/@Code``` — код корпоративной скидки (Corporate ID)
- ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/AccountCode/@Code``` — аккаунт код (Account Code)

## Брендированные тарифы

#### Информация о примененных брендированных тарифах

По умолчанию ответ на запрос не содержит информацию о примененных брендированных тарифах (код бренда, название бренда, код программы брендов и т.д.). Для того чтобы получить эту информацию, необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@singleBrandedFare```.

#### Список услуг у найденных брендированных тарифов

Для получения списка услуг у найденных брендированных тарифов необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@returnBrandAncillaries```. Эта опция может быть запрошена только при запросе информации о примененных брендированных тарифах (```/@SingleBrandedFare```) или при получении расчетов по всем доступным брендам (```/@MultipleBrandedFares```).

Подробнее см. в разделе [Брендированные тарифы](brands.html#список-услуг-у-брендированных-тарифов).

#### Черный и белый список брендов

Черный список брендов задается в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```/Preference/@Code``` — код бренда
- ```/Preference/@Level``` — значение ```Unacceptable```

Белый список брендов задается в последовательно расположенных элементах ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/Brand``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/Brand``` (для плеча). Для каждого бренда необходимо указать:
- ```/Preference/@Code``` — код бренда
- ```/Preference/@Level``` — значение ```Preferred```

{{< hint warning >}}
Обратите внимание на то, что даже передав один или несколько кодов брендов в белом списке, в ответе расчет для этого плеча может быть выполнен по небрендированному тарифу. Для того чтобы этого избежать, необходимо указать значение ```Unacceptable``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/BrandFilters/NonBrandedFares/@preferLevel``` (для всего маршрута) или ```/ExchangeShoppingRQ/OriginDestinationInformation/BrandFilters/NonBrandedFares/@preferLevel``` (для плеча). Для того чтобы расчет был выполнен только по небрендированным тарифам, необходимо указать значение ```Preferred``` у этого атрибута.
{{< /hint >}}

#### Сохранение брендов у неизменяемых сегментов

Для сохранения бренда у неизменяемых сегментов необходимо указать значение ```true``` у атрибута ```/ExchangeShoppingRQ/TravelPreferences/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators/@keepOriginalBrand```, а также указать код бренда для этих сегментов в качестве значения атрибута ```/ExchangeShoppingRQ/OriginDestinationInformation/RelatedSegment/@brand```.

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

Подробнее о дополнительных услугах см. [Бронирование дополнительных услуг](ancillaries.html).

## Пример

{{< details title="Пример запроса" >}}
```XML
<ExchangeShoppingRQ targetCity="2FRH" version="2.5.0" xmlns="http://services.sabre.com/sp/exchange/shopping/v2_5">
  <STL_Header.RQ/>
  <POS>
    <Pseudo>2FRH</Pseudo>
    <Actual>MOW</Actual>
    <ShoppingPath bookingChannel="TN" requestType="TNEXC"/>
  </POS>
  <TicketingProvider>1S</TicketingProvider>
  <PassengerInformation>
    <PassengerWithPNR firstName="IVAN MR" lastName="IVANOV" pnrLocator="EHNGSD" referenceNumber="1.1">
      <DocumentNumber localIssueDate="2022-09-23">6075259207312</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="ELENA MS" lastName="IVANOVA" pnrLocator="EHNGSD" referenceNumber="2.1">
      <DocumentNumber localIssueDate="2022-09-23">6075259207313</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="ANDREY" lastName="IVANOV" pnrLocator="EHNGSD" referenceNumber="3.1">
      <DocumentNumber localIssueDate="2022-09-23">6075259207314</DocumentNumber>
    </PassengerWithPNR>
    <PassengerWithPNR firstName="EKATERINA" lastName="IVANOVA" pnrLocator="EHNGSD" referenceNumber="4.1">
      <DocumentNumber localIssueDate="2022-09-23">6075259207315</DocumentNumber>
    </PassengerWithPNR>
  </PassengerInformation>
  <OriginDestinationInformation shopIndicator="true">
    <DateTimeSelection>
      <DepartureDate>2022-11-24</DepartureDate>
    </DateTimeSelection>
    <StartLocation>SYD</StartLocation>
    <EndLocation>LON</EndLocation>
  </OriginDestinationInformation>
  <OriginDestinationInformation shopIndicator="false">
    <DateTimeSelection>
      <DepartureDate>2022-12-08</DepartureDate>
    </DateTimeSelection>
    <StartLocation>LHR</StartLocation>
    <EndLocation>SYD</EndLocation>
    <RelatedSegment bookingClass="Y" bookingDateTime="2022-09-23T10:00:00" brand="YF" endDateTime="2022-12-09T06:35:00" endLocation="AUH" keepBookingClass="true" marketingFlightNumber="26" marketingProvider="EY" operatingProvider="EY" reservationStatus="HK" startDateTime="2022-12-08T19:50:00" startLocation="LHR"/>
    <RelatedSegment bookingClass="Y" bookingDateTime="2022-09-23T10:00:00" brand="YF" endDateTime="2022-12-09T19:55:00" endLocation="SYD" keepBookingClass="true" marketingFlightNumber="59" marketingProvider="EY" operatingProvider="EY" reservationStatus="HK" startDateTime="2022-12-09T10:50:00" startLocation="AUH"/>
  </OriginDestinationInformation>
  <TravelPreferences>
    <Baggage Description="true" RequestType="A"/>
    <PriceRequestInformation>
      <TPA_Extensions>
        <BrandedFareIndicators keepOriginalBrand="true" returnBrandAncillaries="true" singleBrandedFare="true"/>
      </TPA_Extensions>
    </PriceRequestInformation>
  </TravelPreferences>
</ExchangeShoppingRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ExchangeShoppingRS solutions="31" xmlns="http://services.sabre.com/sp/exchange/shopping/v2_5">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-09-23T10:38:41.748-05:00"/>
  </ApplicationResults>
  <BrandFeatures>
    <BrandFeature application="F" commercialName="STANDARD SEAT SELECTION" id="1" serviceGroup="BF" serviceType="Z" subCode="050" vendor="ATP"/>
    <BrandFeature application="C" commercialName="STANDARD SEAT SELECTION" id="2" serviceGroup="BF" serviceType="Z" subCode="050" vendor="ATP"/>
    <BrandFeature application="C" commercialName="REFUNDABLE TICKET" id="3" serviceGroup="BF" serviceType="Z" subCode="056" vendor="ATP"/>
    <BrandFeature application="F" commercialName="REFUNDABLE TICKET" id="4" serviceGroup="BF" serviceType="Z" subCode="056" vendor="ATP"/>
    <BrandFeature application="N" commercialName="275 PERCENT MILES EARNED" id="5" serviceGroup="BF" serviceType="Z" subCode="057" vendor="ATP"/>
    <BrandFeature application="C" commercialName="BID TO UPGRADE" id="6" serviceGroup="BF" serviceType="Z" subCode="058" vendor="ATP"/>
    <BrandFeature application="C" commercialName="CHANGEABLE TICKET" id="7" serviceGroup="BF" serviceType="Z" subCode="059" vendor="ATP"/>
    <BrandFeature application="F" commercialName="CHANGEABLE TICKET" id="8" serviceGroup="BF" serviceType="Z" subCode="059" vendor="ATP"/>
    <BrandFeature application="C" commercialName="EXTRA LEGROOM SEAT SELECTION" id="9" serviceGroup="BF" serviceType="Z" subCode="05Z" vendor="ATP"/>
    <BrandFeature application="N" commercialName="EXTRA LEGROOM SEAT SELECTION" id="10" serviceGroup="BF" serviceType="Z" subCode="05Z" vendor="ATP"/>
    <!--Другие услуги-->
  </BrandFeatures>
  <Solution pricingSequence="1" sequence="1">
    <BookItinerary>
      <OriginDestination elapsedTime="1415" endLocation="LHR" segmentQuantity="2" startLocation="SYD">
        <ReservationSegment book="true" elapsedTime="855" electronicTicketingIndicator="true" endDateTime="2022-11-25T06:40:00" endLocation="AUH" marketingFlightNumber="4065" marketingProvider="EY" marriageGroup="O" operatingProvider="EY" segmentNumber="1" startDateTime="2022-11-24T23:25:00" startLocation="SYD" stopQuantity="0">
          <StartLocationDetails GMTOffset="11"/>
          <EndLocationDetails GMTOffset="4"/>
          <OperatingProviderDetails flightNumber="4065"/>
          <Equipment type="789"/>
        </ReservationSegment>
        <ReservationSegment book="true" elapsedTime="460" electronicTicketingIndicator="true" endDateTime="2022-11-25T12:00:00" endLocation="LHR" marketingFlightNumber="19" marketingProvider="EY" marriageGroup="I" operatingProvider="EY" segmentNumber="2" startDateTime="2022-11-25T08:20:00" startLocation="AUH" stopQuantity="0">
          <StartLocationDetails GMTOffset="4" terminalID="3"/>
          <EndLocationDetails GMTOffset="0" terminalID="4"/>
          <OperatingProviderDetails flightNumber="19"/>
          <Equipment type="789"/>
        </ReservationSegment>
      </OriginDestination>
      <OriginDestination elapsedTime="785" endLocation="SYD" segmentQuantity="2" startLocation="LHR">
        <ReservationSegment book="false" elapsedTime="405" electronicTicketingIndicator="true" endDateTime="2022-12-09T06:35:00" endLocation="AUH" marketingFlightNumber="26" marketingProvider="EY" marriageGroup="O" operatingProvider="EY" segmentNumber="3" startDateTime="2022-12-08T19:50:00" startLocation="LHR" stopQuantity="0">
          <StartLocationDetails GMTOffset="0" terminalID="4"/>
          <EndLocationDetails GMTOffset="4" terminalID="3"/>
          <OperatingProviderDetails flightNumber="26"/>
          <Equipment type="789"/>
        </ReservationSegment>
        <ReservationSegment book="false" elapsedTime="125" electronicTicketingIndicator="true" endDateTime="2022-12-09T19:55:00" endLocation="SYD" marketingFlightNumber="59" marketingProvider="EY" marriageGroup="I" operatingProvider="EY" segmentNumber="4" startDateTime="2022-12-09T10:50:00" startLocation="AUH" stopQuantity="0">
          <StartLocationDetails GMTOffset="4"/>
          <EndLocationDetails GMTOffset="11"/>
          <OperatingProviderDetails flightNumber="59"/>
          <Equipment type="781"/>
        </ReservationSegment>
      </OriginDestination>
    </BookItinerary>
    <Fare brandingProgram="208695" mixedBrands="true" passengersInDifferentCabins="false" postCalcIndex="2" pricingSequence="2" requireSplitPNR="false" valid="true">
      <ReservationSegmentDetails segmentNumber="1">
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207312" fareBasis="DXAC4AU" meal="R">
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="29"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="34"/>
          <BrandFeatureRef featureId="35"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="42"/>
          <BrandFeatureRef featureId="45"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="43"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
          <FareComponent directionality="FROM" endLocation="LHR" startLocation="SYD"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207313" fareBasis="DXAC4AU" meal="R">
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="29"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="34"/>
          <BrandFeatureRef featureId="35"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="42"/>
          <BrandFeatureRef featureId="45"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="43"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
          <FareComponent directionality="FROM" endLocation="LHR" startLocation="SYD"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207314" fareBasis="DXAC4AUCH" meal="R">
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="29"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="34"/>
          <BrandFeatureRef featureId="35"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="42"/>
          <BrandFeatureRef featureId="45"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="43"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
          <FareComponent directionality="FROM" endLocation="LHR" startLocation="SYD"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207315" fareBasis="DXAC4AUIN" meal="R">
          <BrandFeatureRef featureId="7"/>
          <BrandFeatureRef featureId="3"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="10"/>
          <BrandFeatureRef featureId="24"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="17"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="20"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="29"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="34"/>
          <BrandFeatureRef featureId="35"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="42"/>
          <BrandFeatureRef featureId="45"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="43"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
          <FareComponent directionality="FROM" endLocation="LHR" startLocation="SYD"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="2">
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207312" fareBasis="DXAC4AU" meal="M">
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="28"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="33"/>
          <BrandFeatureRef featureId="36"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="41"/>
          <BrandFeatureRef featureId="46"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="44"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207313" fareBasis="DXAC4AU" meal="M">
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="28"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="33"/>
          <BrandFeatureRef featureId="36"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="41"/>
          <BrandFeatureRef featureId="46"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="44"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207314" fareBasis="DXAC4AUCH" meal="M">
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="28"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="33"/>
          <BrandFeatureRef featureId="36"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="41"/>
          <BrandFeatureRef featureId="46"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="44"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="D" brand="JC" brandingProgram="208695" cabin="C" documentNumber="6075259207315" fareBasis="DXAC4AUIN" meal="M">
          <BrandFeatureRef featureId="8"/>
          <BrandFeatureRef featureId="4"/>
          <BrandFeatureRef featureId="22"/>
          <BrandFeatureRef featureId="1"/>
          <BrandFeatureRef featureId="9"/>
          <BrandFeatureRef featureId="23"/>
          <BrandFeatureRef featureId="6"/>
          <BrandFeatureRef featureId="12"/>
          <BrandFeatureRef featureId="13"/>
          <BrandFeatureRef featureId="15"/>
          <BrandFeatureRef featureId="16"/>
          <BrandFeatureRef featureId="18"/>
          <BrandFeatureRef featureId="19"/>
          <BrandFeatureRef featureId="21"/>
          <BrandFeatureRef featureId="5"/>
          <BrandFeatureRef featureId="11"/>
          <BrandFeatureRef featureId="25"/>
          <BrandFeatureRef featureId="28"/>
          <BrandFeatureRef featureId="30"/>
          <BrandFeatureRef featureId="31"/>
          <BrandFeatureRef featureId="32"/>
          <BrandFeatureRef featureId="33"/>
          <BrandFeatureRef featureId="36"/>
          <BrandFeatureRef featureId="37"/>
          <BrandFeatureRef featureId="39"/>
          <BrandFeatureRef featureId="40"/>
          <BrandFeatureRef featureId="38"/>
          <BrandFeatureRef featureId="26"/>
          <BrandFeatureRef featureId="27"/>
          <BrandFeatureRef featureId="41"/>
          <BrandFeatureRef featureId="46"/>
          <BrandFeatureRef featureId="47"/>
          <BrandFeatureRef featureId="44"/>
          <BrandFeatureRef featureId="48"/>
          <BrandFeatureRef featureId="51"/>
          <BrandFeatureRef featureId="49"/>
          <BrandFeatureRef featureId="52"/>
          <BrandFeatureRef featureId="53"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="3">
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207312" fareBasis="YLXF2AU" meal="M">
          <FareComponent directionality="TO" endLocation="SYD" startLocation="LHR"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207313" fareBasis="YLXF2AU" meal="M">
          <FareComponent directionality="TO" endLocation="SYD" startLocation="LHR"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207314" fareBasis="YLXF2AUCH" meal="M">
          <FareComponent directionality="TO" endLocation="SYD" startLocation="LHR"/>
        </PassengerBookingDetails>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207315" fareBasis="YLXF2AUIN" meal="M">
          <FareComponent directionality="TO" endLocation="SYD" startLocation="LHR"/>
        </PassengerBookingDetails>
      </ReservationSegmentDetails>
      <ReservationSegmentDetails segmentNumber="4">
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207312" fareBasis="YLXF2AU"/>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207313" fareBasis="YLXF2AU"/>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207314" fareBasis="YLXF2AUCH"/>
        <PassengerBookingDetails bookingClass="Y" brand="YF" brandingProgram="208695" cabin="Y" documentNumber="6075259207315" fareBasis="YLXF2AUIN"/>
      </ReservationSegmentDetails>
      <PassengerPriceInformation>
        <Passenger documentNumber="6075259207312" firstName="IVAN MR" lastName="IVANOV" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">124025</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="AU">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="WY">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="ZR">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="F6">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="GB">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="UB">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">124025</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">124025</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="6075259207313" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">124025</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="AU">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="WY">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="ZR">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="F6">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="GB">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="UB">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">124025</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">124025</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="6075259207314" firstName="ANDREY" lastName="IVANOV" type="CNN">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">145220</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="WY">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="ZR">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="F6">0</TaxDifference>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="UB">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">145220</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">145220</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
        <Passenger documentNumber="6075259207315" firstName="EKATERINA" lastName="IVANOVA" type="INF">
          <ResultPriceDifference differenceType="AddCollect">
            <FareDifference currencyCode="RUB" decimalPlaces="0">19475</FareDifference>
            <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
            <TaxDetails>
              <TaxDifference currencyCode="RUB" decimalPlaces="0" taxCode="UB">0</TaxDifference>
            </TaxDetails>
            <SubtotalDifference currencyCode="RUB" decimalPlaces="0">19475</SubtotalDifference>
            <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
            <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">19475</GrandTotalDifference>
          </ResultPriceDifference>
        </Passenger>
      </PassengerPriceInformation>
      <TotalPriceDifference differenceType="AddCollect">
        <FareDifference currencyCode="RUB" decimalPlaces="0">412745</FareDifference>
        <TaxDifference currencyCode="RUB" decimalPlaces="0">0</TaxDifference>
        <SubtotalDifference currencyCode="RUB" decimalPlaces="0">412745</SubtotalDifference>
        <NonRefundableAmount currencyCode="RUB" decimalPlaces="0">0</NonRefundableAmount>
        <TotalFeeTax currencyCode="RUB" decimalPlaces="0">0</TotalFeeTax>
        <GrandTotalDifference currencyCode="RUB" decimalPlaces="0">412745</GrandTotalDifference>
      </TotalPriceDifference>
    </Fare>
    <TPA_Extensions>
      <Passenger documentNumber="6075259207312" firstName="IVAN MR" lastName="IVANOV" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="1"/>
            <Segment Id="2"/>
            <Allowance Unit="kg" Weight="40"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="3"/>
            <Segment Id="4"/>
            <Allowance Unit="kg" Weight="35"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="6075259207313" firstName="ELENA MS" lastName="IVANOVA" type="ADT">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="1"/>
            <Segment Id="2"/>
            <Allowance Unit="kg" Weight="40"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="3"/>
            <Segment Id="4"/>
            <Allowance Unit="kg" Weight="35"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="6075259207314" firstName="ANDREY" lastName="IVANOV" type="CNN">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="1"/>
            <Segment Id="2"/>
            <Allowance Unit="kg" Weight="40"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="3"/>
            <Segment Id="4"/>
            <Allowance Unit="kg" Weight="35"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
      <Passenger documentNumber="6075259207315" firstName="EKATERINA" lastName="IVANOVA" type="INF">
        <BaggageInformationList>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="1"/>
            <Segment Id="2"/>
            <Allowance Unit="kg" Weight="10"/>
          </BaggageInformation>
          <BaggageInformation AirlineCode="EY" ProvisionType="A">
            <Segment Id="3"/>
            <Segment Id="4"/>
            <Allowance Unit="kg" Weight="10"/>
          </BaggageInformation>
        </BaggageInformationList>
      </Passenger>
    </TPA_Extensions>
  </Solution>
  <!--Другие рекомендации-->
</ExchangeShoppingRS>
```
{{< /details >}}
