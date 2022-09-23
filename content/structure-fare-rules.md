---
title: Получение структурированных правил тарифов
---

{{< toc >}}

## Получение информации об условиях обменов и возвратов в поисковой выдаче (BargainFinderMaxRQ)

Сервис [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) позволяет получать информацию об условиях обменов и возвратов в поисковой выдаче. См. [Поиск перелетов по заданным датам](shop.html#обмен-и-возврат-билетов).

## Получение информации об условиях обменов и возвратов в поисковой выдаче при поиске по гибким датам (BargainFinderMax_ADRQ)

Сервис [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) позволяет получать информацию об условиях обменов и возвратов в поисковой выдаче при поиске по гибким датам. См. [Поиск перелетов по гибким датам](shop-alternate-dates.html).

## Получение информации об условиях обменов и возвратов при проверке стоимости и наличия мест (RevalidateItinRQ)

Сервис [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary) позволяет получать информацию об условиях обменов и возвратов при проверке стоимости и наличия мест. См. [Проверка стоимости и наличия мест](revalidate-itinerary.html#обмен-и-возврат-билетов).

## Получение информации об условиях обменов и возвратов для открытого бронирования (OTA_AirPriceLLSRQ)

Для получения информации об условиях обменов и возвратов для открытого бронирования используется сервис [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary). Перед выполнением запроса необходимо, чтобы в текущей сессии было открыто бронирование (см. [Чтение бронирований](get-booking.html)).

Запрос к сервису составляется по аналогии с заполнением элемента ```AirPrice``` сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.html#расчет-стоимости)) или элемента ```OTA_AirPriceRQ``` сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.html#расчет-стоимости)) за исключением:
- у атрибута ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificPenalty/@AdditionalInfo``` указывается значение ```true``` — запрос условий обменов и возвратов
- не требуется указывать категории пассажиров в элементах ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/PassengerType```
- не требуется сохранять PQ в бронировании — не нужно добавлять атрибут ```/OTA_AirPriceRQ/PriceRequestInformation/@Retain```

{{< details title="Пример запроса" >}}
```XML
<OTA_AirPriceRQ ReturnHostCommand="true" Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <PriceRequestInformation>
    <OptionalQualifiers>
      <FlightQualifiers>
        <VendorPrefs>
          <Airline Code="EY"/>
        </VendorPrefs>
      </FlightQualifiers>
      <PricingQualifiers>
        <Brand>YF</Brand>
        <SpecificPenalty AdditionalInfo="true"/>
      </PricingQualifiers>
    </OptionalQualifiers>
  </PriceRequestInformation>
</OTA_AirPriceRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<OTA_AirPriceRS Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2022-05-25T06:22:09-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPAEY¥MP-I¥BRYF</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <PriceQuote>
    <MiscInformation>
      <BaggageInfo>
        <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0LNABEY</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
        </SubCodeProperties>
        <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0DFAAEY</ExtendedSubCodeKey>
        </SubCodeProperties>
      </BaggageInfo>
      <HeaderInformation SolutionSequenceNmbr="1">
        <DepartureDate>2022-12-01</DepartureDate>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
        <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
        <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
        <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
        <Text>RRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>ELECTRONIC TICKETING NOT VALID FOR INFANTS</Text>
        <ValidatingCarrier Code="EY"/>
      </HeaderInformation>
      <SolutionInformation SolutionSequenceNmbr="1">
        <BaseFareCurrencyCode>AUD</BaseFareCurrencyCode>
        <CurrencyCode>RUB</CurrencyCode>
        <GrandTotalBaseFareAmount>485270</GrandTotalBaseFareAmount>
        <GrandTotalEquivFareAmount>11693.00</GrandTotalEquivFareAmount>
        <GrandTotalTaxes>45130</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>530400</TotalAmount>
      </SolutionInformation>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>BSP</SettlementMethod>
        <Ticket CarrierCode="EY" Type="ETKTREQ" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>TCH</SettlementMethod>
        <Ticket CarrierCode="EY" Type="ETKTPREF" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
    </MiscInformation>
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="530400">
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">7</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
          <Construction Amount="3085.80" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="170110" CurrencyCode="RUB"/>
          <Taxes TotalAmount="16553">
            <Tax Amount="2490" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
            <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="156" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1084" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="6132" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
            <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="186663" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="2"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AU" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">35</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">7</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
          <Construction Amount="2326.85" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="128280" CurrencyCode="RUB"/>
          <Taxes TotalAmount="7931">
            <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="156" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1084" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="136211" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="1"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUCH" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">10</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-08</DepartureDate>
            <DepartureDate RPH="2">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="SYD" RPH="2"/>
            <FlightNumber RPH="1">12</FlightNumber>
            <FlightNumber RPH="2">464</FlightNumber>
            <OriginLocation LocationCode="LHR" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <PNR_Segment RPH="1">4</PNR_Segment>
            <PNR_Segment RPH="2">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">10</WeightLimit>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">EY</CarrierCode>
            <CarrierCode RPH="2">EY</CarrierCode>
            <CarrierCode RPH="3">EY</CarrierCode>
            <CarrierCode RPH="4">EY</CarrierCode>
            <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2022-12-01</DepartureDate>
            <DepartureDate RPH="2">2022-12-02</DepartureDate>
            <DepartureDate RPH="3">2022-12-08</DepartureDate>
            <DepartureDate RPH="4">2022-12-08</DepartureDate>
            <DestinationLocation LocationCode="AUH" RPH="1"/>
            <DestinationLocation LocationCode="LHR" RPH="2"/>
            <DestinationLocation LocationCode="AUH" RPH="3"/>
            <DestinationLocation LocationCode="SYD" RPH="4"/>
            <FlightNumber RPH="1">2463</FlightNumber>
            <FlightNumber RPH="2">25</FlightNumber>
            <FlightNumber RPH="3">12</FlightNumber>
            <FlightNumber RPH="4">464</FlightNumber>
            <OriginLocation LocationCode="SYD" RPH="1"/>
            <OriginLocation LocationCode="AUH" RPH="2"/>
            <OriginLocation LocationCode="LHR" RPH="3"/>
            <OriginLocation LocationCode="AUH" RPH="4"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <PNR_Segment RPH="3">4</PNR_Segment>
            <PNR_Segment RPH="4">5</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
            <StatusCode RPH="3">HK</StatusCode>
            <StatusCode RPH="4">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
          </SubCodeInfo>
          <WeightLimit Units="K">5</WeightLimit>
        </BaggageProvisions>
        <FareCalculation>
          <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLWF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
          <FareBasis Cabin="Y" Code="YLXF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="EY" PCC="9LSC"/>
          <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          <RuleCategoryIndicator>2</RuleCategoryIndicator>
          <RuleCategoryIndicator>3</RuleCategoryIndicator>
          <RuleCategoryIndicator>4</RuleCategoryIndicator>
          <RuleCategoryIndicator>5</RuleCategoryIndicator>
          <RuleCategoryIndicator>7</RuleCategoryIndicator>
          <RuleCategoryIndicator>8</RuleCategoryIndicator>
          <RuleCategoryIndicator>9</RuleCategoryIndicator>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>12</RuleCategoryIndicator>
          <RuleCategoryIndicator>15</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>18</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
          <RuleCategoryIndicator>23</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="O">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
              <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
              <Text>RRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="404.00" CurrencyCode="AUD"/>
          <Construction Amount="303.57" CurrencyCode="NUC" RateOfExchange="1.328146"/>
          <Endorsements>
            <Text>NON ENDO/ REF</Text>
          </Endorsements>
          <EquivFare Amount="16770" CurrencyCode="RUB"/>
          <Taxes TotalAmount="4093">
            <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="20863" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="1"/>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUIN" FilingCarrier="EY"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>YF</BrandCode>
            <BrandName>ECONOMY CHOICE PLUS</BrandName>
            <ProgramCode>CFFEY</ProgramCode>
            <ProgramName>17AUD BP30</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
          <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
    </PricedItinerary>
  </PriceQuote>
</OTA_AirPriceRS>
```
{{< /details >}}

## Получение информации об условиях обменов и возвратов без имеющегося бронирования (EnhancedAirBookRQ)

{{< hint warning >}}
Для получения информации об условиях обменов и возвратов без имеющегося бронирования в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для получения информации об условиях обменов и возвратов без имеющегося бронирования используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/orchestrated_air_booking).

Запрос к сервису строится по аналогии с запросом на бронирование (см. [Создание бронирований в 2 шага](create-booking-2steps.html#бронирование-сегментов-enhancedairbookrq)) за исключением:
- указывается статус сегмента ```QF``` (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика
- у атрибута ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/SpecificPenalty/@AdditionalInfo``` указывается значение ```true``` — запрос условий обменов и возвратов
- у атрибутов ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` и ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter``` устанавливается значение ```true``` — игнорирование текущего бронирования до и после выполнения запроса

{{< details title="Пример запроса" >}}
```XML
<EnhancedAirBookRQ HaltOnError="true" IgnoreOnError="true" haltOnInvalidMCT="true" version="3.10.0" xmlns="http://services.sabre.com/sp/eab/v3_10">
  <OTA_AirBookRQ>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2022-12-01T00:00:00" FlightNumber="2463" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="2463"/>
        <MarriageGrp>O</MarriageGrp>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-02T00:00:00" FlightNumber="25" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="25"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-08T00:00:00" FlightNumber="12" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="12"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="LHR"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2022-12-08T00:00:00" FlightNumber="464" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="SYD"/>
        <MarketingAirline Code="EY" FlightNumber="464"/>
        <MarriageGrp>I</MarriageGrp>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </OTA_AirBookRQ>
  <OTA_AirPriceRQ>
    <PriceRequestInformation>
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="EY"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <Brand>YF</Brand>
          <PassengerType Code="ADT" Quantity="2"/>
          <PassengerType Code="CNN" Quantity="1"/>
          <PassengerType Code="INF" Quantity="1"/>
          <SpecificPenalty AdditionalInfo="true"/>
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </OTA_AirPriceRQ>
  <PostProcessing IgnoreAfter="true"/>
  <PreProcessing IgnoreBefore="true"/>
</EnhancedAirBookRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_10">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/STL_Header/v120" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/v02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/essm/session/v1">
    <Success timeStamp="2022-05-25T06:23:25.338-05:00"/>
  </ApplicationResults>
  <OTA_AirBookRS>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="12-02T06:40" DepartureDateTime="12-01T23:25" FlightNumber="2463" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="2463"/>
        <OriginLocation LocationCode="SYD"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-02T14:10" DepartureDateTime="12-02T10:35" FlightNumber="0025" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="LHR"/>
        <MarketingAirline Code="EY" FlightNumber="0025"/>
        <OriginLocation LocationCode="AUH"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-08T19:20" DepartureDateTime="12-08T08:30" FlightNumber="0012" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="AUH"/>
        <MarketingAirline Code="EY" FlightNumber="0012"/>
        <OriginLocation LocationCode="LHR"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T22:10" FlightNumber="0464" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="SYD"/>
        <MarketingAirline Code="EY" FlightNumber="0464"/>
        <OriginLocation LocationCode="AUH"/>
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
            <ExtendedSubCodeKey>0DFAAEY</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABEY</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1Y"/>
            <AlternateBooking ResBookDesigCode="2Y"/>
            <AlternateBooking ResBookDesigCode="3Y"/>
            <AlternateBooking ResBookDesigCode="4Y"/>
          </BargainFinder>
          <DepartureDate>2022-12-01</DepartureDate>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - EY</Text>
          <Text>TCH - EY</Text>
          <Text>CHG BEF DEP UP TO RUB12450/CHG AFT DEP UP TO RUB12450/REF BEF</Text>
          <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
          <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
          <Text>RRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <ValidatingCarrier Code="EY"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <BaseFareCurrencyCode>AUD</BaseFareCurrencyCode>
          <CurrencyCode>RUB</CurrencyCode>
          <GrandTotalBaseFareAmount>485270</GrandTotalBaseFareAmount>
          <GrandTotalEquivFareAmount>11693.00</GrandTotalEquivFareAmount>
          <GrandTotalTaxes>45130</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>530400</TotalAmount>
        </SolutionInformation>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>BSP</SettlementMethod>
          <Ticket CarrierCode="EY" Type="ETKTREQ" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>TCH</SettlementMethod>
          <Ticket CarrierCode="EY" Type="ETKTPREF" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="530400">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
              <StatusCode RPH="3">QF</StatusCode>
              <StatusCode RPH="4">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">7</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
            <Construction Amount="3085.80" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="170110" CurrencyCode="RUB"/>
            <Taxes TotalAmount="16553">
              <Tax Amount="2490" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
              <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="156" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1084" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="6132" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
              <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="186663" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AU" FareAmount="1531.08" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AU" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AU" FareAmount="1504.72" FarePassengerType="ADT" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">35</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
              <StatusCode RPH="3">QF</StatusCode>
              <StatusCode RPH="4">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">7</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-35KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-35KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/07KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
            <Construction Amount="2326.85" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="128280" CurrencyCode="RUB"/>
            <Taxes TotalAmount="7931">
              <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="156" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1084" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="136211" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUCH" FareAmount="1148.31" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUCH" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
            <Surcharges Ind="Q" Type="UNK">25.00</Surcharges>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUCH" FareAmount="1128.54" FarePassengerType="CNN" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG035</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">10</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-08</DepartureDate>
              <DepartureDate RPH="2">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="SYD" RPH="2"/>
              <FlightNumber RPH="1">12</FlightNumber>
              <FlightNumber RPH="2">464</FlightNumber>
              <OriginLocation LocationCode="LHR" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <PNR_Segment RPH="1">4</PNR_Segment>
              <PNR_Segment RPH="2">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0DFAAEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">10</WeightLimit>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">EY</CarrierCode>
              <CarrierCode RPH="2">EY</CarrierCode>
              <CarrierCode RPH="3">EY</CarrierCode>
              <CarrierCode RPH="4">EY</CarrierCode>
              <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2022-12-01</DepartureDate>
              <DepartureDate RPH="2">2022-12-02</DepartureDate>
              <DepartureDate RPH="3">2022-12-08</DepartureDate>
              <DepartureDate RPH="4">2022-12-08</DepartureDate>
              <DestinationLocation LocationCode="AUH" RPH="1"/>
              <DestinationLocation LocationCode="LHR" RPH="2"/>
              <DestinationLocation LocationCode="AUH" RPH="3"/>
              <DestinationLocation LocationCode="SYD" RPH="4"/>
              <FlightNumber RPH="1">2463</FlightNumber>
              <FlightNumber RPH="2">25</FlightNumber>
              <FlightNumber RPH="3">12</FlightNumber>
              <FlightNumber RPH="4">464</FlightNumber>
              <OriginLocation LocationCode="SYD" RPH="1"/>
              <OriginLocation LocationCode="AUH" RPH="2"/>
              <OriginLocation LocationCode="LHR" RPH="3"/>
              <OriginLocation LocationCode="AUH" RPH="4"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <PNR_Segment RPH="3">4</PNR_Segment>
              <PNR_Segment RPH="4">5</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="3">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="4">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
              <StatusCode RPH="3">QF</StatusCode>
              <StatusCode RPH="4">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>EY</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABEY</SubCodeForChargesOthers>
            </SubCodeInfo>
            <WeightLimit Units="K">5</WeightLimit>
          </BaggageProvisions>
          <FareCalculation>
            <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="SYD" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="SYD" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLWF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="LHR" ArrivalCityCode="LON" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Departure AirlineCode="EY" AirportCode="LHR" ArrivalAirportCode="AUH" ArrivalCityCode="AUH" CityCode="LON" GenericInd="X"/>
            <FareBasis Cabin="Y" Code="YLXF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="EY" PCC="9LSC"/>
            <Departure AirlineCode="EY" AirportCode="AUH" ArrivalAirportCode="SYD" ArrivalCityCode="SYD" CityCode="AUH" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON" TripTypeInd="R"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
            <RuleCategoryIndicator>2</RuleCategoryIndicator>
            <RuleCategoryIndicator>3</RuleCategoryIndicator>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>5</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>12</RuleCategoryIndicator>
            <RuleCategoryIndicator>15</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
            <RuleCategoryIndicator>23</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="O">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SYDLHR-10KG/EY</Text>
                <Text>BAG ALLOWANCE     -LHRSYD-10KG/EY</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-01P/05KG/EY</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SYDAUH AUHLHR LHRAUH AUHSYD-EY-CARRY ON FEES UNKNOWN-CONTACT CA</Text>
                <Text>RRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="404.00" CurrencyCode="AUD"/>
            <Construction Amount="303.57" CurrencyCode="NUC" RateOfExchange="1.328146"/>
            <Endorsements>
              <Text>NON ENDO/ REF</Text>
            </Endorsements>
            <EquivFare Amount="16770" CurrencyCode="RUB"/>
            <Taxes TotalAmount="4093">
              <Tax Amount="4093" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="20863" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="INF" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLWF2AUIN" FareAmount="153.10" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUIN" FilingCarrier="EY"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>YF</BrandCode>
              <BrandName>ECONOMY CHOICE PLUS</BrandName>
              <ProgramCode>CFFEY</ProgramCode>
              <ProgramName>17AUD BP30</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YLXF2AUIN" FareAmount="150.47" FarePassengerType="INF" FareType="P" FilingCarrier="EY" GlobalInd="EH" Market="SYDLON"/>
            <FreeBaggageAllowance>KG010</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="12450" Cat16="false" Currency="RUB" NotApplicable="false" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
</EnhancedAirBookRS>
```
{{< /details >}}

## Получение информации об условиях обменов и возвратов, а также другой информации без имеющегося бронирования (StructureFareRulesRQ)

{{< hint warning >}}
Для получения информации об условиях обменов и возвратов, а также другой информации без имеющегося бронирования в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Сервис [StructureFareRulesRQ](https://developer.sabre.com/docs/soap_apis/air/utility/get_structured_fare_rules) позволяет выделить некоторые параметры правил тарифа и выводит их в структурированном виде.

В запросе необходимо указать:

- ```/StructureFareRulesRQ/PriceRequestInformation/PassengerTypes/PassengerType``` — информация о пассажирах:
    - ```/@Code``` — категория пассажира (например, ```ADT``` для взрослого пассажира)
    - ```/@Count``` — количество пассажиров указанной категории
- ```/StructureFareRulesRQ/PriceRequestInformation/ValidatingCarrier/@Code``` — код валидирующего перевозчика
- ```/StructureFareRulesRQ/AirItinerary/OriginDestinationOptions/OriginDestinationOption``` — информация о сегменте:
    - ```/FlightSegment/@SegmentNumber``` — номер сегмента
    - ```/FlightSegment/@SegmentType``` — тип сегмента
    - ```/FlightSegment/@FlightNumber``` — номер рейса
    - ```/FlightSegment/@DepartureDate``` — дата и время отправления
    - ```/FlightSegment/@ArrivalDate``` — дата и время прибытия
    - ```/FlightSegment/@BookingDate``` — дата и время бронирования (в случае отсутствия бронирования — текущая дата)
    - ```/FlightSegment/@ResBookDesigCode``` — класс бронирования
    - ```/FlightSegment/@RealReservationStatus``` — статус бронирования (в случае отсутствия бронирования — ```HK```)
    - ```/FlightSegment/DepartureAirport/@LocationCode``` — аэропорт отправления
    - ```/FlightSegment/ArrivalAirport/@LocationCode``` — аэропорт прибытия
    - ```/FlightSegment/MarketingAirline/@Code``` — код маркетингового перевозчика
    - ```/FlightSegment/Marriage/@Status``` — статус соединенного сегмента (первый сегмент в цепочке соединенных сегментов — ```S```, средний сегмент в цепочке соединенных сегментов — ```P```, последний сегмент в цепочке соединенных сегментов — ```E```). Для не соединенных сегментов элемент не добавляется
    - ```/PaxTypeInformation``` — информация о тарифе
        - ```/@FareBasisCode``` — код тарифа
        - ```/@FareComponentNumber``` — номер компонента тарифа (см. ниже)
        - ```/@PassengerType``` — категория пассажира, для которой применим указанный тариф

Список компонентов тарифа может быть получен:
- в ответе на запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) (поиск) — элементы ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode```, содержащие атрибут ```/@FareComponentDirectionality```
- в ответе на запрос к сервису [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary) (чтение бронирования) — элементы ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdown/FareComponent```

Для получения структурированных правил для приватного тарифа также может потребоваться указание Account Code (```/StructureFareRulesRQ/PriceRequestInformation/Account/@Code```) или Corporate ID (```/StructureFareRulesRQ/PriceRequestInformation/Corporate/@ID```).

{{< details title="Пример запроса" >}}
```XML
<StructureFareRulesRQ Version="1.0.5" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <PriceRequestInformation>
    <PassengerTypes>
      <PassengerType Code="ADT" Count="2"/>
      <PassengerType Code="CNN" Count="1"/>
      <PassengerType Code="INF" Count="1"/>
    </PassengerTypes>
    <ValidatingCarrier Code="EY"/>
  </PriceRequestInformation>
  <AirItinerary>
    <OriginDestinationOptions>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2022-12-02T06:40:00" BookingDate="2022-05-25T10:00:00" DepartureDate="2022-12-01T23:25:00" FlightNumber="2463" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="1" SegmentType="A">
          <DepartureAirport LocationCode="SYD"/>
          <ArrivalAirport LocationCode="AUH"/>
          <MarketingAirline Code="EY"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YLWF2AU" FareComponentNumber="1" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YLWF2AUCH" FareComponentNumber="1" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YLWF2AUIN" FareComponentNumber="1" PassengerType="INF"/>
      </OriginDestinationOption>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2022-12-02T14:10:00" BookingDate="2022-05-25T10:00:00" DepartureDate="2022-12-02T10:35:00" FlightNumber="25" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="2" SegmentType="A">
          <DepartureAirport LocationCode="AUH"/>
          <ArrivalAirport LocationCode="LHR"/>
          <MarketingAirline Code="EY"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YLWF2AU" FareComponentNumber="1" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YLWF2AUCH" FareComponentNumber="1" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YLWF2AUIN" FareComponentNumber="1" PassengerType="INF"/>
      </OriginDestinationOption>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2022-12-08T19:20:00" BookingDate="2022-05-25T10:00:00" DepartureDate="2022-12-08T19:20:00" FlightNumber="12" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="3" SegmentType="A">
          <DepartureAirport LocationCode="LHR"/>
          <ArrivalAirport LocationCode="AUH"/>
          <MarketingAirline Code="EY"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YLXF2AU" FareComponentNumber="2" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YLXF2AUCH" FareComponentNumber="2" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YLXF2AUIN" FareComponentNumber="2" PassengerType="INF"/>
      </OriginDestinationOption>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2022-12-09T17:55:00" BookingDate="2022-05-25T10:00:00" DepartureDate="2022-12-08T22:10:00" FlightNumber="464" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="4" SegmentType="A">
          <DepartureAirport LocationCode="AUH"/>
          <ArrivalAirport LocationCode="SYD"/>
          <MarketingAirline Code="EY"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YLXF2AU" FareComponentNumber="2" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YLXF2AUCH" FareComponentNumber="2" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YLXF2AUIN" FareComponentNumber="2" PassengerType="INF"/>
      </OriginDestinationOption>
    </OriginDestinationOptions>
  </AirItinerary>
</StructureFareRulesRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<StructureFareRulesRS Version="1.0.5" xmlns="http://webservices.sabre.com/sabreXML/2003/07" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Success/>
  <Summary>
    <Total CurrencyCode="AUD" Price="11693.00"/>
    <PurchaseSummary IATASalesCode="SOTO" SalesLocation="MOW" SimultaneousResInd="false"/>
    <ValidatingCarrier Code="EY"/>
    <PrivateFare Ind="false"/>
    <Ancillaries NotGuaranteedInd="true"/>
    <ValidatingCarrierListInformation SettlementMethod="BSP" TFRRestricted="F" ValidatingCarrierProcess="T">
      <AlternateValidatingCarrierInformation TicketingType="ETKTREQ" ValidatingCarrierCode="EY"/>
    </ValidatingCarrierListInformation>
    <PassengerDetails>
      <PassengerDetail PassengerTypeCode="ADT">
        <Endorsements>
          <Text>NON ENDO/ REF</Text>
        </Endorsements>
        <Warnings>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - EY </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
          <EquivalentFare Amount="170110" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="1"/>
        <ExchangeRateOne NumberOfDecimalPlaces="8" Value="1.32814600"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="12450" Applicability="Before" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="12450" Applicability="After" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </PricingUnitData>
        </PricingUnitDataList>
      </PassengerDetail>
      <PassengerDetail PassengerTypeCode="CNN">
        <Endorsements>
          <Text>NON ENDO/ REF</Text>
        </Endorsements>
        <Warnings>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - EY </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
          <EquivalentFare Amount="128280" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="2"/>
        <ExchangeRateOne NumberOfDecimalPlaces="8" Value="1.32814600"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="12450" Applicability="Before" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="12450" Applicability="After" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </PricingUnitData>
        </PricingUnitDataList>
      </PassengerDetail>
      <PassengerDetail PassengerTypeCode="INF">
        <Endorsements>
          <Text>NON ENDO/ REF</Text>
        </Endorsements>
        <Warnings>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - EY </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="404.00" CurrencyCode="AUD"/>
          <EquivalentFare Amount="16770" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="3"/>
        <ExchangeRateOne NumberOfDecimalPlaces="8" Value="1.32814600"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="12450" Applicability="Before" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="12450" Applicability="After" Changeable="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="0" Applicability="Before" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="0" Applicability="After" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2023-12-01T23:59:00" RestrictedLocation="LON"/>
          </PricingUnitData>
        </PricingUnitDataList>
      </PassengerDetail>
    </PassengerDetails>
  </Summary>
</StructureFareRulesRS>
```
{{< /details >}}
