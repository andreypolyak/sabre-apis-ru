# Получение правил тарифа

-----

**Оглавление:**
<!-- toc -->

-----

## Алгоритм получения текста правил тарифа из ответа Bargain Finder Max

Предложенные в ответе BFM варианты перелета могут быть рассчитаны с использованием нескольких тарифов. Для того, чтобы получить текст правил предложенных тарифов рекомендуется использовать [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules/resources). При этом каждый тариф должен быть отдельно запрошен.

Ниже предлагается алгоритм получения информации из ответа сервисов Bargain Finder Max для запроса текста правил тарифа в зависимости от вида запрашиваемого ответа.

Для упрощения понимания алгоритма, его выполнение проиллюстрировано примером. В качестве примера используется следующий вариант перелета, предложенный в ответе сервиса BFM:

| № Плеча | № Сегмента | Откуда | Куда | Дата и время отправления | Дата и время прибытия | Номер рейса | Класс бронирования |
|---------|------------|--------|------|--------------------------|-----------------------|-------------|--------------------|
| 1 | 1 | KJA | DME | 2016-09-13T19:50 | 2016-09-13T20:45 | S7 74   | Q |
| 1 | 2 | DME | LED | 2016-09-14T01:05 | 2016-09-14T02:40 | S7 37   | O |
| 2 | 3 | LED | DME | 2016-09-15T22:55 | 2016-09-16T00:25 | S7 42   | O |
| 3 | 4 | DME | LED | 2016-09-17T06:00 | 2016-09-17T07:35 | S7 19   | Q |
| 4 | 5 | LED | DME | 2016-09-20T22:55 | 2016-09-21T00:25 | S7 42   | N |
| 4 | 6 | DME | MAD | 2016-09-21T06:15 | 2016-09-21T10:30 | S7 4063 | N |

### Стандартный ответ BFM (OTA Response)

- Определяем необходимые поля для получения текста правил тарифов:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
|...|...|...|...|

- Для каждого компонента тарифа (элемент ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode```) выбираем код тарифа (значение элемента), маркетингового перевозчика (атрибут ```/@GovCarrier```) и в случае наличия аэропорт отправления (атрибут ```/@FareComponentBeginAirport```) и аэропорт прибытия (атрибут ```/@FareComponentEndAirport```). Однако, если компонент тарифа имеет направление со значением ```TO``` (атрибут ```/@FareComponentDirectionality```), то аэропорт отправления и прибытия необходимо поменять местами:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
| KJA—LED | QFLMOW | S7 |        |
| DME—LED | OFLRT  | S7 |        |
| DME—LED | OFLRT  | S7 |        |
| KJA—LED | QFLMOW | S7 |        |
| LED—MAD | NFLMOW | S7 |        |
|         | NFLMOW | S7 | &zwnj; |

- Для каждого компонента тарифа, у которого присутствует аэропорт отправления и прибытия, указываем дату отправления соответствующего сегмента (атрибут ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItinerary/OriginDestinationOptions/OriginDestinationOption/FlightSegment/@DepartureDateTime```). Т.е. для первого компонента тарифа указываем дату вылета для первого сегмента, для второго компонента тарифа — дату вылета второго сегмента и т.д. Дату вылета, соответсвующую компоненту тарифа без аэропорта отправления и прибытия пропускаем. При этом, если у нескольких компонентов тарифов совпадают код тарифа, аэропорты отправления и прибытия и маркетинговые перевозчики, то датой отправления у второго совпадающего компонента является дата отправления первого:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| LED—MAD | NFLMOW | S7 | 2016-09-20 |
|         | NFLMOW | S7 | &zwnj;     |

- Для тех компонентов тарифа, у которых отсутствуют аэропорты отправления и прибытия, указываем аэропорт отправления, аэропорт прибытия и дату отправления предыдущего компонента тарифа.

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| LED—MAD | NFLMOW | S7 | 2016-09-20 |
| LED—MAD | NFLMOW | S7 | 2016-09-20 |

