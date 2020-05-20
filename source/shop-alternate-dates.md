# Поиск перелетов по гибким датам

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Для поиска перелетов по заданному маршруту с гибкими датами используется сервис Bargain Finder Max Alternate Dates ([BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad)).

Обратите внимание на то, что использование этого сервиса требует активации для каждого iPCC. Пожалуйста, обратитесь к вашему куратору в Sabre для уточнения деталей.

Схема запроса и ответа сервиса BargainFinderMax_ADRQ, а также правила составления запросов совпадают с таковыми для сервиса BargainFinderMaxRQ (см. [Поиск перелетов по заданным датам](shop.md)) за исключением перечисленных ниже особенностей.

## Тип запроса

Тип запроса указывается в качестве значения атрибута ```/OTA_AirLowFareSearchRQ/TPA_Extensions/IntelliSellTransaction/RequestType/@Name```.

Возможные варианты:
- ```AD1``` — поиск вариантов перелетов с датой вылета (или вылетов для маршрутов туда-обратно) ± 1 день (матрица лучших цен 3x3)
- ```AD3``` — поиск вариантов перелетов с датой вылета (или вылетов для маршрутов туда-обратно) ± 3 дня (матрица лучших цен 7x7)
- ```AD7``` — поиск вариантов перелетов с датой вылета (или вылетов для маршрутов туда-обратно) ± 7 дней или вариантов перелетов с гибкой датой вылета (матрица лучших цен c изменяемыми размерами)

Например, если задан перелет Москва-Париж-Москва с датой вылета из Москвы 1 июня, датой вылета из Парижа 15 июня и типом запроса ```AD1``` матрица лучших цен может выглядеть следующим образом:

|             | **31 мая** | **1 июня** | **2 июня** |
|-------------|------------|------------|------------|
| **14 июня** |      A     |      B     |      C     |
| **15 июня** |      D     |      E     |      F     |
| **16 июня** |      G     |      H     |      I     |

где каждая буква обозначает самый дешевый вариант перелета для заданной пары дат.

## Маршрут и даты перелетов

Сервис доступен только для маршрутов с перелетом в одну сторону (One Way) или туда-обратно (Round Trip).

Для типов запросов ```AD1``` и ```AD3``` дополнительных настроек не требуется.

Для типа запроса ```AD7``` для каждого заданного в запросе сегмента можно указать (возможно выбрать только один вариант):
- вертикальный или горизонтальный размер матрицы лучших цен (```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/TPA_Extensions/DateFlexibility```):
    - ```/@NbrOfDays``` — плюс/минус количество дней для поиска к текущей дате вылета
    - ```/@Plus``` — плюс количество дней для поиска к текущей дате вылета
    - ```/@Minus``` — минус количество дней для поиска к текущей дате вылета
- дни недели для вылета (```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DepartureDates/DaysRange```):
    - ```/@WeekDays``` — дни недели для вылета. Заполняется как: ```"SM_____"``` (вылет в воскресенье и понедельник), ```"_____F_"``` (вылет в пятницу), ```"SMTWTFS"``` (вылет во все дни недели)
    - ```/@FromDate``` — начало периода поиска вылетов в указанные дни недели
    - ```/@ToDate``` — окончание периода поиска вылетов в указанные дни недели
