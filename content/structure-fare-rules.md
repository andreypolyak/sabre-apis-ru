---
title: Получение структурированных правил тарифов
---

{{< toc >}}

## Получение информации об условиях обменов и возвратов в поисковой выдаче (BargainFinderMaxRQ)

Сервис [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) позволяет получать информацию об условиях обменов и возвратов в поисковой выдаче. См. [Проверка стоимости и наличия мест](revalidate-itinerary.html#обмен-и-возврат-билетов).

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
          <Airline Code="SU"/>
        </VendorPrefs>
      </FlightQualifiers>
      <PricingQualifiers>
        <Brand>EC</Brand>
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
    <stl:Success timeStamp="2020-01-29T02:42:13-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPASU¥MP-I¥BREC</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <PriceQuote>
    <MiscInformation>
      <BaggageInfo>
        <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>PREPAID BAGGAGE 23KG</CommercialNameofBaggageItemType>
          <DescriptionOne Code="23">
            <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
          </DescriptionOne>
          <EMD_Type>2</EMD_Type>
          <ExtendedSubCodeKey>0C3ACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
            <MaximumWeight Units="L">50</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0DFAASU</ExtendedSubCodeKey>
        </SubCodeProperties>
        <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>UPTO 22LB 10KG AND45LI 115LCM</CommercialNameofBaggageItemType>
          <DescriptionOne Code="10">
            <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="4U">
            <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          </DescriptionTwo>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0E3ACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
            <MaximumSize Units="I">45</MaximumSize>
            <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
            <MaximumWeight Units="L">22</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <CommercialNameofBaggageItemType>UPTO50LB 23KG AND62LI 158LCM</CommercialNameofBaggageItemType>
          <DescriptionOne Code="23">
            <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="6U">
            <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          </DescriptionTwo>
          <EMD_Type>2</EMD_Type>
          <ExtendedSubCodeKey>0GOACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
            <MaximumSize Units="I">62</MaximumSize>
            <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
            <MaximumWeight Units="L">50</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
        <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
        </SubCodeProperties>
        <SubCodeProperties RPH="6" SolutionSequenceNmbr="1">
          <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
          <AncillaryService SubGroupCode="CY">
            <Text>CARRY ON HAND BAGGAGE</Text>
          </AncillaryService>
          <CommercialNameofBaggageItemType>CARRY10KG 22LB 55L X 40W X 25H</CommercialNameofBaggageItemType>
          <DescriptionOne Code="10">
            <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
          </DescriptionOne>
          <DescriptionTwo Code="55">
            <Text>55CM LENGTH X 40CM WIDTH X 25CM HEIGHT</Text>
          </DescriptionTwo>
          <EMD_Type>4</EMD_Type>
          <ExtendedSubCodeKey>08AACSU</ExtendedSubCodeKey>
          <RFIC>C</RFIC>
          <SizeWeightInfo>
            <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
            <MaximumWeight Units="L">22</MaximumWeight>
          </SizeWeightInfo>
        </SubCodeProperties>
      </BaggageInfo>
      <HeaderInformation SolutionSequenceNmbr="1">
        <DepartureDate>2020-09-01</DepartureDate>
        <LastTicketingDate>08-27T23:59</LastTicketingDate>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - SU</Text>
        <Text>RUT - SU</Text>
        <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
        <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
        <Text>NON-REF/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-01P/SU</Text>
        <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
        <Text>25CM HEIGHT</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - SU</Text>
        <Text>RUT - SU</Text>
        <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
        <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
        <Text>NON-REF/SEE RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
        <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-01P/SU</Text>
        <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
        <Text>25CM HEIGHT</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - SU</Text>
        <Text>RUT - SU</Text>
        <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
        <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
        <Text>RULES</Text>
        <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
        <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
        <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
        <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
        <Text>MS</Text>
        <Text>CARRY ON ALLOWANCE</Text>
        <Text>SVOAER AERSVO-NIL/SU</Text>
        <Text>CARRY ON CHARGES</Text>
        <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
        <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
        <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
        <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
        <Text>ELECTRONIC TICKETING NOT VALID FOR INFANTS</Text>
        <Text>01SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 27AUG/2359</Text>
        <ValidatingCarrier Code="SU"/>
      </HeaderInformation>
      <SolutionInformation SolutionSequenceNmbr="1">
        <BaseFareCurrencyCode>RUB</BaseFareCurrencyCode>
        <CurrencyCode>RUB</CurrencyCode>
        <GrandTotalEquivFareAmount>159500</GrandTotalEquivFareAmount>
        <GrandTotalTaxes>17720</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>177220</TotalAmount>
      </SolutionInformation>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>BSP</SettlementMethod>
        <Ticket CarrierCode="SU" Type="ETKTREQ" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
      <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
        <SettlementMethod>RUT</SettlementMethod>
        <Ticket CarrierCode="SU" Type="PTKTPREF" ValidatingCarrierType="Default"/>
      </ValidatingCarrier>
    </MiscInformation>
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="177220">
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="ADT"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-01P/SU</Text>
              <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
              <Text>25CM HEIGHT</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="58000" CurrencyCode="RUB"/>
          <Construction Amount="58000" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="6008">
            <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
            <Tax Amount="608" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="64008" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="ADT" Quantity="2"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="CNN"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-01P/SU</Text>
              <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
              <Text>25CM HEIGHT</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="43500" CurrencyCode="RUB"/>
          <Construction Amount="43500" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="5704">
            <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
            <Tax Amount="304" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="49204" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="CNN" Quantity="1"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
        </SpecificPenalty>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="2">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>1</NumPiecesBDI>
          <NumPiecesITR>1</NumPiecesITR>
          <ProvisionType>A</ProvisionType>
          <SubCodeInfo>
            <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
            <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="6">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="SVO" RPH="1"/>
            <FlightNumber RPH="1">1129</FlightNumber>
            <OriginLocation LocationCode="AER" RPH="1"/>
            <PNR_Segment RPH="1">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <Commissionable>N</Commissionable>
          <FeeApplicationIndicator>4</FeeApplicationIndicator>
          <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
          <FirstOccurrence>1</FirstOccurrence>
          <Interlineable>Y</Interlineable>
          <LastOccurrence>1</LastOccurrence>
          <PassengerType Code="INF"/>
          <PriceInformation>
            <Base Amount="2000" CurrencyCode="RUB"/>
            <Equiv Amount="2000" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2000</Total>
          </PriceInformation>
          <ProvisionType>P</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="7">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2020-09-01</DepartureDate>
            <DepartureDate RPH="2">2020-09-08</DepartureDate>
            <DestinationLocation LocationCode="AER" RPH="1"/>
            <DestinationLocation LocationCode="SVO" RPH="2"/>
            <FlightNumber RPH="1">1138</FlightNumber>
            <FlightNumber RPH="2">1129</FlightNumber>
            <OriginLocation LocationCode="SVO" RPH="1"/>
            <OriginLocation LocationCode="AER" RPH="2"/>
            <PNR_Segment RPH="1">2</PNR_Segment>
            <PNR_Segment RPH="2">3</PNR_Segment>
            <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
            <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
            <StatusCode RPH="1">HK</StatusCode>
            <StatusCode RPH="2">HK</StatusCode>
          </Associations>
          <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
          <NumPiecesBDI>0</NumPiecesBDI>
          <ProvisionType>B</ProvisionType>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <FareCalculation>
          <Text>MOW SU AER0SU MOW0RUB0END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <ItinTotalFare NonRefundableInd="N">
          <BaggageInfo>
            <NonUS_DOT_Disclosure>
              <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
              <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
              <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS</Text>
              <Text>CARRY ON ALLOWANCE</Text>
              <Text>SVOAER AERSVO-NIL/SU</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="0" CurrencyCode="RUB"/>
          <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="64.400000"/>
          <Taxes TotalAmount="0"/>
          <TotalFare Amount="0" CurrencyCode="RUB"/>
          <Warnings>
            <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
          </Warnings>
        </ItinTotalFare>
        <PassengerTypeQuantity Code="INF" Quantity="1"/>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <PTC_FareBreakdown>
          <BrandedFareInformation>
            <BrandCode>EC</BrandCode>
            <BrandName>ECONOMY CLASSIC</BrandName>
            <ProgramCode>CFF1S</ProgramCode>
            <ProgramName>NEW BRANDS AFL</ProgramName>
          </BrandedFareInformation>
          <Cabin>Y</Cabin>
          <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
        </SpecificPenalty>
        <SpecificPenalty>
          <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
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
<EnhancedAirBookRQ HaltOnError="true" haltOnInvalidMCT="true" IgnoreOnError="true" version="3.10.0" xmlns="http://services.sabre.com/sp/eab/v3_10">
  <OTA_AirBookRQ>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2020-09-01T00:00:00" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2020-09-08T00:00:00" FlightNumber="1129" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationInformation>
  </OTA_AirBookRQ>
  <OTA_AirPriceRQ>
    <PriceRequestInformation>
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="SU"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <Brand>EC</Brand>
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
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-29T02:36:34.933-06:00"/>
  </ApplicationResults>
  <OTA_AirBookRS>
    <OriginDestinationOption>
      <FlightSegment ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45" FlightNumber="1138" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45" FlightNumber="1129" NumberInParty="003" ResBookDesigCode="Y" Status="QF" eTicket="true">
        <DestinationLocation LocationCode="SVO"/>
        <MarketingAirline Code="SU" FlightNumber="1129"/>
        <OriginLocation LocationCode="AER"/>
      </FlightSegment>
    </OriginDestinationOption>
  </OTA_AirBookRS>
  <OTA_AirPriceRS>
    <PriceQuote>
      <MiscInformation>
        <BaggageInfo>
          <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRY10KG 22LB 55L X 40W X 25H</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="55">
              <Text>55CM LENGTH X 40CM WIDTH X 25CM HEIGHT</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>08AACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>PREPAID BAGGAGE 23KG</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <EMD_Type>2</EMD_Type>
            <ExtendedSubCodeKey>0C3ACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
              <MaximumWeight Units="L">50</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0DFAASU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO 22LB 10KG AND45LI 115LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="4U">
              <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0E3ACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
              <MaximumSize Units="I">45</MaximumSize>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO50LB 23KG AND62LI 158LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="6U">
              <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>2</EMD_Type>
            <ExtendedSubCodeKey>0GOACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
              <MaximumSize Units="I">62</MaximumSize>
              <MaximumWeightInAlternate Units="K">23</MaximumWeightInAlternate>
              <MaximumWeight Units="L">50</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
          <SubCodeProperties RPH="6" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1Y"/>
            <AlternateBooking ResBookDesigCode="2Y"/>
          </BargainFinder>
          <DepartureDate>2020-09-01</DepartureDate>
          <LastTicketingDate>08-27T23:59</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - SU</Text>
          <Text>RUT - SU</Text>
          <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
          <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
          <Text>NON-REF/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
          <Text>25CM HEIGHT</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - SU</Text>
          <Text>RUT - SU</Text>
          <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
          <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
          <Text>NON-REF/SEE RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
          <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-01P/SU</Text>
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
          <Text>25CM HEIGHT</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - SU</Text>
          <Text>RUT - SU</Text>
          <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
          <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
          <Text>RULES</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS</Text>
          <Text>CARRY ON ALLOWANCE</Text>
          <Text>SVOAER AERSVO-NIL/SU</Text>
          <Text>CARRY ON CHARGES</Text>
          <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
          <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
          <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
          <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
          <Text>01SEP DEPARTURE DATE-----LAST DAY TO PURCHASE 27AUG/2359</Text>
          <ValidatingCarrier Code="SU"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <BaseFareCurrencyCode>RUB</BaseFareCurrencyCode>
          <CurrencyCode>RUB</CurrencyCode>
          <GrandTotalEquivFareAmount>159500</GrandTotalEquivFareAmount>
          <GrandTotalTaxes>17720</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>177220</TotalAmount>
        </SolutionInformation>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>BSP</SettlementMethod>
          <Ticket CarrierCode="SU" Type="ETKTREQ" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
        <ValidatingCarrier NewValidatingProcess="true" SolutionSequenceNmbr="1">
          <SettlementMethod>RUT</SettlementMethod>
          <Ticket CarrierCode="SU" Type="PTKTPREF" ValidatingCarrierType="Default"/>
        </ValidatingCarrier>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="177220">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="ADT"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-01P/SU</Text>
                <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
                <Text>25CM HEIGHT</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="58000" CurrencyCode="RUB"/>
            <Construction Amount="58000" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="6008">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
              <Tax Amount="608" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="64008" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR" FareAmount="29000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0GOACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="CNN"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">08AACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-01P/SU</Text>
                <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
                <Text>25CM HEIGHT</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="43500" CurrencyCode="RUB"/>
            <Construction Amount="43500" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="5704">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - CARRIER-IMPOSED" TicketingTaxCode="YQ"/>
              <Tax Amount="304" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="49204" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/CH25" FareAmount="21750" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="2600" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
          </SpecificPenalty>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="2">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>1</NumPiecesBDI>
            <NumPiecesITR>1</NumPiecesITR>
            <ProvisionType>A</ProvisionType>
            <SubCodeInfo>
              <SubCodeForAllowance RPH="1">0E3ACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0DFAASU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="6">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="SVO" RPH="1"/>
              <FlightNumber RPH="1">1129</FlightNumber>
              <OriginLocation LocationCode="AER" RPH="1"/>
              <PNR_Segment RPH="1">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <Commissionable>N</Commissionable>
            <FeeApplicationIndicator>4</FeeApplicationIndicator>
            <FeeNotGuaranteedIndicator>N</FeeNotGuaranteedIndicator>
            <FirstOccurrence>1</FirstOccurrence>
            <Interlineable>Y</Interlineable>
            <LastOccurrence>1</LastOccurrence>
            <PassengerType Code="INF"/>
            <PriceInformation>
              <Base Amount="2000" CurrencyCode="RUB"/>
              <Equiv Amount="2000" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2000</Total>
            </PriceInformation>
            <ProvisionType>P</ProvisionType>
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0C3ACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="7">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2020-09-01</DepartureDate>
              <DepartureDate RPH="2">2020-09-08</DepartureDate>
              <DestinationLocation LocationCode="AER" RPH="1"/>
              <DestinationLocation LocationCode="SVO" RPH="2"/>
              <FlightNumber RPH="1">1138</FlightNumber>
              <FlightNumber RPH="2">1129</FlightNumber>
              <OriginLocation LocationCode="SVO" RPH="1"/>
              <OriginLocation LocationCode="AER" RPH="2"/>
              <PNR_Segment RPH="1">2</PNR_Segment>
              <PNR_Segment RPH="2">3</PNR_Segment>
              <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
              <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
              <StatusCode RPH="1">QF</StatusCode>
              <StatusCode RPH="2">QF</StatusCode>
            </Associations>
            <CarrierWhoseBaggageProvisionsApply>SU</CarrierWhoseBaggageProvisionsApply>
            <NumPiecesBDI>0</NumPiecesBDI>
            <ProvisionType>B</ProvisionType>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER0SU MOW0RUB0END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2000/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS</Text>
                <Text>CARRY ON ALLOWANCE</Text>
                <Text>SVOAER AERSVO-NIL/SU</Text>
                <Text>CARRY ON CHARGES</Text>
                <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
                <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
                <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
                <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="0" CurrencyCode="RUB"/>
            <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="64.400000"/>
            <Taxes TotalAmount="0"/>
            <TotalFare Amount="0" CurrencyCode="RUB"/>
            <Warnings>
              <Warning ShortText="MIXED PASSENGER TYPES - VERIFY RESTRICTIONS"/>
            </Warnings>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="INF" Quantity="1"/>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <BrandedFareInformation>
              <BrandCode>EC</BrandCode>
              <BrandName>ECONOMY CLASSIC</BrandName>
              <ProgramCode>CFF1S</ProgramCode>
              <ProgramName>NEW BRANDS AFL</ProgramName>
            </BrandedFareInformation>
            <Cabin>Y</Cabin>
            <FareBasis Code="YCLR/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="CPAD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="0" Cat16="false" Currency="RUB" NotApplicable="true" Type="RPBD"/>
          </SpecificPenalty>
          <SpecificPenalty>
            <PenaltyInformation Amount="5200" Cat16="true" Currency="RUB" NotApplicable="false" Type="RPAD"/>
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
        - ```/PaxTypeInformation/@FareBasisCode``` — код тарифа
        - ```/PaxTypeInformation/@FareComponentNumber``` — номер компонента тарифа (см. ниже)
        - ```/PaxTypeInformation/@PassengerType``` — категория пассажира, для которой применим указанный тариф

Список компонентов тарифа может быть получен:
- в ответе на запрос к сервису BargainFinderMaxRQ (поиск) — элементы ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdowns/PTC_FareBreakdown/FareBasisCodes/FareBasisCode```, содержащие атрибут ```/@FareComponentDirectionality```
- в ответе на запрос к сервису TravelItineraryReadRQ (чтение бронирования) — элементы ```/TravelItineraryReadRS/TravelItinerary/ItineraryInfo/ItineraryPricing/PriceQuote/PricedItinerary/AirItineraryPricingInfo/PTC_FareBreakdown/FareComponent```

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
    <ValidatingCarrier Code="SU"/>
  </PriceRequestInformation>
  <AirItinerary>
    <OriginDestinationOptions>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2020-09-01T10:15:00" BookingDate="2020-01-29T01:54:00" DepartureDate="2020-09-01T07:45:00" FlightNumber="1138" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="1" SegmentType="A">
          <DepartureAirport LocationCode="SVO"/>
          <ArrivalAirport LocationCode="AER"/>
          <MarketingAirline Code="SU"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YCLR" FareComponentNumber="1" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YCLR/CH25" FareComponentNumber="1" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YCLR/IN00" FareComponentNumber="1" PassengerType="INF"/>
      </OriginDestinationOption>
      <OriginDestinationOption>
        <FlightSegment ArrivalDate="2020-09-08T05:20:00" BookingDate="2020-01-29T01:54:00" DepartureDate="2020-09-08T02:45:00" FlightNumber="1129" RealReservationStatus="HK" ResBookDesigCode="Y" SegmentNumber="2" SegmentType="A">
          <DepartureAirport LocationCode="AER"/>
          <ArrivalAirport LocationCode="SVO"/>
          <MarketingAirline Code="SU"/>
        </FlightSegment>
        <PaxTypeInformation FareBasisCode="YCLR" FareComponentNumber="2" PassengerType="ADT"/>
        <PaxTypeInformation FareBasisCode="YCLR/CH25" FareComponentNumber="2" PassengerType="CNN"/>
        <PaxTypeInformation FareBasisCode="YCLR/IN00" FareComponentNumber="2" PassengerType="INF"/>
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
    <Total CurrencyCode="RUB" Price="159500"/>
    <PurchaseSummary IATASalesCode="SITI" SalesLocation="MOW" SimultaneousResInd="false"/>
    <ValidatingCarrier Code="SU"/>
    <PrivateFare Ind="false"/>
    <Ancillaries NotGuaranteedInd="true"/>
    <ValidatingCarrierListInformation SettlementMethod="BSP" TFRRestricted="F" ValidatingCarrierProcess="T">
      <AlternateValidatingCarrierInformation TicketingType="ETKTREQ" ValidatingCarrierCode="SU"/>
    </ValidatingCarrierListInformation>
    <PassengerDetails>
      <PassengerDetail PassengerTypeCode="ADT">
        <Warnings>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - SU </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="58000" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="1"/>
        <ExchangeRateOne NumberOfDecimalPlaces="7" Value="64.4000000"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </PricingUnitData>
        </PricingUnitDataList>
        <JourneyLevelDataList>
          <JourneyLevelData>
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
          </JourneyLevelData>
        </JourneyLevelDataList>
      </PassengerDetail>
      <PassengerDetail PassengerTypeCode="CNN">
        <Warnings>
          <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - SU </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="43500" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="2"/>
        <ExchangeRateOne NumberOfDecimalPlaces="7" Value="64.4000000"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="2600" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="2600" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="2600" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </PricingUnitData>
        </PricingUnitDataList>
        <JourneyLevelDataList>
          <JourneyLevelData>
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
          </JourneyLevelData>
        </JourneyLevelDataList>
      </PassengerDetail>
      <PassengerDetail PassengerTypeCode="INF">
        <Warnings>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER - </Text>
          <Text>ALTERNATE VALIDATING CARRIER/S - SU </Text>
        </Warnings>
        <PassengerFare>
          <BaseFare Amount="0" CurrencyCode="RUB"/>
          <Commission Amount="0" Percentage="0"/>
        </PassengerFare>
        <TicketFareVendor Source="ATPC"/>
        <OptionNumber Value="3"/>
        <ExchangeRateOne NumberOfDecimalPlaces="7" Value="64.4000000"/>
        <Cat35 Ind="false"/>
        <PenaltiesInfo>
          <Penalty Amount="0" Applicability="Before" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="0" Applicability="After" Changeable="true" ConditionsApply="true" CurrencyCode="RUB" Type="Exchange"/>
          <Penalty Amount="0" Applicability="Before" ConditionsApply="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
          <Penalty Amount="5200" Applicability="After" Cat16Info="true" CurrencyCode="RUB" Refundable="true" Type="Refund"/>
        </PenaltiesInfo>
        <FareComponentDataList>
          <FareComponentData FareComponentNumber="1" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
          <FareComponentData FareComponentNumber="2" PricingUnitNumber="1">
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </FareComponentData>
        </FareComponentDataList>
        <PricingUnitDataList>
          <PricingUnitData PricingUnitNumber="1">
            <MaximumStayData LastCommencementDateTime="2021-09-01T23:59:00" RestrictedLocation="AER"/>
          </PricingUnitData>
        </PricingUnitDataList>
        <JourneyLevelDataList>
          <JourneyLevelData>
            <AdvancedPurchaseData LastDateTimeToPurchase="2020-08-27T23:59:00"/>
          </JourneyLevelData>
        </JourneyLevelDataList>
      </PassengerDetail>
    </PassengerDetails>
  </Summary>
</StructureFareRulesRS>
```
{{< /details >}}