- Все данные получены, теперь можно отправить несколько запросов к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules/resources) и получить все правила тарифов для всех сегментов (см. [Получение текста правил тарифа (OTA_AirRulesLLSRQ)](#OTA_AirRulesLLSRQ)).

В данном алгоритме в качестве примера использовался следующий вариант перелета:

{% xmlsec "Пример перелета" %}
<PricedItinerary SequenceNumber="1">
  <AirItinerary DirectionInd="Other">
    <OriginDestinationOptions>
      <OriginDestinationOption ElapsedTime="650">
        <FlightSegment ArrivalDateTime="2016-09-13T20:45:00" DepartureDateTime="2016-09-13T19:50:00" ElapsedTime="295" FlightNumber="74" ResBookDesigCode="Q" StopQuantity="0">
          <DepartureAirport LocationCode="KJA" TerminalID="1"/>
          <ArrivalAirport LocationCode="DME"/>
          <OperatingAirline Code="GH" FlightNumber="74"/>
          <Equipment AirEquipType="738"/>
          <MarketingAirline Code="S7"/>
          <DisclosureAirline Code="GH"/>
          <MarriageGrp>O</MarriageGrp>
          <DepartureTimeZone GMTOffset="7"/>
          <ArrivalTimeZone GMTOffset="3"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
        <FlightSegment ArrivalDateTime="2016-09-14T02:40:00" DepartureDateTime="2016-09-14T01:05:00" ElapsedTime="95" FlightNumber="37" ResBookDesigCode="O" StopQuantity="0">
          <DepartureAirport LocationCode="DME"/>
          <ArrivalAirport LocationCode="LED" TerminalID="1"/>
          <OperatingAirline Code="S7" FlightNumber="37"/>
          <Equipment AirEquipType="319"/>
          <MarketingAirline Code="S7"/>
          <MarriageGrp>O</MarriageGrp>
          <DepartureTimeZone GMTOffset="3"/>
          <ArrivalTimeZone GMTOffset="3"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
      </OriginDestinationOption>
      <OriginDestinationOption ElapsedTime="90">
        <FlightSegment ArrivalDateTime="2016-09-16T00:25:00" DepartureDateTime="2016-09-15T22:55:00" ElapsedTime="90" FlightNumber="42" ResBookDesigCode="O" StopQuantity="0">
          <DepartureAirport LocationCode="LED" TerminalID="1"/>
          <ArrivalAirport LocationCode="DME"/>
          <OperatingAirline Code="S7" FlightNumber="42"/>
          <Equipment AirEquipType="319"/>
          <MarketingAirline Code="S7"/>
          <MarriageGrp>O</MarriageGrp>
          <DepartureTimeZone GMTOffset="3"/>
          <ArrivalTimeZone GMTOffset="3"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
      </OriginDestinationOption>
      <OriginDestinationOption ElapsedTime="95">
        <FlightSegment ArrivalDateTime="2016-09-17T07:35:00" DepartureDateTime="2016-09-17T06:00:00" ElapsedTime="95" FlightNumber="19" ResBookDesigCode="Q" StopQuantity="0">
          <DepartureAirport LocationCode="DME"/>
          <ArrivalAirport LocationCode="LED" TerminalID="1"/>
          <OperatingAirline Code="S7" FlightNumber="19"/>
          <Equipment AirEquipType="319"/>
          <MarketingAirline Code="S7"/>
          <MarriageGrp>O</MarriageGrp>
          <DepartureTimeZone GMTOffset="3"/>
          <ArrivalTimeZone GMTOffset="3"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
      </OriginDestinationOption>
      <OriginDestinationOption ElapsedTime="755">
        <FlightSegment ArrivalDateTime="2016-09-21T00:25:00" DepartureDateTime="2016-09-20T22:55:00" ElapsedTime="90" FlightNumber="42" ResBookDesigCode="N" StopQuantity="0">
          <DepartureAirport LocationCode="LED" TerminalID="1"/>
          <ArrivalAirport LocationCode="DME"/>
          <OperatingAirline Code="S7" FlightNumber="42"/>
          <Equipment AirEquipType="319"/>
          <MarketingAirline Code="S7"/>
          <MarriageGrp>O</MarriageGrp>
          <DepartureTimeZone GMTOffset="3"/>
          <ArrivalTimeZone GMTOffset="3"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
        <FlightSegment ArrivalDateTime="2016-09-21T10:30:00" DepartureDateTime="2016-09-21T06:15:00" ElapsedTime="315" FlightNumber="4063" ResBookDesigCode="N" StopQuantity="0">
          <DepartureAirport LocationCode="DME"/>
          <ArrivalAirport LocationCode="MAD" TerminalID="4S"/>
          <OperatingAirline Code="IB" FlightNumber="3143"/>
          <Equipment AirEquipType="319"/>
          <MarketingAirline Code="S7"/>
          <DisclosureAirline Code="IB"/>
          <MarriageGrp>I</MarriageGrp>
          <DepartureTimeZone GMTOffset="3"/>
          <ArrivalTimeZone GMTOffset="2"/>
          <TPA_Extensions>
            <eTicket Ind="true"/>
          </TPA_Extensions>
        </FlightSegment>
      </OriginDestinationOption>
    </OriginDestinationOptions>
  </AirItinerary>
  <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2016-07-20" PricingSource="ADVJR1" PricingSubSource="MIP">
    <ItinTotalFare>
      <BaseFare Amount="371.00" CurrencyCode="EUR" DecimalPlaces="2"/>
      <FareConstruction Amount="420.27" CurrencyCode="NUC" DecimalPlaces="2"/>
      <EquivFare Amount="26345" CurrencyCode="RUB" DecimalPlaces="0"/>
      <Taxes>
        <Tax Amount="6875" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
      </Taxes>
      <TotalFare Amount="33220" CurrencyCode="RUB" DecimalPlaces="0"/>
    </ItinTotalFare>
    <PTC_FareBreakdowns>
      <PTC_FareBreakdown>
        <PassengerTypeQuantity Code="ADT" Quantity="1"/>
        <FareBasisCodes>
          <FareBasisCode ArrivalAirportCode="DME" AvailabilityBreak="true" BookingCode="Q" DepartureAirportCode="KJA" FareComponentBeginAirport="KJA" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" GovCarrier="S7">QFLMOW</FareBasisCode>
          <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="O" DepartureAirportCode="DME" FareComponentBeginAirport="DME" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" GovCarrier="S7">OFLRT</FareBasisCode>
          <FareBasisCode ArrivalAirportCode="DME" AvailabilityBreak="true" BookingCode="O" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="TO" FareComponentEndAirport="DME" GovCarrier="S7">OFLRT</FareBasisCode>
          <FareBasisCode ArrivalAirportCode="LED" AvailabilityBreak="true" BookingCode="Q" DepartureAirportCode="DME" FareComponentBeginAirport="KJA" FareComponentDirectionality="FROM" FareComponentEndAirport="LED" GovCarrier="S7">QFLMOW</FareBasisCode>
          <FareBasisCode ArrivalAirportCode="DME" BookingCode="N" DepartureAirportCode="LED" FareComponentBeginAirport="LED" FareComponentDirectionality="FROM" FareComponentEndAirport="MAD" GovCarrier="S7">NFLMOW</FareBasisCode>
          <FareBasisCode ArrivalAirportCode="MAD" AvailabilityBreak="true" BookingCode="N" DepartureAirportCode="DME" GovCarrier="S7">NFLMOW</FareBasisCode>
        </FareBasisCodes>
        <PassengerFare>
          <BaseFare Amount="371.00" CurrencyCode="EUR"/>
          <FareConstruction Amount="420.27" CurrencyCode="NUC" DecimalPlaces="2"/>
          <EquivFare Amount="26345" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="462" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
            <Tax Amount="462" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
            <Tax Amount="462" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
            <Tax Amount="462" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
            <Tax Amount="462" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
            <Tax Amount="1500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <Tax Amount="500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <Tax Amount="500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <Tax Amount="500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <Tax Amount="500" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <Tax Amount="1065" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRF"/>
            <TotalTax Amount="6875" CurrencyCode="RUB" DecimalPlaces="0"/>
          </Taxes>
          <TotalFare Amount="33220" CurrencyCode="RUB"/>
          <TPA_Extensions>
            <Messages>
              <Message AirlineCode="S7" FailCode="0" Info="S7 ONLY/REF/CHNG/RESTR" Type="N"/>
              <Message FailCode="0" Info="VALIDATING CARRIER - S7" Type="W"/>
            </Messages>
            <BaggageInformationList>
              <BaggageInformation>
                <Segment Id="0"/>
                <Segment Id="1"/>
                <Allowance Pieces="1"/>
              </BaggageInformation>
              <BaggageInformation>
                <Segment Id="2"/>
                <Allowance Pieces="1"/>
              </BaggageInformation>
              <BaggageInformation>
                <Segment Id="3"/>
                <Allowance Pieces="1"/>
              </BaggageInformation>
              <BaggageInformation>
                <Segment Id="4"/>
                <Segment Id="5"/>
                <Allowance Pieces="1"/>
              </BaggageInformation>
            </BaggageInformationList>
          </TPA_Extensions>
        </PassengerFare>
        <Endorsements NonRefundableIndicator="false"/>
        <TPA_Extensions>
          <FareCalcLine Info="KJA S7 MOW*S7 LED46.44S7 MOW46.44*S7 LED149.31S7 X/MOW S7 MAD178.08NUC420.27END ROE0.881606"/>
        </TPA_Extensions>
        <FareInfos>
          <FareInfo>
            <FareReference>Q</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="H"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>O</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>O</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>Q</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="S"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>N</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="7"/>
              <Cabin Cabin="Y"/>
              <Meal Code="B"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
      </PTC_FareBreakdown>
    </PTC_FareBreakdowns>
    <FareInfos>
      <FareInfo>
        <FareReference>Q</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="H"/>
        </TPA_Extensions>
      </FareInfo>
      <FareInfo>
        <FareReference>O</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="S"/>
        </TPA_Extensions>
      </FareInfo>
      <FareInfo>
        <FareReference>O</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="S"/>
        </TPA_Extensions>
      </FareInfo>
      <FareInfo>
        <FareReference>Q</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="S"/>
        </TPA_Extensions>
      </FareInfo>
      <FareInfo>
        <FareReference>N</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="S"/>
        </TPA_Extensions>
      </FareInfo>
      <FareInfo>
        <FareReference>N</FareReference>
        <TPA_Extensions>
          <SeatsRemaining BelowMin="false" Number="7"/>
          <Cabin Cabin="Y"/>
          <Meal Code="B"/>
        </TPA_Extensions>
      </FareInfo>
    </FareInfos>
    <TPA_Extensions>
      <DivideInParty Indicator="false"/>
    </TPA_Extensions>
  </AirItineraryPricingInfo>
  <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
  <TPA_Extensions>
    <ValidatingCarrier Code="S7"/>
  </TPA_Extensions>
</PricedItinerary>
{% endxmlsec %}

### Группированный ответ BFM (Grouped Itinerary Response (GIR))

- Определяем необходимые поля для получения текста правил тарифов:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
|...|...|...|...|
  
- Составляем список компонентов тарифов (```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/FareComponent```) для нужного варианта перелета (в качестве ID используется значение атрибута ```/@Ref```) и указываем дату перелета (атрибут ```/@TravelCommencementDate```):

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** | ID компонента тарифа |
|-------------------------------------|----------------|------------------------------|----------|
|  |  |  | 2016-09-13 | 9  |
|  |  |  | 2016-09-14 | 5  |
|  |  |  | 2016-09-15 | 8  |
|  |  |  | 2016-09-13 | 10 |
|  |  |  | 2016-09-20 | 3  |

- Для каждого компонента тарифа считываем его описание (```/GroupedItineraryResponse/FareComponentDesc```) по ID и указываем маркетингового перевозчика (атрибут ```/@GoverningCarrier```), код тарифа (атрибут ```/@FareBasisCode```), количество сегментов, соответствующих ему (по количеству элементов ```/GroupedItineraryResponse/FareComponentDesc/Segment```), а также направление (атрибут ```/@Directionality```):

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** | ID компонента тарифа | Количество сегментов | Направление |
|-------------------------------------|----------------|------------------------------|----------|----------------------|----------------------|-------------|
|  | QFLMOW | S7 | 2016-09-13 | 9  | 1 | FROM |
|  | OFLRT  | S7 | 2016-09-14 | 5  | 1 | FROM |
|  | OFLRT  | S7 | 2016-09-15 | 8  | 1 | TO   |
|  | QFLMOW | S7 | 2016-09-13 | 10 | 1 | FROM |
|  | NFLMOW | S7 | 2016-09-20 | 3  | 2 | FROM |

- Из описания каждого компонента тарифа для каждого сегмента (элемент ```/GroupedItineraryResponse/FareComponentDesc/Segment```) проверяем наличие элемента ```/SideTrip``` и атрибута ```/SideTrip/@Begin``` со значением ```true```. Наличие этого элемента без атрибута говорит о том, что впереди будет продолжение текущего компонента тарифа. Следующий компонент тарифа, сегмент которого не будет содержать элемент ```/SideTrip``` и атрибут ```/SideTrip/@Begin``` со значением ```true```, будет являться продолжением текущего:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** | ID компонента тарифа | Количество сегментов | Направление | Продолжение |
|-------------------------------------|----------------|------------------------------|----------|----------------------|----------------------|-------------|-------------|
|  | QFLMOW | S7 | 2016-09-13 | 9  | 1 | FROM | ID 10 → |
|  | OFLRT  | S7 | 2016-09-14 | 5  | 1 | FROM |         |
|  | OFLRT  | S7 | 2016-09-15 | 8  | 1 | TO   |         |
|  | QFLMOW | S7 | 2016-09-13 | 10 | 1 | FROM | ← ID 9  |
|  | NFLMOW | S7 | 2016-09-20 | 3  | 2 | FROM | &zwnj;  |

- Теперь составляем список плеч (элементы ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/Leg```) для нужного варианта перелета (в качестве ID используется значение атрибута ```/@Ref```):

| ID плеча |
|----------|
| 11 |
| 9  |
| 8  |
| 17 |

- Для каждого плеча читаем его описание (элемент ```/GroupedItineraryResponse/LegDesc```) и составляем список соответствующих ему сегментов (элементы ```/Schedule```, в качестве ID используется значение атрибута ```/@Ref```):

| ID плеча | ID сегмента |
|------------------------|
| 11 | 7 |
| 11 | 1 |
| 9  | 6 |
| 8  | 5 |
| 17 | 6 |
| 17 | 8 |

- Из описания сегмента (элемент ```/GroupedItineraryResponse/ScheduleDesc```) считываем аэропорты отправления (атрибут ```Departure/@Airport```) и прибытия (атрибут ```Arrival/@Airport```):

| ID плеча | ID сегмента | Аэропорт отправления и прибытия |
|----------|-------------|---------------------------------|
| 11 | 7 | KJA—DME |
| 11 | 1 | DME—LED |
| 9  | 6 | LED—DME |
| 8  | 5 | DME—LED |
| 17 | 6 | LED—DME |
| 17 | 8 | DME—MAD |

- Объединяем список сегментов и список компонентов тарифов в соответствии с тем количеством сегментов, соответствующих каждому компоненту тарифа. При объединении необходимо произвести несколько изменений:
    - если одному компоненту тарифа соответствует несколько сегментов, то у каждого из них аэропорт отправления и аэропорт прибытия должны совпадать и в качестве аэропорта отправления иметь аэропорт отправления первого сегмента, относящегося к этому компоненту тарифа, а в качестве аэропорт назначения — аэропорт назначения последнего сегмента, относящегося к этому компоненту тарифа
    - если один компонент тарифа является продолжением другого, то для предыдущего пункта в качестве аэропорт прибытия используется аэропорт прибытия последнего сегмента продолжения компонента тарифа
    - если значения направления у компонента тарифа равно ```TO```, то необходимо поменять местами аэропорт отправления и аэропорт прибытия у всех сегментов, которые относятся к этому компоненту тарифа
    - если у нескольких компонентов тарифов совпадают код тарифа, аэропорты отправления и прибытия и маркетинговые перевозчики, то датой отправления у второго совпадающего компонента является дата отправления первого:

| **Аэропорт отправления и прибытия** | **Код тарифа** | **Маркетинговый перевозчик** | **Дата** |
|-------------------------------------|----------------|------------------------------|----------|
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| DME—LED | OFLRT  | S7 | 2016-09-14 |
| KJA—LED | QFLMOW | S7 | 2016-09-13 |
| LED—MAD | NFLMOW | S7 | 2016-09-20 |
| LED—MAD | NFLMOW | S7 | 2016-09-20 |

- Все данные получены, теперь можно отправить несколько запросов к сервису [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules/resources) и получить все правила тарифов для всех сегментов (см. [Получение текста правил тарифа (OTA_AirRulesLLSRQ)](#OTA_AirRulesLLSRQ)).

В данном алгоритме в качестве примера использовался следующий вариант перелета:

{% xmlsec "Пример перелета" %}
<ScheduleDesc ETicketable="true" Frequency="***WTFS" ID="1" Stops="0">
  <Departure Airport="DME" City="MOW" Country="RU" Time="01:05:00+03:00"/>
  <Arrival Airport="LED" City="LED" Country="RU" Terminal="1" Time="02:40:00+03:00"/>
  <Carrier Alliances="OW " Marketing="S7" MarketingFlightNumber="37" Operating="S7" OperatingFlightNumber="37">
    <Equipment Code="319" TypeForFirstLeg="N" TypeForLastLeg="N"/>
  </Carrier>
</ScheduleDesc>
<ScheduleDesc ETicketable="true" Frequency="******S" ID="5" Stops="0">
  <Departure Airport="DME" City="MOW" Country="RU" Time="06:00:00+03:00"/>
  <Arrival Airport="LED" City="LED" Country="RU" Terminal="1" Time="07:35:00+03:00"/>
  <Carrier Alliances="OW " Marketing="S7" MarketingFlightNumber="19" Operating="S7" OperatingFlightNumber="19">
    <Equipment Code="319" TypeForFirstLeg="N" TypeForLastLeg="N"/>
  </Carrier>
</ScheduleDesc>
<ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="6" Stops="0">
  <Departure Airport="LED" City="LED" Country="RU" Terminal="1" Time="22:55:00+03:00"/>
  <Arrival Airport="DME" City="MOW" Country="RU" DateAdjustment="1" Time="00:25:00+03:00"/>
  <Carrier Alliances="OW " Marketing="S7" MarketingFlightNumber="42" Operating="S7" OperatingFlightNumber="42">
    <Equipment Code="319" TypeForFirstLeg="N" TypeForLastLeg="N"/>
  </Carrier>
</ScheduleDesc>
<ScheduleDesc ETicketable="true" Frequency="SMTWTF*" ID="7" Stops="0">
  <Departure Airport="KJA" City="KJA" Country="XU" Terminal="1" Time="19:50:00+07:00"/>
  <Arrival Airport="DME" City="MOW" Country="RU" Time="20:45:00+03:00"/>
  <Carrier Alliances="OW " Disclosure="GH" Marketing="S7" MarketingFlightNumber="74" Operating="GH" OperatingFlightNumber="74">
    <Equipment Code="738" TypeForFirstLeg="N" TypeForLastLeg="N"/>
  </Carrier>
</ScheduleDesc>
<ScheduleDesc ETicketable="true" Frequency="SMTWTFS" ID="8" Stops="0">
  <Departure Airport="DME" City="MOW" Country="RU" Time="06:15:00+03:00"/>
  <Arrival Airport="MAD" City="MAD" Country="ES" Terminal="4S" Time="10:30:00+02:00"/>
  <Carrier Alliances="OW " Disclosure="IB" Marketing="S7" MarketingFlightNumber="4063" Operating="IB" OperatingFlightNumber="3143">
    <Equipment Code="319" TypeForFirstLeg="N" TypeForLastLeg="N"/>
  </Carrier>
</ScheduleDesc>

<!-- ... -->

<FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="178.08" FareBasisCode="NFLMOW" FareCurrency="EUR" FarePassengerType="ADT" GoverningCarrier="S7" ID="3" NotValidAfter="2017-09-13" OneWayFare="true" PublishedFareAmount="157.00">
  <Segment/>
  <Segment/>
</FareComponentDesc>
<FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="FROM" FareAmount="46.44" FareBasisCode="OFLRT" FareCurrency="RUB" FarePassengerType="ADT" GoverningCarrier="S7" ID="5" NotValidAfter="2017-07-06" PublishedFareAmount="6000">
  <Segment Stopover="true">
    <SideTrip Begin="true"/>
  </Segment>
</FareComponentDesc>
<FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="EH" Directionality="TO" FareAmount="46.44" FareBasisCode="OFLRT" FareCurrency="RUB" FarePassengerType="ADT" GoverningCarrier="S7" ID="8" NotValidAfter="2017-07-06" PublishedFareAmount="6000">
  <Segment Stopover="true">
    <SideTrip Begin="true"/>
  </Segment>
</FareComponentDesc>
<FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="FE" Directionality="FROM" FareAmount="149.31" FareBasisCode="QFLMOW" FareCurrency="RUB" FarePassengerType="ADT" GoverningCarrier="S7" ID="9" NotValidAfter="2017-09-13" OneWayFare="true" PublishedFareAmount="9645">
  <Segment>
    <SideTrip/>
  </Segment>
</FareComponentDesc>
<FareComponentDesc ApplicablePricingCategories="4 5 10 15 16 18" Direction="FE" Directionality="FROM" FareAmount="149.31" FareBasisCode="QFLMOW" FareCurrency="RUB" FarePassengerType="ADT" GoverningCarrier="S7" ID="10" NotValidAfter="2017-09-13" OneWayFare="true" PublishedFareAmount="9645">
  <Segment Stopover="true"/>
</FareComponentDesc>

<!-- ... -->

<LegDesc ID="8">
  <Schedule Ref="5"/>
</LegDesc>
<LegDesc ID="9">
  <Schedule Ref="6"/>
</LegDesc>
<LegDesc ID="11">
  <Schedule Ref="7"/>
  <Schedule DepartureDateAdjustment="1" Ref="1"/>
</LegDesc>
<LegDesc ID="17">
  <Schedule Ref="6"/>
  <Schedule DepartureDateAdjustment="1" Ref="8"/>
</LegDesc>

<!-- ... -->

<ItineraryGroup>
  <GroupDescription>
    <LegDescription ArrivalLocation="LED" DepartureDate="2016-09-13" DepartureLocation="KJA"/>
    <LegDescription ArrivalLocation="DME" DepartureDate="2016-09-15" DepartureLocation="LED"/>
    <LegDescription ArrivalLocation="LED" DepartureDate="2016-09-17" DepartureLocation="DME"/>
    <LegDescription ArrivalLocation="MAD" DepartureDate="2016-09-20" DepartureLocation="LED"/>
  </GroupDescription>
  <Itinerary ID="1" PricingSource="ADVJR1">
    <Leg Ref="11"/>
    <Leg Ref="9"/>
    <Leg Ref="8"/>
    <Leg Ref="17"/>
    <PricingInformation PricingSubsource="MIP">
      <Fare ETicketable="true" GoverningCarriers="S7 S7 S7 S7" LastTicketDate="2016-07-20" VITA="true" ValidatingCarrier="S7">
        <PassengerInfo NonRefundable="false" PassengerNumber="1" PassengerType="ADT">
          <FareComponent Ref="9" TravelCommencementDate="2016-09-13">
            <Segment AvailabilityBreak="true" BookingCode="Q" CabinCode="Y" MealCode="H" SeatsAvailable="7"/>
          </FareComponent>
          <FareComponent Ref="5" TravelCommencementDate="2016-09-14">
            <Segment AvailabilityBreak="true" BookingCode="O" CabinCode="Y" MealCode="S" SeatsAvailable="7"/>
          </FareComponent>
          <FareComponent Ref="8" TravelCommencementDate="2016-09-15">
            <Segment AvailabilityBreak="true" BookingCode="O" CabinCode="Y" MealCode="S" SeatsAvailable="7"/>
          </FareComponent>
          <FareComponent Ref="10" TravelCommencementDate="2016-09-13">
            <Segment AvailabilityBreak="true" BookingCode="Q" CabinCode="Y" MealCode="S" SeatsAvailable="7"/>
          </FareComponent>
          <FareComponent Ref="3" TravelCommencementDate="2016-09-20">
            <Segment BookingCode="N" CabinCode="Y" MealCode="S" SeatsAvailable="7"/>
            <Segment AvailabilityBreak="true" BookingCode="N" CabinCode="Y" MealCode="B" SeatsAvailable="7"/>
          </FareComponent>
          <Tax Ref="11"/>
          <Tax Ref="7"/>
          <Tax Ref="10"/>
          <Tax Ref="7"/>
          <Tax Ref="10"/>
          <Tax Ref="5"/>
          <Tax Ref="9"/>
          <Tax Ref="8"/>
          <Tax Ref="9"/>
          <Tax Ref="8"/>
          <Tax Ref="2"/>
          <CurrencyConversion ExchangeRateUsed="71" From="EUR" To="RUB"/>
          <FareMessage Carrier="S7" Code="0" Info="S7 ONLY/REF/CHNG/RESTR" Type="N"/>
          <FareMessage Code="0" Info="VALIDATING CARRIER - S7" Type="W"/>
          <PassengerTotalFare BaseFareAmount="371.00" BaseFareCurrency="EUR" CommissionAmount="0" CommissionPercentage="0" ConstructionAmount="420.27" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="26345" EquivalentCurrency="RUB" ExchangeRateOne="0.88160600" TotalFare="33220" TotalTaxes="6875"/>
          <BaggageInformation>
            <Segment ID="0"/>
            <Segment ID="1"/>
            <Allowance Ref="2"/>
          </BaggageInformation>
          <BaggageInformation>
            <Segment ID="2"/>
            <Allowance Ref="2"/>
          </BaggageInformation>
          <BaggageInformation>
            <Segment ID="3"/>
            <Allowance Ref="2"/>
          </BaggageInformation>
          <BaggageInformation>
            <Segment ID="4"/>
            <Segment ID="5"/>
            <Allowance Ref="2"/>
          </BaggageInformation>
        </PassengerInfo>
        <TotalFare BaseFareAmount="371.00" BaseFareCurrency="EUR" ConstructionAmount="420.27" ConstructionCurrency="NUC" Currency="RUB" EquivalentAmount="26345" EquivalentCurrency="RUB" TotalPrice="33220" TotalTaxes="6875"/>
      </Fare>
    </PricingInformation>
  </Itinerary>
</ItineraryGroup>
{% endxmlsec %}

### Универсальный алгоритм

Универсальный алгоритм получения правил может быть использован для любого типа ответа сервисов Bargain Finder Max.

{% imgsec "Схема", "0", "fares" %}./assets/svg/Fare Rules/[RU]Fare Rules-0.svg{% endimgsec %}

** Бронирование сегментов (EnhancedAirBookRQ) **

Для бронирования сегментов и создания расчета стоимости используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking/resources). Запрос к нему строится по аналогии с запросом на создание бронирования (см. [Создание бронирований](create-booking.md)), за исключением того, что требуется указать в качестве статуса сегментов ```QF``` (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости и получения правил тарифа. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика.

{% xmlsec "Пример запроса" %}
<EnhancedAirBookRQ HaltOnError="true" IgnoreOnError="true" version="3.6.0" xmlns="http://services.sabre.com/sp/eab/v3_6">
  <OTA_AirBookRQ>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2016-09-13T19:50:00" FlightNumber="74" NumberInParty="1" ResBookDesigCode="Q" Status="QF">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="74"/>
        <OriginLocation LocationCode="KJA"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-14T01:05:00" FlightNumber="37" NumberInParty="1" ResBookDesigCode="O" Status="QF">
        <DestinationLocation LocationCode="LED"/>
        <MarketingAirline Code="S7" FlightNumber="37"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-15T22:55:00" FlightNumber="42" NumberInParty="1" ResBookDesigCode="O" Status="QF">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="42"/>
        <OriginLocation LocationCode="LED"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-17T06:00:00" FlightNumber="19" NumberInParty="1" ResBookDesigCode="Q" Status="QF">
        <DestinationLocation LocationCode="LED"/>
        <MarketingAirline Code="S7" FlightNumber="19"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-20T22:55:00" FlightNumber="42" NumberInParty="1" ResBookDesigCode="N" Status="QF">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="42"/>
        <OriginLocation LocationCode="LED"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2016-09-21T06:15:00" FlightNumber="4063" NumberInParty="1" ResBookDesigCode="N" Status="QF">
        <DestinationLocation LocationCode="MAD"/>
        <MarketingAirline Code="S7" FlightNumber="4063"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </OTA_AirBookRQ>
  <OTA_AirPriceRQ>
    <PriceRequestInformation Retain="true">
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="S7"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <PassengerType Code="ADT" Quantity="1"/>
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </OTA_AirPriceRQ>
  <PostProcessing IgnoreAfter="false">
    <RedisplayReservation WaitInterval="2000"/>
  </PostProcessing>
  <PreProcessing IgnoreBefore="true"/>
</EnhancedAirBookRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_6">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2016-07-18T09:06:16.237-05:00"/>
  </ApplicationResults>
  <OTA_AirBookRS>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="09-13T20:45" DepartureDateTime="09-13T19:50" FlightNumber="0074" NumberInParty="001" ResBookDesigCode="Q" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="0074"/>
        <OriginLocation LocationCode="KJA"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-14T02:40" DepartureDateTime="09-14T01:05" FlightNumber="0037" NumberInParty="001" ResBookDesigCode="O" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="LED"/>
        <MarketingAirline Code="S7" FlightNumber="0037"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-16T00:25" DepartureDateTime="09-15T22:55" FlightNumber="0042" NumberInParty="001" ResBookDesigCode="O" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="0042"/>
        <OriginLocation LocationCode="LED"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-17T07:35" DepartureDateTime="09-17T06:00" FlightNumber="0019" NumberInParty="001" ResBookDesigCode="Q" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="LED"/>
        <MarketingAirline Code="S7" FlightNumber="0019"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-21T00:25" DepartureDateTime="09-20T22:55" FlightNumber="0042" NumberInParty="001" ResBookDesigCode="N" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="DME"/>
        <MarketingAirline Code="S7" FlightNumber="0042"/>
        <OriginLocation LocationCode="LED"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-21T10:30" DepartureDateTime="09-21T06:15" FlightNumber="4063" NumberInParty="001" ResBookDesigCode="N" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="MAD"/>
        <MarketingAirline Code="S7" FlightNumber="4063"/>
        <OriginLocation LocationCode="DME"/>
      </FlightSegment>
    </OriginDestinationOption>
  </OTA_AirBookRS>
  <OTA_AirPriceRS>
    <PriceQuote>
      <MiscInformation>
        <BaggageInfo>
          <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0DFAAS7</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO70LB 32KG AND80LI 203LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="32">
              <Text>UP TO 70 POUNDS/32 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="6B">
              <Text>UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0FNACS7</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">203</MaximumSizeInAlternate>
              <MaximumSize Units="I">80</MaximumSize>
              <MaximumWeightInAlternate Units="K">32</MaximumWeightInAlternate>
              <MaximumWeight Units="L">70</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO50LB 23KG AND80LI 203LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="2C">
              <Text>MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0J0ACS7</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">200</MaximumSizeInAlternate>
              <MaximumSize Units="I">79</MaximumSize>
              <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
              <MaximumWeight Units="L">50</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABS7</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRY UPTO 45LI 115LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="4U">
              <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0MJACS7</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
              <MaximumSize Units="I">45</MaximumSize>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="6" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABIB</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1Q"/>
            <AlternateBooking ResBookDesigCode="2O"/>
            <AlternateBooking ResBookDesigCode="3O"/>
            <AlternateBooking ResBookDesigCode="4Q"/>
            <AlternateBooking ResBookDesigCode="5N"/>
            <AlternateBooking ResBookDesigCode="6N"/>
          </BargainFinder>
          <DepartureDate>2016-09-13</DepartureDate>
          <LastTicketingDate>07-21T17:06</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED - S7</Text>
          <Text>BAG ALLOWANCE     -KJALED-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-KJALED-RUB4000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
          <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -LEDDME-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-LEDDME-RUB2000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
          <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -DMELED-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-DMELED-RUB2000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
          <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -LEDMAD-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-LEDMAD-RUB3550/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
          <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>KJADME DMELED LEDDME DMELED LEDDME-01P/10KG/S7</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND UP TO 45 LINEAR INCHES/115</Text>
          <Text>LINEAR CENTIMETERS</Text>
          <Text>DMEMAD-01P/IB</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>KJADME DMELED LEDDME DMELED LEDDME-S7-CARRY ON FEES UNKNOWN-CON</Text>
          <Text>TACT CARRIER</Text>
          <Text>DMEMAD-IB-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>13SEP DEPARTURE DATE ----- LAST DAY TO PURCHASE 21JUL</Text>
          <ValidatingCarrier Code="S7"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <CurrencyCode>RUB</CurrencyCode>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>33220</TotalAmount>
        </SolutionInformation>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="33220">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CarrierCode RPH="2">S7</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-13</DepartureDate>
              <DepartureDate RPH="2">2016-09-14</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <DestinationLocation LocationCode="LED" RPH="2"/>
              <FlightNumber RPH="1">74</FlightNumber>
              <FlightNumber RPH="2">37</FlightNumber>
              <OriginLocation LocationCode="KJA" RPH="1"/>
              <OriginLocation LocationCode="DME" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Q</ResBookDesigCode>
              <ResBookDesigCode RPH="2">O</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0J0ACS7</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAAS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CarrierCode RPH="2">S7</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-13</DepartureDate>
              <DepartureDate RPH="2">2016-09-14</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <DestinationLocation LocationCode="LED" RPH="2"/>
              <FlightNumber RPH="1">74</FlightNumber>
              <FlightNumber RPH="2">37</FlightNumber>
              <OriginLocation LocationCode="KJA" RPH="1"/>
              <OriginLocation LocationCode="DME" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Q</ResBookDesigCode>
              <ResBookDesigCode RPH="2">O</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <Interlineable>Y</Interlineable>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="4000" CurrencyCode="RUB"/>
              <Equiv Amount="4000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>4000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0FNACS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <FlightNumber RPH="1">42</FlightNumber>
              <OriginLocation LocationCode="LED" RPH="1"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <ResBookDesigCode RPH="1">O</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0J0ACS7</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAAS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <FlightNumber RPH="1">42</FlightNumber>
              <OriginLocation LocationCode="LED" RPH="1"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <ResBookDesigCode RPH="1">O</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <Interlineable>Y</Interlineable>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0FNACS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-17</DepartureDate>
              <DestinationLocation LocationCode="LED" RPH="1"/>
              <FlightNumber RPH="1">19</FlightNumber>
              <OriginLocation LocationCode="DME" RPH="1"/>
              <PNR_Segment RPH="1">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Q</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0J0ACS7</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAAS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-17</DepartureDate>
              <DestinationLocation LocationCode="LED" RPH="1"/>
              <FlightNumber RPH="1">19</FlightNumber>
              <OriginLocation LocationCode="DME" RPH="1"/>
              <PNR_Segment RPH="1">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Q</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <Interlineable>Y</Interlineable>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0FNACS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CarrierCode RPH="2">S7</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-20</DepartureDate>
              <DepartureDate RPH="2">2016-09-21</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <DestinationLocation LocationCode="MAD" RPH="2"/>
              <FlightNumber RPH="1">42</FlightNumber>
              <FlightNumber RPH="2">4063</FlightNumber>
              <OriginLocation LocationCode="LED" RPH="1"/>
              <OriginLocation LocationCode="DME" RPH="2"/>
              <PNR_Segment RPH="1">6</PNR_Segment>
              <PNR_Segment RPH="2">7</PNR_Segment>
              <ResBookDesigCode RPH="1">N</ResBookDesigCode>
              <ResBookDesigCode RPH="2">N</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0J0ACS7</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAAS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="8">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CarrierCode RPH="2">S7</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-20</DepartureDate>
              <DepartureDate RPH="2">2016-09-21</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <DestinationLocation LocationCode="MAD" RPH="2"/>
              <FlightNumber RPH="1">42</FlightNumber>
              <FlightNumber RPH="2">4063</FlightNumber>
              <OriginLocation LocationCode="LED" RPH="1"/>
              <OriginLocation LocationCode="DME" RPH="2"/>
              <PNR_Segment RPH="1">6</PNR_Segment>
              <PNR_Segment RPH="2">7</PNR_Segment>
              <ResBookDesigCode RPH="1">N</ResBookDesigCode>
              <ResBookDesigCode RPH="2">N</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <Interlineable>Y</Interlineable>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="50.00" CurrencyCode="EUR"/>
              <Equiv Amount="3550" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>3550</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0FNACS7</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="9">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CarrierCode RPH="2">S7</CarrierCode>
              <CarrierCode RPH="3">S7</CarrierCode>
              <CarrierCode RPH="4">S7</CarrierCode>
              <CarrierCode RPH="5">S7</CarrierCode>
              <CountForSegmentAssociatedID>5</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-13</DepartureDate>
              <DepartureDate RPH="2">2016-09-14</DepartureDate>
              <DepartureDate RPH="3">2016-09-15</DepartureDate>
              <DepartureDate RPH="4">2016-09-17</DepartureDate>
              <DepartureDate RPH="5">2016-09-20</DepartureDate>
              <DestinationLocation LocationCode="DME" RPH="1"/>
              <DestinationLocation LocationCode="LED" RPH="2"/>
              <DestinationLocation LocationCode="DME" RPH="3"/>
              <DestinationLocation LocationCode="LED" RPH="4"/>
              <DestinationLocation LocationCode="DME" RPH="5"/>
              <FlightNumber RPH="1">74</FlightNumber>
              <FlightNumber RPH="2">37</FlightNumber>
              <FlightNumber RPH="3">42</FlightNumber>
              <FlightNumber RPH="4">19</FlightNumber>
              <FlightNumber RPH="5">42</FlightNumber>
              <OriginLocation LocationCode="KJA" RPH="1"/>
              <OriginLocation LocationCode="DME" RPH="2"/>
              <OriginLocation LocationCode="LED" RPH="3"/>
              <OriginLocation LocationCode="DME" RPH="4"/>
              <OriginLocation LocationCode="LED" RPH="5"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <PNR_Segment RPH="5">6</PNR_Segment>
              <ResBookDesigCode RPH="1">Q</ResBookDesigCode>
              <ResBookDesigCode RPH="2">O</ResBookDesigCode>
              <ResBookDesigCode RPH="3">O</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Q</ResBookDesigCode>
              <ResBookDesigCode RPH="5">N</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
              <StatusCode RPH="3">QF</StatusCode>
              <StatusCode RPH="4">QF</StatusCode>
              <StatusCode RPH="5">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>S7</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0MJACS7</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABS7</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">10</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="10">
            <Associations>
              <CarrierCode RPH="1">S7</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-21</DepartureDate>
              <DestinationLocation LocationCode="MAD" RPH="1"/>
              <FlightNumber RPH="1">4063</FlightNumber>
              <OriginLocation LocationCode="DME" RPH="1"/>
              <PNR_Segment RPH="1">7</PNR_Segment>
              <ResBookDesigCode RPH="1">N</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>IB</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABIB</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>KJA S7 MOW*S7 LED46.44S7 MOW46.44*S7 LED149.31S7 X/MOW S7 MAD178.08NUC420.27END ROE0.881606</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="S7" PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="KJA" ArrivalAirportCode="DME" ArrivalCityCode="MOW" CityCode="KJA" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="QFLMOW" FareAmount="149.31" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="FE" Market="KJALED" TripTypeInd="O"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="S7" PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="DME" ArrivalAirportCode="LED" ArrivalCityCode="LED" CityCode="MOW" GenericInd="O" SideTripIndicator="*"/>
            <FareBasis Cabin="Y" Code="OFLRT" FareAmount="46.44" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="MOWLED" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="S7" PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="LED" ArrivalAirportCode="DME" ArrivalCityCode="MOW" CityCode="LED" GenericInd="O" SideTripIndicator="*"/>
            <FareBasis Cabin="Y" Code="OFLRT" FareAmount="46.44" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="MOWLED" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="S7" PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="DME" ArrivalAirportCode="LED" ArrivalCityCode="LED" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="QFLMOW" FareAmount="149.31" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="FE" Market="KJALED" TripTypeInd="O"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="LED" ArrivalAirportCode="DME" ArrivalCityCode="MOW" CityCode="LED" GenericInd="X"/>
            <FareBasis Code="NFLMOW" FilingCarrier="S7"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="S7" PCC="9LSC"/>
            <Departure AirlineCode="S7" AirportCode="DME" ArrivalAirportCode="MAD" ArrivalCityCode="MAD" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="NFLMOW" FareAmount="178.08" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="LEDMAD" TripTypeInd="O"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -KJALED-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-KJALED-RUB4000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
                <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -LEDDME-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-LEDDME-RUB2000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
                <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -DMELED-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-DMELED-RUB2000/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
                <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -LEDMAD-01P/S7/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND MAX LENGTH UP TO 79 INCHES/200 CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-LEDMAD-RUB3550/S7/UP TO 70 POUNDS/32 KILOGRA</Text>
                <Text>MS AND UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>KJADME DMELED LEDDME DMELED LEDDME-01P/10KG/S7</Text>
                <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND UP TO 45 LINEAR INCHES/115</Text>
                <Text>LINEAR CENTIMETERS</Text>
                <Text>DMEMAD-01P/IB</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>KJADME DMELED LEDDME DMELED LEDDME-S7-CARRY ON FEES UNKNOWN-CON</Text>
                <Text>TACT CARRIER</Text>
                <Text>DMEMAD-IB-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="371.00" CurrencyCode="EUR"/>
            <Endorsements>
              <Text>S7 ONLY/REF/CHNG/RESTR</Text>
            </Endorsements>
            <EquivFare Amount="26345" CurrencyCode="RUB"/>
            <Taxes TotalAmount="6875">
              <Tax Amount="2310" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
              <Tax Amount="4565" TaxCode="YRF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YR"/>
            </Taxes>
            <TotalFare Amount="33220" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="QFLMOW" FareAmount="149.31" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="FE" Market="KJALED"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="OFLRT" FareAmount="46.44" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="MOWLED"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="OFLRT" FareAmount="46.44" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="MOWLED"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="QFLMOW" FareAmount="149.31" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="FE" Market="KJALED"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <FareBasis Code="NFLMOW" FilingCarrier="S7"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="NFLMOW" FareAmount="178.08" FarePassengerType="ADT" FareType="P" FilingCarrier="S7" GlobalInd="EH" Market="LEDMAD"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
  <TravelItineraryReadRS>
    <TravelItinerary>
      <CustomerInfo/>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>9LSC 9LSC*AWS 1706/18JUL16</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAS7P1ADTRQ" RPH="1" StatusCode="A" TaxExempt="false" ValidatingCarrier="S7">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="371.00" CurrencyCode="EUR"/>
                  <EquivFare Amount="26345" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="6875" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2310YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4565YR</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="33220" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="371.00"/>
                    <EquivFare Amount="26345"/>
                    <Taxes>
                      <Tax Amount="6875"/>
                    </Taxes>
                    <TotalFare Amount="33220"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>S7 ONLY/REF/CHNG/RESTR</Text>
                    </Endorsement>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAS7$P1ADT$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - S7</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="QFLMOW/OFLRT/OFLRT/QFLMOW/NFLMOW/NFLMOW"/>
                  <FareCalculation>
                    <Text>KJA S7 MOW*S7 LED46.44S7 MOW46.44*S7 LED149.31S7 X/MOW S7 MAD178.08NUC420.27END ROE0.881606</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-13T19:50" FlightNumber="74" ResBookDesigCode="Q" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="QFLMOW"/>
                    <MarketingAirline Code="S7" FlightNumber="74"/>
                    <OriginLocation LocationCode="KJA"/>
                    <ValidityDates>
                      <NotValidAfter>2017-09-13</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-14T01:05" FlightNumber="37" ResBookDesigCode="O" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="OFLRT"/>
                    <MarketingAirline Code="S7" FlightNumber="37"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2017-07-06</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-15T22:55" FlightNumber="42" ResBookDesigCode="O" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="OFLRT"/>
                    <MarketingAirline Code="S7" FlightNumber="42"/>
                    <OriginLocation LocationCode="LED"/>
                    <ValidityDates>
                      <NotValidAfter>2017-07-06</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-17T06:00" FlightNumber="19" ResBookDesigCode="Q" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="QFLMOW"/>
                    <MarketingAirline Code="S7" FlightNumber="19"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2017-09-13</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-20T22:55" FlightNumber="42" ResBookDesigCode="N" SegmentNumber="5" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="NFLMOW"/>
                    <MarketingAirline Code="S7" FlightNumber="42"/>
                    <OriginLocation LocationCode="LED"/>
                    <ValidityDates>
                      <NotValidAfter>2017-09-13</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="09-21T06:15" FlightNumber="4063" ResBookDesigCode="N" SegmentNumber="6" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="NFLMOW"/>
                    <MarketingAirline Code="S7" FlightNumber="4063"/>
                    <OriginLocation LocationCode="DME"/>
                    <ValidityDates>
                      <NotValidAfter>2017-09-13</NotValidAfter>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="MAD"/>
                  </FlightSegment>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 21JUL/1706</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 21JUL</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="371.00"/>
            <EquivFare Amount="26345.00"/>
            <Taxes>
              <Tax Amount="6875.00"/>
            </Taxes>
            <TotalFare Amount="33220.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="2091" ArrivalDateTime="09-13T20:45" DayOfWeekInd="2" DepartureDateTime="2016-09-13T19:50" ElapsedTime="04.55" FlightNumber="0074" IsPast="false" NumberInParty="01" ResBookDesigCode="Q" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="DME"/>
              <Equipment AirEquipType="738"/>
              <MarketingAirline Code="S7" FlightNumber="0074"/>
              <Meal Code="L"/>
              <OperatingAirline Code="S7" CompanyShortName="S7 AIRLINES" FlightNumber="0074"/>
              <OriginLocation LocationCode="KJA" Terminal="TERMINAL 1" TerminalCode="1"/>
              <Text>OPERATED BY S7 AIRLINES</Text>
              <UpdatedArrivalTime>09-13T20:45</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-13T19:50</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0414" ArrivalDateTime="09-14T02:40" DayOfWeekInd="3" DepartureDateTime="2016-09-14T01:05" ElapsedTime="01.35" FlightNumber="0037" IsPast="false" NumberInParty="01" ResBookDesigCode="O" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LED" Terminal="PULKOVO 1" TerminalCode="1"/>
              <Equipment AirEquipType="319"/>
              <MarketingAirline Code="S7" FlightNumber="0037"/>
              <Meal Code="S"/>
              <OriginLocation LocationCode="DME"/>
              <UpdatedArrivalTime>09-14T02:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-14T01:05</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="0414" ArrivalDateTime="09-16T00:25" DayOfWeekInd="4" DepartureDateTime="2016-09-15T22:55" ElapsedTime="01.30" FlightNumber="0042" IsPast="false" NumberInParty="01" ResBookDesigCode="O" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="DME"/>
              <Equipment AirEquipType="319"/>
              <MarketingAirline Code="S7" FlightNumber="0042"/>
              <Meal Code="S"/>
              <OriginLocation LocationCode="LED" Terminal="PULKOVO 1" TerminalCode="1"/>
              <UpdatedArrivalTime>09-16T00:25</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-15T22:55</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="0414" ArrivalDateTime="09-17T07:35" DayOfWeekInd="6" DepartureDateTime="2016-09-17T06:00" ElapsedTime="01.35" FlightNumber="0019" IsPast="false" NumberInParty="01" ResBookDesigCode="Q" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LED" Terminal="PULKOVO 1" TerminalCode="1"/>
              <Equipment AirEquipType="319"/>
              <MarketingAirline Code="S7" FlightNumber="0019"/>
              <Meal Code="S"/>
              <OriginLocation LocationCode="DME"/>
              <UpdatedArrivalTime>09-17T07:35</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-17T06:00</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="5">
            <FlightSegment AirMilesFlown="0414" ArrivalDateTime="09-21T00:25" DayOfWeekInd="2" DepartureDateTime="2016-09-20T22:55" ElapsedTime="01.30" FlightNumber="0042" IsPast="false" NumberInParty="01" ResBookDesigCode="N" SegmentNumber="0005" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="DME"/>
              <Equipment AirEquipType="319"/>
              <MarketingAirline Code="S7" FlightNumber="0042"/>
              <Meal Code="S"/>
              <OriginLocation LocationCode="LED" Terminal="PULKOVO 1" TerminalCode="1"/>
              <UpdatedArrivalTime>09-21T00:25</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-20T22:55</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
          <Item RPH="6">
            <FlightSegment AirMilesFlown="2140" ArrivalDateTime="09-21T10:30" DayOfWeekInd="3" DepartureDateTime="2016-09-21T06:15" ElapsedTime="05.15" FlightNumber="4063" IsPast="false" NumberInParty="01" ResBookDesigCode="N" SegmentNumber="0006" SmokingAllowed="false" SpecialMeal="false" Status="QF" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="MAD" Terminal="TERMINAL 4S" TerminalCode="4S"/>
              <Equipment AirEquipType="319"/>
              <MarketingAirline Code="S7" FlightNumber="4063"/>
              <Meal Code="B"/>
              <OperatingAirline Code="IB" CompanyShortName="IBERIA" FlightNumber="4063"/>
              <OriginLocation LocationCode="DME"/>
              <Text>OPERATED BY IBERIA</Text>
              <UpdatedArrivalTime>09-21T10:30</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-21T06:15</UpdatedDepartureTime>
            </FlightSegment>
          </Item>
        </ReservationItems>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Source PseudoCityCode="9LSC"/>
      </ItineraryRef>
    </TravelItinerary>
  </TravelItineraryReadRS>
</EnhancedAirBookRS>
{% endxmlsec %}

** Получение правил тарифа (RulesFromPriceLLSRQ) **

Для каждого забронированного сегмента необходимо запросить правила тарифа при помощи сервиса [RulesFromPriceLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/fare_rules_from_air_price/resources) (см. [Алгоритм получения текста правил тарифа для текущего бронирования (RulesFromPriceLLSRQ)](#RulesFromPriceLLSRQ)).

{% xmlsec "Пример запроса" %}
<RulesFromPriceRQ ReturnHostCommand="true" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <RuleReqInfo>
    <Category>16</Category>
    <SegmentSelect Number="1"/>
  </RuleReqInfo>
</RulesFromPriceRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<RulesFromPriceRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2016-07-18T09:07:25-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPRD*S1¥C16</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <FareRuleInfo>
    <Header>
      <Line Type="Legend">
        <Text>V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG</Text>
      </Line>
      <Line Type="Fare">
        <Text>1   QFLMOW         Q O     9645     ----      -/  -/300   14</Text>
      </Line>
      <Line Type="Passenger Type">
        <Text>PASSENGER TYPE-ADT                 AUTO PRICE-YES</Text>
      </Line>
      <Line Type="Origin Destination">
        <Text>FROM-KJA TO-LED    CXR-S7    TVL-13SEP16  RULE-SFLT IPRFE/327</Text>
      </Line>
      <Line Type="Fare Basis">
        <Text>FARE BASIS-QFLMOW            SPECIAL FARE  DIS-E   VENDOR-ATP</Text>
      </Line>
      <Line Type="Fare Type">
        <Text>FARE TYPE-XEF      OW-4TH LEVEL EXCURSION FARE</Text>
      </Line>
      <Line Type="Currency">
        <Text>RUB     9645  0014  E09JUN16 D-INFINITY   FC-QFLMOW  FN-</Text>
      </Line>
      <Line Type="System Dates">
        <Text>SYSTEM DATES - CREATED 08JUN16/0922  EXPIRES INFINITY</Text>
      </Line>
      <ParsedData>
        <CurrencyLine>
          <Amount>9645</Amount>
          <CurrencyCode>RUB</CurrencyCode>
          <Discontinue>INFINITY</Discontinue>
          <Effective>2016-06-09</Effective>
          <FareClass>QFLMOW</FareClass>
          <RoutingNumberOrMPM>0014</RoutingNumberOrMPM>
        </CurrencyLine>
        <FareBasisLine>
          <DisplayType Code="E"/>
          <FareBasis Code="QFLMOW"/>
          <FareVendor>ATP</FareVendor>
          <Text>SPECIAL FARE</Text>
        </FareBasisLine>
        <FareTypeLine>
          <FareDescription Code="OW">4TH LEVEL EXCURSION FARE</FareDescription>
          <FareType>XEF</FareType>
        </FareTypeLine>
        <OriginDestinationLine>
          <Airline Code="S7"/>
          <DestinationLocation LocationCode="LED"/>
          <OriginLocation LocationCode="KJA"/>
          <Rule>SFLT</Rule>
          <TariffDescriptionNumber>IPRFE/327</TariffDescriptionNumber>
          <TravelDate>2016-09-13</TravelDate>
        </OriginDestinationLine>
        <PassengerTypeLine>
          <AutoPrice>YES</AutoPrice>
          <PassengerType Code="ADT"/>
        </PassengerTypeLine>
        <SystemDatesLine>
          <CreateDateTime>2016-06-08T09:22</CreateDateTime>
          <ExpireDateTime>INFINITY</ExpireDateTime>
        </SystemDatesLine>
      </ParsedData>
    </Header>
    <Rules>
      <Paragraph RPH="16" Title="PENALTIES">
        <Text>CANCELLATIONS
        BEFORE DEPARTURE
        PER COUPON CHARGE RUB 1000 FOR REFUND.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH REFUNDED SEGMENT
        AND ALWAYS CONVERTED INTO THE LOCAL CURRENCY
        USING ACTUAL SYSTEM EXCHANGE RATE ON THE DATE OF
        REFUND.
        -SUM OF CHARGES FOR REFUND /FOR ALL SEGMENTS/
        SHOULD NOT BE MORE THAN REFUNDABLE FARE AMOUNT.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        A.IN CASE OF FULLY UNUSED TICKET - REFUND THE
        FARE PAID. CHARGE FOR REFUND IS APPLIED.
        B.IN TRANSFER POINT /ON OUTBOUND/ -
        -IN CASE OF PARTLY USED TICKET - REFUND THE
        DIFFERENCE BETWEEN THE FARE PAID AND ACTUALLY
        FLOWN OW FLEX FARE/S/ OF THE USED SEGMENT/S/
        IN THE SAME OR HIGHER LEVEL RBD IN EFFECT ON
        THE DATE OF DEPARTURE AND THE DATE OF ORIGINAL
        TICKET ISSUE.
        -CHARGE FOR REFUND IS APPLIED.
        C.IN TURNAROUND POINT -
        -IN CASE OF PARTLY USED TICKET - REFUND THE
        DIFFERENCE BETWEEN THE FARE PAID AND ACTUALLY
        FLOWN OW TRANSFER FLEX FARE OF THE USED
        SEGMENTS IN THE SAME OR HIGHER LEVEL RBD IN
        EFFECT ON THE DATE OF DEPARTURE AND THE DATE OF
        ORIGINAL TICKET ISSUE.
        CHARGE FOR REFUND IS APPLIED.
        D.IN TRANSFER POINT /ON INBOUND/ -
        -IN CASE OF PARTLY USED TICKET - REFUND THE
        DIFFERENCE BETWEEN THE FARE PAID AND SUM OF
        ACTUALLY FLOWN OW TRANSFER FLEX FARE OF THE
        USED SEGMENTS IN THE SAME OR HIGHER LEVEL RBD
        IN EFFECT ON THE DATE OF DEPARTURE AND THE DATE
        OF ORIGINAL TICKET ISSUE AND ACTUALLY FLOWN OW
        FLEX FARE/S/ OF THE USED SEGMENT/S/ IN THE
        SAME OR HIGHER LEVEL RBD IN EFFECT ON THE DATE
        OF DEPARTURE AND THE DATE OF ORIGINAL TICKET
        ISSUE.
        -CHARGE FOR REFUND IS APPLIED.
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        REFUND CONDITIONS THE CONDITIONS FOR EACH
        SEGMENT APPLY.
        -IN ANY CASES S7 YQ COMPENSATION TAX IS NON-
        REFUNDABLE FOR ALL SEGMENTS.
        -REFUND OF UNUSED S7 YR FUEL TAX AND OTHER
        UNUSED TICKETABLE TAXES/FEES/CHARGES IS
        PERMITTED EXCEPT IN CASE OF NO-SHOW.
        AFTER DEPARTURE
        PER COUPON CHARGE RUB 5000 FOR NO-SHOW.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH NO-SHOW SEGMENT AND
        ALWAYS CONVERTED INTO THE LOCAL CURRENCY USING
        ACTUAL SYSTEM EXCHANGE RATE ON THE DATE OF
        REFUND.
        -SUM OF CHARGES FOR NO-SHOW /FOR ALL SEGMENTS/
        SHOULD NOT BE MORE THAN REFUNDABLE FARE AMOUNT.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANT WITHOUT A SEAT - WITHOUT PENALTY.
        -CHARGE FOR REFUND ON NO-SHOW SEGMENT/S/ IS NOT
        APPLIED.
        -IN ANY CASES S7 YQ COMPENSATION TAX IS
        NON-REFUNDABLE FOR ALL SEGMENTS.
        -IN CASE OF NO-SHOW REFUND OF UNUSED S7 FUEL TAX
        AND OTHER UNUSED TICKETABLE TAXES/FEES/CHARGES
        IS NOT PERMITTED ON NO-SHOW SEGMENT/S/ ONLY.
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        REFUND CONDITIONS THE CONDITIONS FOR EACH
        SEGMENT APPLY.
        -INVOLUNTARY REFUND-
        -FOR FULLY UNUSED TICKET - REFUND THE FARE PAID.
        -FOR PARTLY USED TICKET /IN TRANSFER POINT/-
        APPLY EZ 1/12/4 OR CONTACT CARRIER FOR DETAILS
        /VIA TECH-AT-S7.RU/.
        -FOR PARTIALLY USED TICKET /IN TURNAROUND POINT/
        -REFUND THE HALF OF THE FARE PAID.
        -REFUND OF ALL UNUSED TAXES/FEES/CHARGES IS
        PERMITTED.
        - IN ANY CASES -
        -REFUNDS MAY BE MADE WITHIN 1 YEAR FROM
        -DATE OF ISSUE FOR UNUSED TICKETS.
        -DATE OF DEPARTURE ON FIRST FLIGHT COUPON -
        FOR PARTLY USED TICKETS.
        CHANGES
        BEFORE DEPARTURE
        CHANGES PERMITTED FOR REISSUE/REVALIDATION.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -IN ANY CASES DOWNGRADING TO THE LOWER RBD IS
        NOT PERMITTED FOR ANY CHANGED SEGMENT.
        -IN CASE OF CHANGES OF A FULLY UNUSED TICKET -
        CURRENT FARES/TAXES/BSR ON THE DATE OF NEW
        TICKET ISSUANCE SHOULD BE APPLIED FOR ALL
        SEGMENTS.
        -IN CASE OF CHANGES OF A PARTIALLY USED TICKET -
        HISTORICAL FARES/TAXES/BSR ON THE DATE OF
        ORIGINAL TICKET ISSUANCE SHOULD BE APPLIED FOR
        ALL SEGMENTS.
        AFTER DEPARTURE
        PER COUPON CHARGE RUB 5000 FOR NO-SHOW.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH NO-SHOW SEGMENT AND
        ALWAYS CONVERTED INTO THE LOCAL CURRENCY USING
        ACTUAL SYSTEM EXCHANGE RATE ON THE DATE OF
        REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -FOR UPGRADING-
        -UPGRADING IS PERMITTED TO ANY HIGHER TRANSFER
        FARE WITHIN FLEX FARE /ECONOMY OR BUSINESS/
        FAMILY OR DIRECT FARES CONBINATION WITHIN
        FLEX FARE/ECONOMY OR BUSINESS/ FAMILY FOR THE
        CHANGED TRANSFER ROUTE /TO/FROM TURNAROUND
        POINT/.
        -CHARGE FOR THE UPGRADING FROM ECONOMY FLEX
        FARES TO BUSINESS FLEX FARES 1000 RUB PER
        EACH CHANGED SEGMENT IS APPLIED.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -PASSENGER WILL PAY THE DIFFERENCE BETWEEN THE
        ORIGINAL FARE AND THE NEW FARE OR FARE
        COMBINATION AND CHARGE FOR UPGRADING /IF
        REQUIRED/.
        -IF NEW TICKET IS SUBSEQUENTLY CANCELLED
        CANCELLATION RULES OF THE FARE SPECIFIED IN
        THE NEW TICKET WILL APPLY.
        -IN CASE OF NO-SHOW CHARGE FOR NO-SHOW 5000 RUB
        IS APPLIED PER EACH NO-SHOW SEGMENT AND ALWAYS
        CONVERTED INTO THE LOCAL CURRENCY USING ACTUAL
        SYSTEM EXCHANGE RATE ON THE DATE OF REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -CHARGE FOR THE UPGRADING FROM ECONOMY FLEX FARES
        TO BUSINESS FLEX FARES IS NOT APPLIED ON NO-SHOW
        SEGMENTS.
        -FOR TICKETS ISSUED BEFORE 01DEC15 WITH PROMO
        FARE- NON-REFUNDABLE FARE/TAX AMOUNTS MAY BE
        EXCHANGED ONLY UP TO ECONOMY FLEX FARES.
        NON-REFUNDABLE AMOUNTS OF THE EXCHANGED
        TICKET REMAIN NON-REFUNDABLE. FURTHER UPGRADE
        TO BUSINESS FARE IS NOT PERMITTED.
        -FOR REROUTING-
        -REROUTING IS PERMITTED FREE OF CHARGE.
        -REROUTING OF DOMESTIC ITINERARY TO
        INTERNATIONAL ITINERARY IS NOT PERMITTED.
        -IN CASE OF REROUTING AND ADDING NEW SEGMENT/S/
        TO THE ITINERARY S7 YQ COMPENSATION TAX MUST BE
        COLLECTED FOR ANY NEW SEGMENT/S/ IF THE REISSUE
        IS PROCESSED IN GDS DIFFERENT FROM SITA GABRIEL
        AND SIRENA TRAVEL.
        -IN CASE OF REROUTING LOWER RBD /WITHIN FLEX
        FARE FAMILY/ MAY BE APPLIED ON SEGMENTS WITH
        NEW ITINERARY ONLY.
        -IN CASE OF NO-SHOW CHARGE FOR NO-SHOW 5000 RUB
        IS APPLIED PER EACH NO-SHOW SEGMENT AND ALWAYS
        CONVERTED INTO THE LOCAL CURRENCY USING ACTUAL
        SYSTEM EXCHANGE RATE ON THE DATE OF REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -IN ANY CASES-
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        CHANGE/UPGRADING CONDITIONS THE CONDITIONS FOR
        EACH SEGMENT APPLY.
        -S7 YQ COMPENSATION TAX SHOULD BE
        ADDITIONALLY COLLECTED FOR THE CHANGED
        SEGMENT/S/ EVERY TIME IN CASE OF CHANGES.
        -CHANGES MAY BE MADE WITHIN 1 YEAR FROM
        -DATE OF ISSUE FOR UNUSED TICKETS
        -DATE OF DEPARTURE ON FIRST FLIGHT COUPON - FOR
        PARTLY USED TICKETS.</Text>
      </Paragraph>
    </Rules>
  </FareRuleInfo>
</RulesFromPriceRS>
{% endxmlsec %}

** Игнорирование бронирования (IgnoreTransactionLLSRQ) **

После того, как правила тарифа были запрошены для всех сегментов, необходимо игнорировать созданное бронирование при помощи сервиса [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction/resources).

{% xmlsec "Пример запроса" %}
<IgnoreTransactionRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ReturnHostCommand="true" Version="2.0.0"/>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<IgnoreTransactionRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2016-07-18T09:08:05-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="38D9F3">I</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</IgnoreTransactionRS>
{% endxmlsec %}

<a name="OTA_AirRulesLLSRQ"></a>

## Получение текста правил тарифа (OTA_AirRulesLLSRQ)

Для получения текста правил (условий применения) тарифа без необходимости создания бронирования используется сервис [OTA_AirRulesLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/air_fare_rules/resources).

Обязательными параметрами запроса являются:
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/OriginLocation/@LocationCode``` — аэропорт отправления
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/DestinationLocation/@LocationCode``` — аэропорт прибытия

**Обратите внимание на то, что в качестве аэропорта отправления и прибытия необходимо указать не аэропорт отправления или прибытия для определенного сегмента, а аэропорт отправления или прибытия, для которых перевозчиком был зафайлирован тариф. См. выше рекомендации о получении этих данных.**

- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/@DepartureDateTime``` — дата вылета
- ```/OTA_AirRulesRQ/RuleReqInfo/FareBasis/@Code``` — код тарифа
- ```/OTA_AirRulesRQ/OriginDestinationInformation/FlightSegment/MarketingCarrier/@Code``` — код маркетингового перевозчика

Для получения правил приватного тарифа также может потребоваться указание Account Code (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Account/Code```) или Corporate ID (```/OTA_AirRulesRQ/OptionalQualifiers/PricingQualifiers/Corporate/ID```).

{% xmlsec "Пример запроса" %}
<OTA_AirRulesRQ ReturnHostCommand="true" Version="2.2.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <OriginDestinationInformation>
    <FlightSegment DepartureDateTime="04-15">
      <DestinationLocation LocationCode="MOW"/>
      <MarketingCarrier Code="SU"/>
      <OriginLocation LocationCode="LON"/>
    </FlightSegment>
  </OriginDestinationInformation>
  <RuleReqInfo>
    <FareBasis Code="YNRT"/>
  </RuleReqInfo>
</OTA_AirRulesRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<OTA_AirRulesRS Version="2.2.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2016-01-31T09:05:04-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">RDLONMOW15APRYNRT-SU</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <FareRuleInfo>
    <Header>
      <Line Type="Legend">
        <Text>V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG</Text>
      </Line>
      <Line Type="Fare">
        <Text>1   YNRT           Y R   110890     ----      -    -/365 EH01</Text>
      </Line>
      <Line Type="Passenger Type">
        <Text>PASSENGER TYPE-ADT                 AUTO PRICE-YES</Text>
      </Line>
      <Line Type="Origin Destination">
        <Text>FROM-LON TO-MOW    CXR-SU    TVL-15APR16  RULE-NM02 IPREURP/21</Text>
      </Line>
      <Line Type="Fare Basis">
        <Text>FARE BASIS-YNRT              NORMAL FARE  DIS-N   VENDOR-ATP</Text>
      </Line>
      <Line Type="Fare Type">
        <Text>FARE TYPE-EU      RT-ECONOMY UNRESTRICTED</Text>
      </Line>
      <Line Type="Currency">
        <Text>GBP   999.00  0015  E01DEC15 D-INFINITY   FC-YNRT  FN-</Text>
      </Line>
      <Line Type="System Dates">
        <Text>SYSTEM DATES - CREATED 30NOV15/0319  EXPIRES INFINITY</Text>
      </Line>
      <ParsedData>
        <CurrencyLine>
          <Amount>999.00</Amount>
          <CurrencyCode>GBP</CurrencyCode>
          <Discontinue>INFINITY</Discontinue>
          <Effective>2015-12-01</Effective>
          <FareClass>YNRT</FareClass>
          <RoutingNumberOrMPM>0015</RoutingNumberOrMPM>
        </CurrencyLine>
        <FareBasisLine>
          <DisplayType Code="N"/>
          <FareBasis Code="YNRT"/>
          <FareVendor>ATP</FareVendor>
          <Text>NORMAL FARE</Text>
        </FareBasisLine>
        <FareTypeLine>
          <FareDescription Code="RT">ECONOMY UNRESTRICTED</FareDescription>
          <FareType>EU</FareType>
        </FareTypeLine>
        <OriginDestinationLine>
          <Airline Code="SU"/>
          <DestinationLocation LocationCode="MOW"/>
          <OriginLocation LocationCode="LON"/>
          <Rule>NM02</Rule>
          <TariffDescriptionNumber>IPREURP/21</TariffDescriptionNumber>
          <TravelDate>2016-04-15</TravelDate>
        </OriginDestinationLine>
        <PassengerTypeLine>
          <AutoPrice>YES</AutoPrice>
          <PassengerType Code="ADT"/>
        </PassengerTypeLine>
        <SystemDatesLine>
          <CreateDateTime>2015-11-30T03:19</CreateDateTime>
          <ExpireDateTime>INFINITY</ExpireDateTime>
        </SystemDatesLine>
      </ParsedData>
    </Header>
    <Rules>
      <Paragraph RPH="50" Title="RULE APPLICATION AND OTHER CONDITIONS">
        <Text>NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT
        VALIDATED FOR AUTOPRICING.
        SU CARRIER PREMIUM-ECONOMY FARES
        APPLICATION
        CLASS OF SERVICE
        THESE FARES APPLY FOR ECONOMY CLASS SERVICE.
        TYPES OF TRANSPORTATION
        FARES GOVERNED BY THIS RULE CAN BE USED TO CREATE
        ONE-WAY/ROUND-TRIP/CIRCLE-TRIP/SINGLE OPEN-JAW/
        DOUBLE OPEN-JAW JOURNEYS.
        CAPACITY LIMITATIONS
        THE CARRIER SHALL LIMIT THE NUMBER OF PASSENGERS
        CARRIED ON ANY ONE FLIGHT AT FARES GOVERNED BY
        THIS RULE AND SUCH FARES WILL NOT NECESSARILY BE
        AVAILABLE ON ALL FLIGHTS. THE NUMBER OF SEATS,
        WHICH THE CARRIER SHALL MAKE AVAILABLE ON A GIVEN
        FLIGHT, WILL BE DETERMINED BY THE CARRIER'S BEST
        JUDGEMENT.</Text>
      </Paragraph>
      <!-- другие категории -->
    </Rules>
  </FareRuleInfo>
</OTA_AirRulesRS>
{% endxmlsec %}

<a name="RulesFromPriceLLSRQ"></a>

## Алгоритм получения текста правил тарифа для текущего бронирования (RulesFromPriceLLSRQ)

Для того, чтобы получить текст правил для существующего бронирования или вновь созданного необходимо:

- Создать бронирование или открыть его при помощи сервиса [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary/resources).
- Выполнить расчет стоимости бронирования при помощи сервиса [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary/resources) или [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking/resources).
- Отправить запрос к сервису [RulesFromPriceLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/fare_rules_from_air_price/resources) для получения текста правил тарифа для каждого сегмента.

В запросе необходимо указать номер сегмента в качестве значения атрибута ```/RulesFromPriceRQ/RuleReqInfo/SegmentSelect/@Number```.

В случае необходимости показать только определенные категории правил тарифа, их можно указать в качестве значений элементов ```/RulesFromPriceRQ/RuleReqInfo/Category```.

{% xmlsec "Пример запроса" %}
<RulesFromPriceRQ ReturnHostCommand="true" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <RuleReqInfo>
    <Category>16</Category>
    <SegmentSelect Number="1"/>
  </RuleReqInfo>
</RulesFromPriceRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<RulesFromPriceRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2016-07-17T16:23:43-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPRD*S1¥C16</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <FareRuleInfo>
    <Header>
      <Line Type="Legend">
        <Text>V FARE BASIS     BK    FARE   TRAVEL-TICKET AP  MINMAX  RTG</Text>
      </Line>
      <Line Type="Fare">
        <Text>1   QFLRT          Q R     7000 E01SE         -/  -/300    1</Text>
      </Line>
      <Line Type="Passenger Type">
        <Text>PASSENGER TYPE-ADT                 AUTO PRICE-YES</Text>
      </Line>
      <Line Type="Origin Destination">
        <Text>FROM-MOW TO-LED    CXR-S7    TVL-17SEP16  RULE-SFLX IPREURD/304</Text>
      </Line>
      <Line Type="Fare Basis">
        <Text>FARE BASIS-QFLRT             SPECIAL FARE  DIS-E   VENDOR-ATP</Text>
      </Line>
      <Line Type="Fare Type">
        <Text>FARE TYPE-XEX      RT-REGULAR EXCURSION</Text>
      </Line>
      <Line Type="Currency">
        <Text>RUB     7000  0001  E01SEP16 D-INFINITY   FC-QFLRT  FN-N</Text>
      </Line>
      <Line Type="System Dates">
        <Text>SYSTEM DATES - CREATED 17MAR16/0517  EXPIRES INFINITY</Text>
      </Line>
      <ParsedData>
        <CurrencyLine>
          <Amount>7000</Amount>
          <CurrencyCode>RUB</CurrencyCode>
          <Discontinue>INFINITY</Discontinue>
          <Effective>2016-09-01</Effective>
          <FareClass>QFLRT</FareClass>
          <RoutingNumberOrMPM>0001</RoutingNumberOrMPM>
          <TariffDescriptionNumber>N</TariffDescriptionNumber>
        </CurrencyLine>
        <FareBasisLine>
          <DisplayType Code="E"/>
          <FareBasis Code="QFLRT"/>
          <FareVendor>ATP</FareVendor>
          <Text>SPECIAL FARE</Text>
        </FareBasisLine>
        <FareTypeLine>
          <FareDescription Code="RT">REGULAR EXCURSION</FareDescription>
          <FareType>XEX</FareType>
        </FareTypeLine>
        <OriginDestinationLine>
          <Airline Code="S7"/>
          <DestinationLocation LocationCode="LED"/>
          <OriginLocation LocationCode="MOW"/>
          <Rule>SFLX</Rule>
          <TariffDescriptionNumber>IPREURD/304</TariffDescriptionNumber>
          <TravelDate>2016-09-17</TravelDate>
        </OriginDestinationLine>
        <PassengerTypeLine>
          <AutoPrice>YES</AutoPrice>
          <PassengerType Code="ADT"/>
        </PassengerTypeLine>
        <SystemDatesLine>
          <CreateDateTime>2016-03-17T05:17</CreateDateTime>
          <ExpireDateTime>INFINITY</ExpireDateTime>
        </SystemDatesLine>
      </ParsedData>
    </Header>
    <Rules>
      <Paragraph RPH="16" Title="PENALTIES">
        <Text>CANCELLATIONS
        BEFORE DEPARTURE
        PER COUPON CHARGE RUB 1000 FOR REFUND.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH REFUNDED SEGMENT AND
        ALWAYS CONVERTED INTO THE LOCAL CURRENCY USING
        ACTUAL SYSTEM EXCHANGE RATE ON THE DATE OF
        REFUND.
        -SUM OF CHARGES FOR REFUND /FOR ALL SEGMENTS/
        SHOULD NOT BE MORE THAN REFUNDABLE FARE AMOUNT.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -IN CASE OF FULLY UNUSED TICKET - REFUND THE
        FARE PAID.
        CHARGE FOR REFUND IS APPLIED.
        -IN CASE OF PARTLY USED TICKET - REFUND THE
        DIFFERENCE BETWEEN THE FARE PAID AND ACTUALLY
        FLOWN FLEX OW FARE IN THE SAME OR HIGHER
        LEVEL RBD IN EFFECT ON THE DATE OF DEPARTURE
        AND THE DATE OF ORIGINAL TICKET ISSUE.
        CHARGE FOR REFUND IS APPLIED.
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        REFUND CONDITIONS THE CONDITIONS FOR EACH
        SEGMENT APPLY.
        -IN ANY CASES S7 YQ COMPENSATION TAX IS NON-
        REFUNDABLE FOR ALL SEGMENTS.
        -REFUND OF UNUSED S7 YR FUEL TAX AND OTHER
        UNUSED TICKETABLE TAXES/FEES/CHARGES IS
        PERMITTED EXCEPT IN CASE OF NO-SHOW.
        AFTER DEPARTURE
        PER COUPON CHARGE RUB 5000 FOR NO-SHOW.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH NO-SHOW SEGMENT
        AND ALWAYS CONVERTED INTO THE LOCAL CURRENCY
        USING ACTUAL SYSTEM EXCHANGE RATE ON THE
        DATE OF REFUND.
        -SUM OF CHARGES FOR NO-SHOW /FOR ALL SEGMENTS/
        SHOULD NOT BE MORE THAN REFUNDABLE FARE AMOUNT.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANT WITHOUT A SEAT - WITHOUT PENALTY.
        -CHARGE FOR REFUND ON NO-SHOW SEGMENT/S/ IS NOT
        APPLIED.
        -IN ANY CASES S7 YQ COMPENSATION TAX IS NON-
        REFUNDABLE FOR ALL SEGMENTS.
        -IN CASE OF NO-SHOW REFUND OF UNUSED S7 FUEL TAX
        AND OTHER UNUSED TICKETABLE TAXES/FEES/CHARGES
        IS NOT PERMITTED ON NO-SHOW SEGMENT/S/ ONLY.
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        REFUND CONDITIONS THE CONDITIONS FOR EACH
        SEGMENT APPLY.
        -INVOLUNTARY REFUND-
        -FOR FULLY UNUSED TICKET - REFUND THE FARE PAID.
        -FOR PARTIALLY USED TICKET - REFUND THE
        APPLICABLE FARE ON THE REFUNDABLE SEGMENT /ONE
        WAY OR ONE HALF RT/ IT DEPENDS ON FARE
        CONSTRUCTION/.
        -REFUND OF ALL UNUSED TAXES/FFES/CHARGES IS
        PERMITTED.
        -IN ANY CASES-
        -REFUNDS MAY BE MADE WITHIN 1 YEAR FROM
        -DATE OF ISSUE FOR UNUSED TICKETS.
        -DATE OF DEPARTURE ON FIRST FLIGHT COUPON - FOR
        PARTLY USED TICKETS.
        CHANGES
        BEFORE DEPARTURE
        CHANGES PERMITTED FOR REISSUE/REVALIDATION.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -IN ANY CASES DOWNGRADING TO THE LOWER RBD IS
        NOT PERMITTED FOR ANY CHANGED SEGMENT.
        -IN CASE OF CHANGES OF A FULLY UNUSED TICKET -
        CURRENT FARES/TAXES/BSR ON THE DATE OF NEW
        TICKET ISSUANCE SHOULD BE APPLIED FOR ALL
        SEGMENTS.
        -IN CASE OF CHANGES OF A PARTIALLY USED TICKET -
        HISTORICAL FARES/TAXES/BSR ON THE DATE OF
        ORIGINAL TICKET ISSUANCE SHOULD BE APPLIED FOR
        ALL SEGMENTS.
        AFTER DEPARTURE
        PER COUPON CHARGE RUB 5000 FOR NO-SHOW.
        NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.
        -CHARGE IS APPLIED PER EACH NO-SHOW SEGMENT AND
        ALWAYS CONVERTED INTO THE LOCAL CURRENCY USING
        ACTUAL SYSTEM EXCHANGE RATE ON THE DATE OF
        REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -FOR UPGRADING-
        -UPGRADING IS PERMITTED TO ANY HIGHER FARE
        WITHIN FLEX FARE /ECONOMY OR BUSINESS/ FAMILY
        FOR THE CHANGED SEGMENT.
        -CHARGE FOR THE UPGRADING FROM ECONOMY FLEX FARES
        TO BUSINESS FLEX FARES 1000 RUB PER EACH CHANGED
        SEGMENT IS APPLIED.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -PASSENGER WILL PAY THE DIFFERENCE BETWEEN THE
        ORIGINAL FARE AND THE NEW FARE OR FARE
        COMBINATION AND CHARGE FOR UPGRADING /IF
        REQUIRED/.
        -IF NEW TICKET IS SUBSEQUENTLY CANCELLED
        CANCELLATION RULES OF THE FARE SPECIFIED IN THE
        NEW TICKET WILL APPLY.
        -IN CASE OF NO-SHOW CHARGE FOR NO-SHOW 5000 RUB
        IS APPLIED PER EACH NO-SHOW SEGMENT AND ALWAYS
        CONVERTED INTO THE LOCAL CURRENCY USING ACTUAL
        SYSTEM EXCHANGE RATE ON THE DATE OF REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -CHARGE FOR THE UPGRADING FROM ECONOMY FLEX FARES
        TO BUSINESS FLEX FARES IS NOT APPLIED ON NO-SHOW
        SEGMENTS.
        -FOR TICKETS ISSUED ON/BEFORE 01DEC15 WITH PROMO
        FARE- NON-REFUNDABLE FARE/TAX AMOUNTS MAY BE
        EXCHANGED ONLY UP TO ECONOMY FLEX FARES. NON-
        REFUNDABLE AMOUNTS OF THE EXCHANGED TICKET
        REMAIN NON-REFUNDABLE. FURTHER UPGRADE TO
        BUSINESS FARE IS NOT PERMITTED.
        -FOR REROUTING-
        -REROUTING IS PERMITTED FREE OF CHARGE.
        -REROUTING OF DOMESTIC ITINERARY TO
        INTERNATIONAL ITINERARY IS NOT PERMITTED.
        -IN CASE OF REROUTING AND ADDING NEW SEGMENT/S/
        TO THE ITINERARY S7 YQ COMPENSATION TAX MUST BE
        COLLECTED FOR ANY NEW SEGMENT/S/ IF THE REISSUE
        IS PROCESSED IN GDS DIFFERENT FROM SITA GABRIEL
        AND SIRENA TRAVEL.
        -IN CASE OF REROUTING LOWER RBD /WITHIN FLEX
        FARE FAMILY/ MAY BE APPLIED ON SEGMENTS WITH
        NEW ITINERARY ONLY.
        -IN CASE OF NO-SHOW CHARGE FOR NO-SHOW 5000 RUB
        IS APPLIED PER EACH NO-SHOW SEGMENT AND ALWAYS
        CONVERTED INTO THE LOCAL CURRENCY USING ACTUAL
        SYSTEM EXCHANGE RATE ON THE DATE OF REISSUE.
        CHILDREN DISCOUNTS ARE NOT APPLIED.
        INFANTS WITHOUT A SEAT - WITHOUT CHARGE.
        -IN ANY CASES-
        -IN CASE OF FARES COMBINATION WITH DIFFERENT
        CHANGE/UPGRADING CONDITIONS THE CONDITIONS FOR
        EACH SEGMENT APPLY.
        -S7 YQ COMPENSATION TAX SHOULD BE
        ADDITIONALLY COLLECTED FOR THE CHANGED
        SEGMENT/S/ EVERY TIME IN CASE OF CHANGES.
        -CHANGES MAY BE MADE WITHIN 1 YEAR FROM
        -DATE OF ISSUE FOR UNUSED TICKETS
        -DATE OF DEPARTURE ON FIRST FLIGHT COUPON - FOR
        PARTLY USED TICKETS.</Text>
      </Paragraph>
    </Rules>
  </FareRuleInfo>
</RulesFromPriceRS>
{% endxmlsec %}

## Получение структурированных правил тарифа (StructureFareRulesRQ)

Сервис [StructureFareRulesRQ](https://developer.sabre.com/docs/soap_apis/air/utility/get_structured_fare_rules/resources) позволяет вывести информацию из правил тарифа в структурированном виде:
- признак возможности обмена или возврата авиабилета
- размер штрафа за обмен и возврат
- ограничения по бронированию и оформлению билетов
- другая информация

В запросе к сервису необходимо указать информацию о всех сегментах в бронировании, за исключением тех, что относятся к вспомогательным маршрутам (Side Trips). В случае наличия Side Trip в бронировании необходимо отправить два запроса к сервису:
1. запрос с указанием всех сегментов, кроме тех, что относятся к Side Trip
2. запрос с указанием сегментов, относящихся к Side Trip

В случае наличия нескольких Side Trips, необходимо отправлять отдельные запросы для каждого вспомогательного маршрута.

Ниже представлены алгоритмы получения данных для отправки запросов к сервису по данным из:
- стандартного ответа BFM (OTA Response)
- группированного ответа BFM (Grouped Itinerary Response (GIR))
- существующего бронирования

Для упрощения понимания алгоритма, его выполнение проиллюстрировано примером. В качестве примера используется следующий вариант перелета, предложенный в ответе сервиса BFM:

| № Плеча | № Сегмента | Откуда | Куда | Дата и время отправления | Дата и время прибытия | Номер рейса | Класс бронирования |
|---------|------------|--------|------|--------------------------|-----------------------|-------------|--------------------|
| 1 | 1 | KJA | DME | 2016-10-13T19:50 | 2016-10-13T20:45 | S7 74   | Q |
| 1 | 2 | DME | LED | 2016-10-14T01:05 | 2016-10-14T02:40 | S7 37   | O |
| 2 | 3 | LED | DME | 2016-10-15T22:55 | 2016-10-16T00:25 | S7 42   | O |
| 3 | 4 | DME | LED | 2016-10-17T06:00 | 2016-10-17T07:35 | S7 19   | Q |
| 4 | 5 | LED | DME | 2016-10-20T22:55 | 2016-10-21T00:25 | S7 42   | N |
| 4 | 6 | DME | MAD | 2016-10-21T06:15 | 2016-10-21T10:30 | S7 4063 | N |

### Стандартный ответ BFM (OTA Response)

               <OriginDestinationOption>
                  <FlightSegment ArrivalDate="2016-10-14T02:40:00" BookingDate="2016-10-01T00:00:00" DepartureDate="2016-10-14T01:05:00" FlightNumber="37" RealReservationStatus="QF" ResBookDesigCode="O" SegmentNumber="01" SegmentType="A">
                     <DepartureAirport LocationCode="DME"/>
                     <ArrivalAirport LocationCode="LED"/>
                     <MarketingAirline Code="S7"/>
                  </FlightSegment>
                  <PaxTypeInformation FareBasisCode="OFLRT" FareComponentNumber="1" PassengerType="ADT"/>
               </OriginDestinationOption>

### Группированный ответ BFM (Grouped Itinerary Response (GIR))


### Существующее бронирование



Обязательными параметрами запроса являются:

- пара городов
- дата вылета
- код тарифа
- код маркетингового перевозчика

Для получения правил приватного тарифа также может потребоваться указание Account Code или Corporate ID.

{% xmlsec "Пример запроса" %}
<StructureFareRulesRQ Version="1.0.0" xmlns="http://webservices.sabre.com/sabreXML/2003/07" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <AirItinerary>
    <OriginDestinationOptions>
      <OriginDestinationOption>
        <FlightSegment DepartureDate="2016-04-15T00:00:00" SegmentType="A">
          <DepartureAirport LocationCode="MOW"/>
          <ArrivalAirport LocationCode="LON"/>
          <MarketingAirline Code="SU"/>
        </FlightSegment>
        <SegmentInformation FareBasisCode="NPX" FareComponentNumber="1"/>
      </OriginDestinationOption>
    </OriginDestinationOptions>
  </AirItinerary>
</StructureFareRulesRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа" %}
<StructureFareRulesRS Version="1.0.0" xmlns="http://webservices.sabre.com/sabreXML/2003/07" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Summary>
    <Total CurrencyCode="EUR" Price="53.00"/>
    <PurchaseSummary IATASalesCode="SITI" SalesLocation="MOW" SimultaneousResInd="false"/>
    <ValidatingCarrier Code="SU"/>
    <PrivateFare Ind="false"/>
    <Ancillaries NotGuaranteedInd="true"/>
    <PassengerDetails>
      <PassengerDetail PassengerTypeCode="ADT">
        <Endorsements>
          <Text>NONREF/HEBO3BPATEH</Text>
        </Endorsements>
        <Warnings>
          <Text>VALIDATING CARRIER - SU</Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="53.00" CurrencyCode="EUR"/>
          <EquivalentFare Amount="4480" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <AccompaniedTravelData Data="ADT 1 ADT 0 1 1 1 8 NPX RE01 21 - " RequestedData="F"/>
        <OptionNumber Value="1"/>
        <ExchangeRateOne NumberOfDecimalPlaces="13" Value="0.91840400000000"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="4225" Applicability="Before" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="4225" Applicability="After" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Applicability="Before" NonApplicable="true" Type="Refund"/>
          <Penalty Applicability="After" NonApplicable="true" Type="Refund"/>
        </PenaltiesInfo>
      </PassengerDetail>
    </PassengerDetails>
  </Summary>
</StructureFareRulesRS>
{% endxmlsec %}