# Неподтвержденные места

При бронировании сегментов требуется получение подтверждения со стороны перевозчика. Иногда перевозчик не подтверждает сегменты по выбранному классу бронирования, например, по причине отсутствия мест. В этом случае можно попробовать выбрать другой доступный класс бронирования. Для этого необходимо воспользоваться сервисом EnhancedAirBookRQ.
Запрос к сервису строится по аналогии с запросом на бронирование (см. выше) за исключением:
- указывается статус сегмента QF (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика
- отсутствует атрибут ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@Retain``` — сохранение PQ не требуется
- добавляется элемент ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/PricingQualifiers/BargainFinder``` — расчет стоимости по наиболее дешевым тарифам с учетом наличия мест
- у атрибутов ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` и ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter``` устанавливается значение ```true``` — игнорирование текущего бронирования до и после выполнения запроса

В результате работы сервиса создаются фиктивные сегменты со статусом QF, для которых производится расчет стоимости по наиболее дешевым тарифам с учетом наличия мест (аналог терминальной команды ```WPNC```), после чего бронирование игнорируется. Ответ на такой запрос будет содержать классы бронирования для указанных сегментов (```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/HeaderInformation/BargainFinder/AlternateBooking/@ResBookDesigCode```, формат ```[номер сегмента][класс бронирования]```), для которых есть места. В случае, если клиент соглашается на указанные тарифы, необходимо забронировать сегменты по новым классам бронирования. Бронирование производится так же как и при бронировании варианта, представленного в результатах поиска (см. [Создание бронирований](/create-booking.md)).

{% xmlsec "Пример запроса" %}
<EnhancedAirBookRQ HaltOnError="true" IgnoreOnError="true" version="3.5.0" xmlns="http://services.sabre.com/sp/eab/v3_5">
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
    <PriceRequestInformation>
      <OptionalQualifiers>
        <FlightQualifiers>
          <VendorPrefs>
            <Airline Code="SU"/>
          </VendorPrefs>
        </FlightQualifiers>
        <PricingQualifiers>
          <BargainFinder/>
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
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_5">
  <ns2:ApplicationResults status="Complete" xmlns:ns2="http://services.sabre.com/STL_Payload/v02_01">
    <ns2:Success timeStamp="2016-04-18T12:39:45.561-05:00"/>
  </ns2:ApplicationResults>
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
        <BaggageInfo>
          <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0DFAASU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
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
          <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <CommercialNameofBaggageItemType>UPTO50LB 23KG AND62LI 158LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="23">
              <Text>UP TO 50 POUNDS/23 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="6U">
              <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0GOACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
              <MaximumSize Units="I">62</MaximumSize>
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
            <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="5" SolutionSequenceNmbr="1">
            <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
            <AncillaryService SubGroupCode="CY">
              <Text>CARRY ON HAND BAGGAGE</Text>
            </AncillaryService>
            <CommercialNameofBaggageItemType>CARRY10KG 22LBUPTO 45LI 115LCM</CommercialNameofBaggageItemType>
            <DescriptionOne Code="10">
              <Text>UP TO 22 POUNDS/10 KILOGRAMS</Text>
            </DescriptionOne>
            <DescriptionTwo Code="4U">
              <Text>UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
            </DescriptionTwo>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0MJACSU</ExtendedSubCodeKey>
            <RFIC>C</RFIC>
            <SizeWeightInfo>
              <MaximumSizeInAlternate Units="C">115</MaximumSizeInAlternate>
              <MaximumSize Units="I">45</MaximumSize>
              <MaximumWeightInAlternate Units="K">10</MaximumWeightInAlternate>
              <MaximumWeight Units="L">22</MaximumWeight>
            </SizeWeightInfo>
          </SubCodeProperties>
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1L"/>
            <AlternateBooking ResBookDesigCode="2E"/>
          </BargainFinder>
          <DepartureDate>2016-09-15</DepartureDate>
          <LastTicketingDate>06-14T23:59</LastTicketingDate>
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
          <Text>CHANGE BOOKING CLASS -   1L 2E</Text>
          <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
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
          <Text>CHANGE BOOKING CLASS -   1L 2E</Text>
          <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
          <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
          <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
          <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
          <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
          <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
          <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
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
          <Text>CHANGE BOOKING CLASS -   1L 2E</Text>
          <Text>15SEP DEPARTURE DATE ----- LAST DAY TO PURCHASE 14JUN</Text>
          <ValidatingCarrier Code="SU"/>
        </HeaderInformation>
        <SolutionInformation SolutionSequenceNmbr="1">
          <CurrencyCode>RUB</CurrencyCode>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>41315</TotalAmount>
        </SolutionInformation>
      </MiscInformation>
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="41315">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
              <DepartureDate RPH="2">2016-09-29</DepartureDate>
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
              <SubCodeForAllowance RPH="1">0MJACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER8750SU MOW3000RUB11750END</Text>
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
            <FareBasis Cabin="Y" Code="EPXRF" FareAmount="3000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
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
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="11750" CurrencyCode="RUB"/>
            <Endorsements>
              <Text>NONREF/HEBO3BPATEH</Text>
            </Endorsements>
            <Taxes TotalAmount="3000">
              <Tax Amount="3000" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            </Taxes>
            <TotalFare Amount="14750" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="ADT" Quantity="2"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="LEXRF" FareAmount="8750" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="EPXRF" FareAmount="3000" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
              <DepartureDate RPH="2">2016-09-29</DepartureDate>
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
              <SubCodeForAllowance RPH="1">0MJACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER6562SU MOW2250RUB8812END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="LEXRF/CH25" FareAmount="6562" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="EPXRF/CH25" FareAmount="2250" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
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
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="8815" CurrencyCode="RUB"/>
            <Endorsements>
              <Text>NONREF/HEBO3BPATEH</Text>
            </Endorsements>
            <Taxes TotalAmount="3000">
              <Tax Amount="3000" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            </Taxes>
            <TotalFare Amount="11815" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="CNN" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="LEXRF/CH25" FareAmount="6562" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="EPXRF/CH25" FareAmount="2250" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
          <BaggageProvisions RPH="4">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-29</DepartureDate>
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
              <Base Amount="2500" CurrencyCode="RUB"/>
              <Equiv Amount="2500" CurrencyCode="RUB"/>
              <TaxIndicator>X</TaxIndicator>
              <Total>2500</Total>
            </PriceInformation>
            <ProvisionType>C</ProvisionType>
            <RefundReissue>N</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2016-09-15</DepartureDate>
              <DepartureDate RPH="2">2016-09-29</DepartureDate>
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
              <SubCodeForAllowance RPH="1">0MJACSU</SubCodeForAllowance>
              <SubCodeForChargesOthers>0LNABSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <FareCalculation>
            <Text>MOW SU AER0SU MOW0RUB0END</Text>
          </FareCalculation>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="LEXRF/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <FareCalculationBreakdown>
            <Branch FirstJointCarrier="SU" PCC="9LSC"/>
            <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
            <FareBasis Cabin="Y" Code="EPXRF/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00" TripTypeInd="R"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
            <RuleCategoryIndicator>4</RuleCategoryIndicator>
            <RuleCategoryIndicator>6</RuleCategoryIndicator>
            <RuleCategoryIndicator>7</RuleCategoryIndicator>
            <RuleCategoryIndicator>8</RuleCategoryIndicator>
            <RuleCategoryIndicator>9</RuleCategoryIndicator>
            <RuleCategoryIndicator>10</RuleCategoryIndicator>
            <RuleCategoryIndicator>16</RuleCategoryIndicator>
            <RuleCategoryIndicator>18</RuleCategoryIndicator>
            <RuleCategoryIndicator>19</RuleCategoryIndicator>
          </FareCalculationBreakdown>
          <ItinTotalFare NonRefundableInd="N">
            <BaggageInfo>
              <NonUS_DOT_Disclosure>
                <Text>BAG ALLOWANCE     -SVOAER-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
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
              </NonUS_DOT_Disclosure>
            </BaggageInfo>
            <BaseFare Amount="0" CurrencyCode="RUB"/>
            <Endorsements>
              <Text>NONREF/HEBO3BPATEH</Text>
            </Endorsements>
            <Taxes TotalAmount="0"/>
            <TotalFare Amount="0" CurrencyCode="RUB"/>
          </ItinTotalFare>
          <PassengerTypeQuantity Code="INF" Quantity="1"/>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="LEXRF/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
          <PTC_FareBreakdown>
            <Cabin>Y</Cabin>
            <FareBasis Code="EPXRF/IN00" FareAmount="0" FarePassengerType="INF" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="IN00"/>
            <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          </PTC_FareBreakdown>
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
</EnhancedAirBookRS>
{% endxmlsec %}