- продолжительность пребывания:
    - ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DepartureDates/LengthOfStay/@Days``` — количество дней между датами отправления для предыдущего сегмента и текущего
    - ```/OTA_AirLowFareSearchRQ/OriginDestinationInformation/DepartureDates/LengthOfStayRange/@MinDays``` и ```/@MaxDays``` — минимальное и максимальное количество дней между датами отправления для предыдущего сегмента и текущего

## Количество вариантов перелетов

Для запросов типа ```AD1``` и ```AD3``` ответ будет содержать 9 или 49 вариантов перелетов, соответственно, для маршрута туда-обратно (Round Trip), и 3 и 7 вариантов перелетов, соответственно, для маршрута в одну сторону (One Way), т.е. по одному самому дешевому варианту перелета для каждой даты.

Для запроса типа ```AD7``` по умолчанию ответ будет содержать 225 (Round Trip) или 15 (One Way) вариантов перелетов. Однако, в атрибутах элемента ```/OTA_AirLowFareSearchRQ/TravelPreferences/TPA_Extensions/NumTrips``` можно дополнительно указать требование к количеству возвращаемых вариантов перелетов:
- ```/@Number``` — общее количество вариантов перелетов в ответе
- ```/@PerDateMax``` — максимальное количество вариантов перелетов для каждой пары дат вылета (Round Trip) или даты вылета (One Way)
- ```/@PerDateMin``` — минимальное количество вариантов перелетов для каждой пары дат вылета (Round Trip) или даты вылета (One Way)

## Примеры

{% xmlsec "Пример запроса (± 3 дня)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true"/>
  <TravelerInfoSummary>
    <SeatsRequested>1</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="1"/>
    </AirTravelerAvail>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="AD3"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="49" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7550386348090628878" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00307.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27036" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="21794" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="24467" Type="DEFAULT"/>
  </Warnings>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="130">
            <FlightSegment ArrivalDateTime="2020-09-03T19:15:00" DepartureDateTime="2020-09-03T17:05:00" ElapsedTime="130" FlightNumber="457" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="DME"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="457"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="831"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="120">
            <FlightSegment ArrivalDateTime="2020-09-07T18:30:00" DepartureDateTime="2020-09-07T16:30:00" ElapsedTime="120" FlightNumber="1310" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="1310"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADMF1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="5520" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="6800" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="DME" FareComponentBeginAirport="DME" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="105" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="420" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5520" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6800" CurrencyCode="RUB"/>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="MOW U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (± 7 дней)", false %}
<OTA_AirLowFareSearchRQ ResponseType="OTA" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <DateFlexibility NbrOfDays="7"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
    <TPA_Extensions>
      <DateFlexibility NbrOfDays="7"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true"/>
  <TravelerInfoSummary>
    <SeatsRequested>1</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="1"/>
    </AirTravelerAvail>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="AD7"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirLowFareSearchRS AvailableItinCount="0" BrandedOneWayItinCount="0" DepartedItinCount="0" PricedItinCount="197" SimpleOneWayItinCount="0" SoldOutItinCount="0" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Warnings>
    <Warning Code="TRANSACTIONID" MessageClass="I" ShortText="7550423847450090355" Type="WORKERTHREAD"/>
    <Warning Code="ASEPT2LAPP00307.IDM.SGDCPROD.SABRE.COM" MessageClass="I" ShortText="27041" Type="SERVER"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="22660" Type="DRE"/>
    <Warning Code="RULEID" MessageClass="I" ShortText="22659" Type="DEFAULT"/>
  </Warnings>
  <PricedItineraries>
    <PricedItinerary SequenceNumber="1">
      <AirItinerary DirectionInd="Return">
        <OriginDestinationOptions>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="135">
            <FlightSegment ArrivalDateTime="2020-09-07T21:25:00" DepartureDateTime="2020-09-07T19:10:00" ElapsedTime="135" FlightNumber="307" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="ZIA"/>
              <ArrivalAirport LocationCode="AER"/>
              <OperatingAirline Code="U6" FlightNumber="307"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
          <OriginDestinationOption ArrivalCountry="RU" DepartureCountry="RU" ElapsedTime="120">
            <FlightSegment ArrivalDateTime="2020-09-12T18:30:00" DepartureDateTime="2020-09-12T16:30:00" ElapsedTime="120" FlightNumber="1310" ResBookDesigCode="W" StopQuantity="0">
              <DepartureAirport LocationCode="AER"/>
              <ArrivalAirport LocationCode="ZIA"/>
              <OperatingAirline Code="U6" FlightNumber="1310"/>
              <Equipment AirEquipType="320"/>
              <MarketingAirline Code="U6"/>
              <MarriageGrp>O</MarriageGrp>
              <DepartureTimeZone GMTOffset="3"/>
              <ArrivalTimeZone GMTOffset="3"/>
              <TPA_Extensions>
                <eTicket Ind="true"/>
                <Mileage Amount="840"/>
              </TPA_Extensions>
            </FlightSegment>
          </OriginDestinationOption>
        </OriginDestinationOptions>
      </AirItinerary>
      <AirItineraryPricingInfo FareReturned="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" PricingSource="ADMF1" PricingSubSource="MIP">
        <ItinTotalFare>
          <BaseFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
          <Taxes>
            <Tax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="TOTALTAX"/>
          </Taxes>
          <TotalFare Amount="6770" CurrencyCode="RUB" DecimalPlaces="0"/>
        </ItinTotalFare>
        <PTC_FareBreakdowns>
          <PTC_FareBreakdown>
            <PassengerTypeQuantity Code="ADT" Quantity="1"/>
            <FareBasisCodes>
              <FareBasisCode ArrivalAirportCode="AER" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="ZIA" FareComponentBeginAirport="ZIA" FareComponentDirectionality="FROM" FareComponentEndAirport="AER" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
              <FareBasisCode ArrivalAirportCode="ZIA" AvailabilityBreak="true" BookingCode="W" DepartureAirportCode="AER" FareComponentBeginAirport="AER" FareComponentDirectionality="TO" FareComponentEndAirport="ZIA" FareComponentFareRule="U6PR" FareComponentFareTariff="304" FareComponentFareType="XPN" FareComponentFareTypeBitmap="00" FareComponentVendorCode="ATP" GovCarrier="U6">WPRRT</FareBasisCode>
            </FareBasisCodes>
            <PassengerFare>
              <BaseFare Amount="1280" CurrencyCode="RUB"/>
              <FareConstruction Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <EquivFare Amount="1280" CurrencyCode="RUB" DecimalPlaces="0"/>
              <Taxes>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="2150" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="400" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <Tax Amount="75" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <Tax Amount="120" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI4"/>
                <TaxSummary Amount="4300" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YQF"/>
                <TaxSummary Amount="800" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="YRI"/>
                <TaxSummary Amount="390" CountryCode="RU" CurrencyCode="RUB" DecimalPlaces="0" TaxCode="RI3"/>
                <TotalTax Amount="5490" CurrencyCode="RUB" DecimalPlaces="0"/>
              </Taxes>
              <TotalFare Amount="6770" CurrencyCode="RUB"/>
              <TPA_Extensions>
                <Messages>
                  <Message AirlineCode="U6" FailCode="0" Info="NONEND" Type="N"/>
                  <Message FailCode="0" Info="VALIDATING CARRIER" Type="W"/>
                  <Message FailCode="0" Info="BSP - U6" Type="W"/>
                  <Message FailCode="0" Info="GEN - U6" Type="W"/>
                  <Message FailCode="0" Info="TCH - U6" Type="W"/>
                  <Message FailCode="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES" Type="W"/>
                </Messages>
                <BaggageInformationList>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="0"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                  <BaggageInformation AirlineCode="U6" ProvisionType="A">
                    <Segment Id="1"/>
                    <Allowance Unit="kg" Weight="10"/>
                  </BaggageInformation>
                </BaggageInformationList>
              </TPA_Extensions>
            </PassengerFare>
            <Endorsements NonRefundableIndicator="true"/>
            <TPA_Extensions>
              <FareCalcLine Info="ZIA U6 AER640U6 ZIA640RUB1280END"/>
            </TPA_Extensions>
            <FareInfos>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
              <FareInfo>
                <FareReference>W</FareReference>
                <TPA_Extensions>
                  <SeatsRemaining BelowMin="false" Number="9"/>
                  <Cabin Cabin="Y"/>
                  <Meal Code="N"/>
                </TPA_Extensions>
              </FareInfo>
            </FareInfos>
          </PTC_FareBreakdown>
        </PTC_FareBreakdowns>
        <FareInfos>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
          <FareInfo>
            <FareReference>W</FareReference>
            <TPA_Extensions>
              <SeatsRemaining BelowMin="false" Number="9"/>
              <Cabin Cabin="Y"/>
              <Meal Code="N"/>
            </TPA_Extensions>
          </FareInfo>
        </FareInfos>
        <TPA_Extensions>
          <DivideInParty Indicator="false"/>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="BSP">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="TCH">
            <Default Code="U6"/>
          </ValidatingCarrier>
          <ValidatingCarrier NewVcxProcess="true" SettlementMethod="GEN">
            <Default Code="U6"/>
          </ValidatingCarrier>
        </TPA_Extensions>
      </AirItineraryPricingInfo>
      <TicketingInfo TicketType="eTicket" ValidInterline="Yes"/>
      <TPA_Extensions>
        <ValidatingCarrier Code="U6"/>
      </TPA_Extensions>
    </PricedItinerary>
    <!--Другие варианты перелетов-->
  </PricedItineraries>
</OTA_AirLowFareSearchRS>
{% endxmlsec %}

---

{% xmlsec "Пример запроса (GIR ответ)", false %}
<OTA_AirLowFareSearchRQ ResponseType="GIR" Version="6.1.0" xmlns="http://www.opentravel.org/OTA/2003/05">
  <POS>
    <Source PseudoCityCode="9LSC">
      <RequestorID ID="1" Type="1">
        <CompanyName Code="TN"/>
      </RequestorID>
    </Source>
  </POS>
  <OriginDestinationInformation RPH="1">
    <DepartureDateTime>2020-09-01T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="MOW"/>
    <DestinationLocation LocationCode="AER"/>
    <TPA_Extensions>
      <DateFlexibility NbrOfDays="7"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <OriginDestinationInformation RPH="2">
    <DepartureDateTime>2020-09-08T11:00:00</DepartureDateTime>
    <OriginLocation LocationCode="AER"/>
    <DestinationLocation LocationCode="MOW"/>
    <TPA_Extensions>
      <DateFlexibility NbrOfDays="7"/>
    </TPA_Extensions>
  </OriginDestinationInformation>
  <TravelPreferences ValidInterlineTicket="true"/>
  <TravelerInfoSummary>
    <SeatsRequested>1</SeatsRequested>
    <AirTravelerAvail>
      <PassengerTypeQuantity Code="ADT" Quantity="1"/>
    </AirTravelerAvail>
  </TravelerInfoSummary>
  <TPA_Extensions>
    <IntelliSellTransaction>
      <RequestType Name="AD7"/>
    </IntelliSellTransaction>
  </TPA_Extensions>
</OTA_AirLowFareSearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<GroupedItineraryResponse xmlns="http://webservices.sabre.com/wsdl/sabreXML1.0.00/shopping/GroupedItineraryResponse" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="6.1.0">
  <Message Severity="Info" Type="WORKERTHREAD" Code="TRANSACTIONID" Text="7550463812662322942"/>
  <Message Severity="Info" Type="SERVER" Code="ASE002LPSPIL61F.IDM.SGDCPROD.SABRE.COM" Text="27036"/>
  <Message Severity="Info" Type="DRE" Code="RULEID" Text="22660"/>
  <Message Severity="Info" Type="DEFAULT" Code="RULEID" Text="22659"/>
  <Statistics Itineraries="197"/>
  <ScheduleDesc ID="1" Frequency="SMTWTFS" Stops="0" ETicketable="true" TotalMilesFlown="840" ElapsedTime="120">
    <Departure Airport="AER" City="AER" Country="RU" Time="16:30:00+03:00"/>
    <Arrival Airport="ZIA" City="MOW" Country="RU" Time="18:30:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="1310" Operating="U6" OperatingFlightNumber="1310">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="2" Frequency="*M*****" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="135">
    <Departure Airport="DME" City="MOW" Country="RU" Time="11:55:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="14:10:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="407" Operating="U6" OperatingFlightNumber="407">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="3" Frequency="SMTWTFS" Stops="0" ETicketable="true" TotalMilesFlown="840" ElapsedTime="135">
    <Departure Airport="ZIA" City="MOW" Country="RU" Time="19:10:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="21:25:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="307" Operating="U6" OperatingFlightNumber="307">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="4" Frequency="SMTWTFS" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="140">
    <Departure Airport="DME" City="MOW" Country="RU" Time="10:30:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="12:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="447" Operating="U6" OperatingFlightNumber="447">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="5" Frequency="*****F*" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="140">
    <Departure Airport="DME" City="MOW" Country="RU" Time="09:00:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="11:20:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="407" Operating="U6" OperatingFlightNumber="407">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="6" Frequency="SMTWTFS" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="130">
    <Departure Airport="DME" City="MOW" Country="RU" Time="17:05:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="19:15:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="457" Operating="U6" OperatingFlightNumber="457">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="7" Frequency="**TWT**" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="140">
    <Departure Airport="DME" City="MOW" Country="RU" Time="09:30:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="11:50:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="277" Operating="U6" OperatingFlightNumber="277">
      <Equipment Code="32Q" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <ScheduleDesc ID="8" Frequency="****T**" Stops="0" ETicketable="true" TotalMilesFlown="831" ElapsedTime="135">
    <Departure Airport="DME" City="MOW" Country="RU" Time="09:00:00+03:00"/>
    <Arrival Airport="AER" City="AER" Country="RU" Time="11:15:00+03:00"/>
    <Carrier Marketing="U6" MarketingFlightNumber="407" Operating="U6" OperatingFlightNumber="407">
      <Equipment Code="320" TypeForFirstLeg="N" TypeForLastLeg="N"/>
    </Carrier>
  </ScheduleDesc>
  <TaxDesc ID="1" Code="YQF" Amount="2150" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" PublishedAmount="2150" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxDesc ID="2" Code="YQF" Amount="2150" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" PublishedAmount="2150" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc ID="3" Code="RI3" Amount="75" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" PublishedAmount="75" PublishedCurrency="RUB" Station="ZIA" Country="RU"/>
  <TaxDesc ID="4" Code="YRI" Amount="400" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" PublishedAmount="400" PublishedCurrency="RUB" Station="AER"/>
  <TaxDesc ID="5" Code="YQF" Amount="2150" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" PublishedAmount="2150" PublishedCurrency="RUB" Station="DME"/>
  <TaxDesc ID="6" Code="RI4" Amount="120" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" PublishedAmount="120" PublishedCurrency="RUB" Station="DME" Country="RU"/>
  <TaxDesc ID="7" Code="RI4" Amount="120" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" PublishedAmount="120" PublishedCurrency="RUB" Station="ZIA" Country="RU"/>
  <TaxDesc ID="8" Code="RI4" Amount="75" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC ARRIVAL" PublishedAmount="75" PublishedCurrency="RUB" Station="AER" Country="RU"/>
  <TaxDesc ID="9" Code="YRI" Amount="400" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" PublishedAmount="400" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxDesc ID="10" Code="RI3" Amount="105" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" PublishedAmount="105" PublishedCurrency="RUB" Station="DME" Country="RU"/>
  <TaxDesc ID="11" Code="RI3" Amount="120" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" PublishedAmount="120" PublishedCurrency="RUB" Station="AER" Country="RU"/>
  <TaxDesc ID="12" Code="YRI" Amount="400" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" PublishedAmount="400" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc ID="1" Code="YQF" Amount="4300" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" PublishedAmount="2150" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc ID="2" Code="YQF" Amount="4300" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED FUEL" PublishedAmount="2150" PublishedCurrency="RUB" Station="DME"/>
  <TaxSummaryDesc ID="3" Code="RI3" Amount="420" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" PublishedAmount="105" PublishedCurrency="RUB" Station="DME" Country="RU"/>
  <TaxSummaryDesc ID="4" Code="YRI" Amount="800" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" PublishedAmount="400" PublishedCurrency="RUB" Station="ZIA"/>
  <TaxSummaryDesc ID="5" Code="RI3" Amount="390" Currency="RUB" Description="TERMINAL USE CHARGE DOMESTIC DEPARTURE" PublishedAmount="75" PublishedCurrency="RUB" Station="ZIA" Country="RU"/>
  <TaxSummaryDesc ID="6" Code="YRI" Amount="800" Currency="RUB" Description="SERVICE FEE - CARRIER-IMPOSED MISC" PublishedAmount="400" PublishedCurrency="RUB" Station="DME"/>
  <FareComponentDesc ID="1" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-06" NotValidAfter="2020-09-06" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="2" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-07" NotValidAfter="2020-09-07" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="3" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-02" NotValidAfter="2020-09-02" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="4" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-13" NotValidAfter="2020-09-13" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="5" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-07" NotValidAfter="2020-09-07" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="6" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-04" NotValidAfter="2020-09-04" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="7" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-02" NotValidAfter="2020-09-02" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="8" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-14" NotValidAfter="2020-09-14" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="9" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-08" NotValidAfter="2020-09-08" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="10" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-25" NotValidAfter="2020-08-25" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="11" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-02" NotValidAfter="2020-09-02" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="12" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-08" NotValidAfter="2020-09-08" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="13" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-31" NotValidAfter="2020-08-31" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="14" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-10" NotValidAfter="2020-09-10" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="15" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-07" NotValidAfter="2020-09-07" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="16" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-01" NotValidAfter="2020-09-01" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="17" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-03" NotValidAfter="2020-09-03" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="18" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-01" NotValidAfter="2020-09-01" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="19" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-09" NotValidAfter="2020-09-09" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="20" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-28" NotValidAfter="2020-08-28" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="21" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-26" NotValidAfter="2020-08-26" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="22" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-03" NotValidAfter="2020-09-03" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="23" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-05" NotValidAfter="2020-09-05" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="24" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-06" NotValidAfter="2020-09-06" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="25" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-08" NotValidAfter="2020-09-08" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="26" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-30" NotValidAfter="2020-08-30" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="27" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-05" NotValidAfter="2020-09-05" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="28" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-15" NotValidAfter="2020-09-15" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="29" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-01" NotValidAfter="2020-09-01" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="30" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-03" NotValidAfter="2020-09-03" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="31" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-12" NotValidAfter="2020-09-12" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="32" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-29" NotValidAfter="2020-08-29" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="33" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-11" NotValidAfter="2020-09-11" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="34" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-06" NotValidAfter="2020-09-06" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="35" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-09-04" NotValidAfter="2020-09-04" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <FareComponentDesc ID="36" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-04" NotValidAfter="2020-09-04" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="37" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="TO" Direction="EH" NotValidBefore="2020-09-05" NotValidAfter="2020-09-05" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment/>
  </FareComponentDesc>
  <FareComponentDesc ID="38" GoverningCarrier="U6" FareAmount="640" FareCurrency="RUB" FareBasisCode="WPRRT" FarePassengerType="ADT" PublishedFareAmount="1280" Directionality="FROM" Direction="EH" NotValidBefore="2020-08-27" NotValidAfter="2020-08-27" ApplicablePricingCategories="1 4 5 8 10 12 15 16 18 23" VendorCode="ATP" FareTypeBitmap="00" FareType="XPN" FareTariff="304" FareRule="U6PR">
    <Segment Stopover="true"/>
  </FareComponentDesc>
  <ValidatingCarrierDesc ID="1" SettlementMethod="TCH" NewVcxProcess="true">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="2" SettlementMethod="GEN" NewVcxProcess="true">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <ValidatingCarrierDesc ID="3" SettlementMethod="BSP" NewVcxProcess="true">
    <Default Code="U6"/>
  </ValidatingCarrierDesc>
  <BaggageAllowanceDesc ID="1" Weight="10" Unit="kg"/>
  <LegDesc ID="1" ElapsedTime="130">
    <Schedule Ref="6"/>
  </LegDesc>
  <LegDesc ID="2" ElapsedTime="135">
    <Schedule Ref="8"/>
  </LegDesc>
  <LegDesc ID="3" ElapsedTime="140">
    <Schedule Ref="7"/>
  </LegDesc>
  <LegDesc ID="4" ElapsedTime="135">
    <Schedule Ref="2"/>
  </LegDesc>
  <LegDesc ID="5" ElapsedTime="120">
    <Schedule Ref="1"/>
  </LegDesc>
  <LegDesc ID="6" ElapsedTime="140">
    <Schedule Ref="5"/>
  </LegDesc>
  <LegDesc ID="7" ElapsedTime="140">
    <Schedule Ref="4"/>
  </LegDesc>
  <LegDesc ID="8" ElapsedTime="135">
    <Schedule Ref="3"/>
  </LegDesc>
  <ItineraryGroup>
    <GroupDescription>
      <LegDescription DepartureDate="2020-08-25" DepartureLocation="DME" ArrivalLocation="AER"/>
      <LegDescription DepartureDate="2020-09-01" DepartureLocation="AER" ArrivalLocation="ZIA"/>
    </GroupDescription>
    <Itinerary ID="1" PricingSource="ADMF1">
      <Leg Ref="1"/>
      <Leg Ref="5"/>
      <PricingInformation PricingSubsource="MIP">
        <Fare ValidatingCarrierCode="U6" VITA="true" ETicketable="true" LastTicketDate="2020-05-13" LastTicketTime="23:59" GoverningCarriers="U6 U6">
          <PassengerInfo PassengerType="ADT" PassengerNumber="1" NonRefundable="true">
            <FareComponent Ref="10">
              <Segment BookingCode="W" CabinCode="Y" SeatsAvailable="9" AvailabilityBreak="true"/>
            </FareComponent>
            <FareComponent Ref="18">
              <Segment BookingCode="W" CabinCode="Y" MealCode="N" SeatsAvailable="9" AvailabilityBreak="true"/>
            </FareComponent>
            <Tax Ref="5"/>
            <Tax Ref="2"/>
            <Tax Ref="12"/>
            <Tax Ref="4"/>
            <Tax Ref="10"/>
            <Tax Ref="11"/>
            <Tax Ref="8"/>
            <Tax Ref="6"/>
            <TaxSummary Ref="2"/>
            <TaxSummary Ref="6"/>
            <TaxSummary Ref="3"/>
            <CurrencyConversion From="RUB" To="RUB" ExchangeRateUsed="1"/>
            <FareMessage Type="N" Code="0" Carrier="U6" Info="NONEND"/>
            <FareMessage Type="W" Code="0" Info="VALIDATING CARRIER"/>
            <FareMessage Type="W" Code="0" Info="BSP - U6"/>
            <FareMessage Type="W" Code="0" Info="GEN - U6"/>
            <FareMessage Type="W" Code="0" Info="TCH - U6"/>
            <FareMessage Type="W" Code="0" Info="CAT 15 SALES RESTRICTIONS FREE TEXT FOUND - VERIFY RULES"/>
            <PassengerTotalFare TotalFare="6800" TotalTaxes="5520" Currency="RUB" BaseFareAmount="1280" BaseFareCurrency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB" ConstructionAmount="1280" ConstructionCurrency="RUB" CommissionPercentage="0" CommissionAmount="0" ExchangeRateOne="76.8000000"/>
            <BaggageInformation ProvisionType="A" AirlineCode="U6">
              <Segment ID="0"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
            <BaggageInformation ProvisionType="A" AirlineCode="U6">
              <Segment ID="1"/>
              <Allowance Ref="1"/>
            </BaggageInformation>
          </PassengerInfo>
          <TotalFare TotalPrice="6800" TotalTaxes="5520" Currency="RUB" BaseFareAmount="1280" BaseFareCurrency="RUB" ConstructionAmount="1280" ConstructionCurrency="RUB" EquivalentAmount="1280" EquivalentCurrency="RUB"/>
          <ValidatingCarrier Ref="3"/>
          <ValidatingCarrier Ref="1"/>
          <ValidatingCarrier Ref="2"/>
        </Fare>
      </PricingInformation>
    </Itinerary>
  </ItineraryGroup>
  <!--Другие варианты перелетов-->
</GroupedItineraryResponse>
{% endxmlsec %}
