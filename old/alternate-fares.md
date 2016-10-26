# Выбор альтернативных тарифов

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

По умолчанию в результатах поиска сервисов Bargain Finder Max предлагаются только самые дешевые доступные тарифы для найденных вариантов перелета. Это не всегда удобно для клиента, т.к. зачастую самый дешевый тариф не разрешает провоз багажа и возврат билета.

Ниже будут рассмотрены варианты выбора альтернативных тарифов для следующих перевозчиков:
- Аэрофлот (SU)
- S7 Airlines (S7)
- Авиакомпании, использующие Branded Fares:
    - Уральские Авиалинии (U6)
    - ЮТэйр (UT)
    - Air Berlin (AB)
    - Austrian Airlines (OS)
    - Delta (DL)
    - Etihad (EY)
    - Lufthansa (LH)
    - Swiss (LX)
    - и другие

Отдельные рекомендации из данного документа могут быть применены и для других перевозчиков.

### Аэрофлот (SU)

Авиакомпания файлирует все группы тарифов ("Промо", "Бюджет", "Оптимум", "Премиум") классическим способом: одному классу бронирования соответствует один тариф для выбранного направления и категории пассажира.

### S7 Airlines (S7)

Для экономического класса обслуживания авиакомпания публично файлирует только тарифы группы "Эконом Гибкий" (без багажа и возможности возврата билета). По запросу авиакомпания файлирует тарифы группы "Эконом Базовый" (с багажом и возможностью возврата со штрафом) как приватные. Тарифы обеих групп имеют один класс бронирования, но различаются по коду бронирования.

Для бизнес класса авиакомпания файлирует тарифы групп "Бизнес Базовый" и "Бизнес Гибкий" как публичные. Тарифы обеих групп имеют один класс бронирования, но различаются по коду тарифа.

### ЮТэйр (UT)

Авиакомпания использует Branded Fares для файлирования различных групп тарифов. Однако, по умолчанию тарифы группы "Лайт" (без багажа) доступны только для категорий пассажиров ```CMM``` (взрослые), ```СNN``` (дети) и ```INF``` (младенцы). Для активации тарифов группы "Лайт" для стандартной категории взрослых пассажиров ```ADT``` необходимо направить запрос Павлу Большакову (pavel.bolshakov@utair.ru). В заявке необходимо указать PCC, в которых будет производиться поиск, бронирование и оформление билетов авиакомпании UT. После активации работа с тарифами группы "Лайт" для авиакомпании UTair не будет отличаться от работы с группами тарифов других перевозчиков.

### Авиакомпании, использующие Branded Fares

Branded Fares — инструмент Sabre для поиска, бронирования, расчета стоимости и оформления билетов. Каждый перевозчик самостоятельно определяет группы тарифов (или бренды) и файлирует их в системе. Для каждого бренда определяются условия, такие, как: наличие или отсутствие багажа, возможность обмена и возврата авиабилета, питание на борту, класс обслуживания и т.д. Тарифы разных брендов одного перевозчика могут иметь один класс бронирования, но различаются по коду тарифу.

Подробнее о Branded Fares можно прочитать на портале [Agency eServices](https://agencyeservices.sabre.com/Products/Branded-Fares.aspx). Проверить наличие Branded Fares у перевозчика вы можете на [сайте Sabre](http://www.sabretravelnetwork.com/airmerchandising/).

## Реализация

Существуют две стратегии реализации механизма выбора альтернативных тарифов:
- Получение альтернативных тарифов в результатах поиска (наряду с самыми дешевыми вариантами). В этом случае альтернативные тарифы могут быть предложены пользователю непосредственно на странице результатов: как дополнительные варианты перелетов или как альтернативные варианты для предложенных вариантов
- Получение альтернативных тарифов по отдельному запросу. В этом случае запрос альтернативных тарифов может быть произведен как со страницы результатов поиска (по инициативе пользователя), так и с последующих этапов бронирования перелетов

В некоторых случаях две стратегии могут быть использованы совместно (например, при необходимости предоставления выбора альтернативного тарифа как при создании бронирования, так и позже при работе с уже имеющимися бронированиями).

### Получение альтернативных тарифов в результатах поиска

В общем случае получение альтернативных тарифов в результатах поиска сводится к добавлению специальных элементов в поисковый запрос к сервисам Bargain Finder Max. Ниже рассмотренны примеры реализации получения альтернативных тарифов в результатах поиска для различных перевозчиков.

#### Аэрофлот (SU)

Получение расчетов стоимости по тарифным группам в настоящий момент невозможно. Для получения расчетов по тарифам по некоторым критериям можно использовать механизм Flexible Fares.

#### S7 Airlines (S7)

Для получения расчета стоимости по альтернативным тарифам используется механизм Flexible Fares, при помощи которого запрашивается дополнительный наиболее дешевый публичный тариф:

```XML
<FlexibleFares>
  <FareParameters>
    <PublicFare Ind="true"/>
  </FareParameters>
</FlexibleFares>
```

В результатах поиска будет два расчета для одного варианта перелета:
- Основной по приватному тарифу группы "Эконом Базовый"
- Альтернативный по публичному тарифу группы "Эконом Гибкий"

Получение расчета по тарифной группе "Бизнес Гибкий" в настоящий момент в результатах поиска невозможно.

#### Авиакомпании, использующие Branded Fares

Для получения расчетов стоимости по всем брендам необходимо указать у атрибута ```/OTA_AirLowFareSearchRQ/TravelerInfoSummary/PriceRequestInformation/TPA_Extensions/BrandedFareIndicators@MultipleBrandedFares``` значение ```true```.

### Получение альтернативных тарифов по отдельному запросу

#### Аэрофлот (SU)

Используется сервис EnhancedAirBookRQ (см. ниже). Определение принадлежности тарифа к группе тарифов производится на основании [класса бронирования](http://www.aeroflot.ru/ru-ru/information/purchase/rate/fare_rules).

#### S7 Airlines (S7)

Используется сервис EnhancedAirBookRQ (см. ниже). Определение принадлежности тарифа к группе тарифов производится на основании следующих правил:

| Класс обслуживания | Второй и третий символы в коде тарифа | Группа тарифов |
|--------------------|---------------------------------------|----------------|
| Экономический      | BS                                    | Эконом Базовый |
| Экономический      | FL                                    | Эконом Гибкий  |
| Бизнес             | BS                                    | Бизнес Базовый |
| Бизнес             | FL                                    | Бизнес Гибкий  |

#### Авиакомпании, использующие Branded Fares

В настоящий момент сервис для получения расчетов стоимости по всем тарифам находится в бета-тестировании. Пожалуйста, обратитесь к вашему куратору в Sabre для того, чтобы принять участие в тестировании.

#### Использование EnhancedAirBookRQ для получения альтернативных тарифов (QF+WPA)

В случае необходимости выбора альтернативного тарифа (не представленного в результатах поиска) можно воспользоваться сервисом EnhancedAirBookRQ для получения списка доступных тарифов с учетом наличия мест. Запрос к сервису строится по аналогии с запросом на бронирование (см. [Создание бронирований](/create-booking.md)) за исключением:
- указывается статус сегмента QF (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика
- вместо ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@Retain``` значение ```true``` устанавливается у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@AlternativePricing``` — запрос альтернативных тарифов вместо сохранения PQ
- устанавливается значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/AlternativePricing/Overrides/MatchNoMatch/@Ind``` — запрос альтернативных тарифов, как в запрошенном классе бронирования, так и в других классах бронирования
- у атрибутов ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` и ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter``` устанавливается значение true — игнорирование текущего бронирования до и после выполнения запроса

В результате работы сервиса создаются фиктивные сегменты со статусом QF, для которых производится расчет стоимости по альтернативным тарифам (аналог терминальной команды ```WPA```), после чего бронирование игнорируется. Ответ на такой запрос будет содержать список доступных для бронирования тарифов с указанием стоимости, класса бронирования, нормы провоза багажа и другой информации.

{% xmlsec "Пример запроса" %}
<EnhancedAirBookRQ HaltOnError="true" IgnoreOnError="true" version="3.6.0" xmlns="http://services.sabre.com/sp/eab/v3_6">
  <OTA_AirBookRQ>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2016-09-15T00:00:00" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-29T00:00:00" FlightNumber="1129" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </OTA_AirBookRQ>
  <OTA_AirPriceRQ>
    <PriceRequestInformation AlternativePricing="true">
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="SU"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <AlternativePricing>
            <Overrides>
              <MatchNoMatch Ind="true"/>
            </Overrides>
          </AlternativePricing>
          <PassengerType Code="ADT" Quantity="2"/>
          <PassengerType Code="CNN" Quantity="1"/>
          <PassengerType Code="INF" Quantity="1"/>
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </OTA_AirPriceRQ>
  <PostProcessing IgnoreAfter="true"/>
  <PreProcessing IgnoreBefore="true"/>
</EnhancedAirBookRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_6">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2016-09-04T11:52:35.782-05:00"/>
  </ApplicationResults>
  <OTA_AirBookRS>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="09-15T10:05" DepartureDateTime="09-15T07:40" FlightNumber="1138" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-29T05:10" DepartureDateTime="09-29T02:45" FlightNumber="1129" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationOption>
  </OTA_AirBookRS>
  <OTA_AirPriceRS>
    <PriceQuote>
      <MiscInformation>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1L"/>
            <AlternateBooking ResBookDesigCode="2U"/>
          </BargainFinder>
          <DepartureDate>2016-09-15</DepartureDate>
          <LastTicketingDate>09-05T19:52</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND UP TO 45 LINEAR INCHES/115</Text>
          <Text>LINEAR CENTIMETERS</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>APPLICABLE BOOKING CLASS -  1L 2U</Text>
          <Text>REBOOK OPTION OF CHOICE BEFORE STORING FARE</Text>
          <Text>15SEP DEPARTURE DATE ----- LAST DAY TO PURCHASE  5SEP</Text>
          <ValidatingCarrier Code="SU"/>
        </HeaderInformation>
        <HeaderInformation SolutionSequenceNmbr="2">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1H"/>
            <AlternateBooking ResBookDesigCode="2U"/>
          </BargainFinder>
          <DepartureDate>2016-09-15</DepartureDate>
          <LastTicketingDate>09-05T23:59</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND UP TO 45 LINEAR INCHES/115</Text>
          <Text>LINEAR CENTIMETERS</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>APPLICABLE BOOKING CLASS -  1H 2U</Text>
          <Text>REBOOK OPTION OF CHOICE BEFORE STORING FARE</Text>
          <Text>15SEP DEPARTURE DATE ----- LAST DAY TO PURCHASE  5SEP</Text>
          <ValidatingCarrier Code="SU"/>
        </HeaderInformation>
        <!-- Вырезаны остальные варианты -->
        <SolutionInformation SolutionSequenceNmbr="1">
          <CurrencyCode>RUB</CurrencyCode>
          <RequiresRebook>true</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>56000</TotalAmount>
        </SolutionInformation>
        <SolutionInformation SolutionSequenceNmbr="2">
          <CurrencyCode>RUB</CurrencyCode>
          <RequiresRebook>true</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>61000</TotalAmount>
        </SolutionInformation>
        <!-- Вырезаны остальные варианты -->
      </MiscInformation>
      <PricedItinerary AlternativePricing="true" CurrencyCode="RUB" MultiTicket="false" TotalAmount="4520840">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <FareCalculation>
            <Text>MOW SU AER8750SU MOW16250RUB25000END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="LEXRF" FareAmount="8750" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="UEXRF" FareAmount="16250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaseFare Amount="25000" CurrencyCode="RUB"/>
            <Taxes TotalAmount="3000">
              <Tax Amount="3000" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            </Taxes>
            <TotalFare Amount="28000" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="LEXRF" FareAmount="8750" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="UEXRF" FareAmount="16250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="2">
          <FareCalculation>
            <Text>MOW SU AER11250SU MOW16250RUB27500END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="HEXRF" FareAmount="11250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="UEXRF" FareAmount="16250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaseFare Amount="27500" CurrencyCode="RUB"/>
            <Taxes TotalAmount="3000">
              <Tax Amount="3000" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            </Taxes>
            <TotalFare Amount="30500" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="HEXRF" FareAmount="11250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="UEXRF" FareAmount="16250" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
        <!-- Вырезаны остальные варианты -->
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
</EnhancedAirBookRS>
{% endxmlsec %}

## Особенности бронирования альтернативных тарифов

Бронирование выбранного пользователем альтернативного тарифа производится в соответствии с принципами, указанными в разделе [Создание бронирований](/create-booking.md), а также следующими правилами.

### Аэрофлот (SU)

Процесс бронирования не меняется.

### S7 Airlines (S7)

Для бронирования перелетов по тарифам, относящимся к группе "Эконом Гибкий", необходимо в запросе к сервису EnhancedAirBookRQ указать значение ```true``` у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/FareOptions/@Public```.

Для бронирования перелетов по тарифам, относящимся к группе "Бизнес Гибкий", необходимо в запросе к сервису EnhancedAirBookRQ указать в виде значения атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/CommandPricing/FareBasis/@Code``` код тарифа:

```XML
<CommandPricing RPH="1">
  <FareBasis Code="DFLOW"/>
</CommandPricing>
```

### Авиакомпании, использующие Branded Fares

Для бронирования любого варианта перелета необходимо указать двухбуквенный код бренда (Brand ID) в элементе ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/Brand```.
