---
title: Получение карты мест в салоне
---

{{< hint warning >}}
Для получения карты мест в салоне в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для получения карты мест используется сервис [EnhancedSeatMapRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/seat_map).

В запросе необходимо указать:
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/RequestType``` — тип запроса, всегда ```Payload```
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/Flight/@origin``` и ```/@destination``` — код аэропортов вылета и прилета
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/Flight/DepartureDate``` — дата вылета
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/Flight/Marketing``` — номер рейса
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/Flight/Marketing/@carrier``` — код маркетингового перевозчика
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/CabinDefinition/RBD``` — класс бронирования
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/FareAvailQualifiers``` — пассажир в бронировании:
    - ```/@fareBasisCode``` — код тарифа, к которому относится текущий сегмент
    - ```/@passengerType``` — код категории пассажира
    - ```/@accompaniedByInfantInd``` — признак путешествия с младенцем без места
    - ```/TravellerID``` — номер пассажира в бронировании (```1.1```, ```2.1```, и т.д.)
- ```/EnhancedSeatMapRQ/SeatMapQueryEnhanced/POS/PCC``` — текущий PCC, для которого нужно получить карту мест в салоне

Обратите внимание на то, что карта мест в салоне запрашивается для каждого сегмента в бронировании по отдельности.

{{< details title="Пример запроса" >}}
```XML
<EnhancedSeatMapRQ version="6.0.0" xmlns="http://stl.sabre.com/Merchandising/v6">
  <SeatMapQueryEnhanced>
    <RequestType>Payload</RequestType>
    <Flight destination="AUH" origin="SYD">
      <DepartureDate>2022-12-01</DepartureDate>
      <Marketing carrier="EY">2463</Marketing>
    </Flight>
    <CabinDefinition>
      <RBD>Y</RBD>
    </CabinDefinition>
    <FareAvailQualifiers accompaniedByInfantInd="true" fareBasisCode="YLWF2AU" passengerType="ADT">
      <TravellerID>1.1</TravellerID>
    </FareAvailQualifiers>
    <FareAvailQualifiers accompaniedByInfantInd="false" fareBasisCode="YLWF2AU" passengerType="ADT">
      <TravellerID>2.1</TravellerID>
    </FareAvailQualifiers>
    <FareAvailQualifiers accompaniedByInfantInd="false" fareBasisCode="YLWF2AUCH" passengerType="CNN">
      <TravellerID>3.1</TravellerID>
    </FareAvailQualifiers>
    <POS>
      <PCC>9LSC</PCC>
    </POS>
  </SeatMapQueryEnhanced>
</EnhancedSeatMapRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<EnhancedSeatMapRS xmlns="http://stl.sabre.com/Merchandising/v6" xmlns:ns2="http://opentravel.org/common/message/v02" xmlns:ns3="http://services.sabre.com/STL_Payload/v02_00" xmlns:ns4="http://services.sabre.com/STL/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://stl.sabre.com/Merchandising/diagnostics/v1">
  <ns3:ApplicationResults status="Complete"/>
  <SeatMap changeOfGaugeInd="false">
    <Equipment>789</Equipment>
    <Flight destination="AUH" origin="SYD">
      <DepartureDate>2022-12-01</DepartureDate>
      <Operating carrier="EY">2463</Operating>
      <Marketing carrier="EY">2463</Marketing>
    </Flight>
    <FareAvailQualifiers accompaniedByInfantInd="true" fareBasisCode="YLWF2AU" fareComponentID="1" passengerType="ADT">
      <TravellerID>1.1</TravellerID>
      <FareBreakCriteria PrivateTariffIndicatorInd="false" fareBasisCode="YLWF2AU" fareComponentID="1"/>
    </FareAvailQualifiers>
    <FareAvailQualifiers accompaniedByInfantInd="false" fareBasisCode="YLWF2AU" fareComponentID="1" passengerType="ADT">
      <TravellerID>2.1</TravellerID>
      <FareBreakCriteria PrivateTariffIndicatorInd="false" fareBasisCode="YLWF2AU" fareComponentID="1"/>
    </FareAvailQualifiers>
    <FareAvailQualifiers accompaniedByInfantInd="false" fareBasisCode="YLWF2AUCH" fareComponentID="2" passengerType="CNN">
      <TravellerID>3.1</TravellerID>
      <FareBreakCriteria PrivateTariffIndicatorInd="false" fareBasisCode="YLWF2AUCH" fareComponentID="2"/>
    </FareAvailQualifiers>
    <Cabin classLocation="Maindeck" firstRow="15" lastRow="37" seatOccupationDefault="Free">
      <CabinClass>
        <CabinType>ECONOMY</CabinType>
        <RBD>Y</RBD>
        <MarketingDescription>PRICE PER SEAT:RUB 0,RUB 8960</MarketingDescription>
      </CabinClass>
      <Row>
        <RowNumber>15</RowNumber>
        <RowFacility>
          <Location>Front</Location>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
        </RowFacility>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>SeatWithBassinetFacility</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>SeatWithBassinetFacility</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>SeatWithBassinetFacility</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>16</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>17</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>18</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>19</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>20</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>21</RowNumber>
        <RowFacility>
          <Location>Rear</Location>
          <Facility>
            <Characteristics>Lavatory</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
        </RowFacility>
        <RowFacility>
          <Location>Rear</Location>
          <Facility>
            <Characteristics>Galley</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Galley</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
        </RowFacility>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>OverWingSeat(S)</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_2</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>22</RowNumber>
        <Type>RowDoesNotExist</Type>
      </Row>
      <Row>
        <RowNumber>23</RowNumber>
        <RowFacility>
          <Location>Front</Location>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Bulkhead</Characteristics>
            <Location>CenterSection</Location>
          </Facility>
        </RowFacility>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>SeatWithBassinetFacility</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>BulkheadSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
      </Row>
      <Row>
        <RowNumber>24</RowNumber>
        <Type>ExitRow</Type>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="true" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>ExitRowSeat</Detail>
          </Location>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>NotAllowedForMedical</Detail>
          </Limitations>
          <Facilities>
            <Detail>LegSpaceSeat</Detail>
          </Facilities>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY SPACE</CommercialName>
            <OfferItemId>offerItem_1</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">8960</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>25</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>26</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>27</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>28</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>29</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>30</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>31</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>32</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>33</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>34</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>35</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>36</RowNumber>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Row>
        <RowNumber>37</RowNumber>
        <RowFacility>
          <Location>Rear</Location>
          <Facility>
            <Characteristics>Lavatory</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Lavatory</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
        </RowFacility>
        <RowFacility>
          <Location>Rear</Location>
          <Facility>
            <Characteristics>Galley</Characteristics>
            <Location>LeftSideSection</Location>
          </Facility>
          <Facility>
            <Characteristics>Galley</Characteristics>
            <Location>RightSideSection</Location>
          </Facility>
        </RowFacility>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>A</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>B</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>C</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>LeftSideOfAircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>D</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>E</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_5</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>G</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>CenterSectionSeat(S)</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="true" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>H</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>AisleSeat</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>NotAllowedForInfants</Detail>
          </Limitations>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_4</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
        <Seat chargeableInd="false" exitRowInd="false" inoperativeInd="true" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>J</Number>
          <Location>
            <Detail>NoSeatAtThisLocation</Detail>
          </Location>
        </Seat>
        <Seat chargeableInd="true" exitRowInd="false" inoperativeInd="false" noInfantInd="false" occupiedInd="false" premiumInd="false" restrictedReclineInd="false">
          <Number>K</Number>
          <Occupation>
            <Detail>SeatIsFree</Detail>
          </Occupation>
          <Location>
            <Detail>Window</Detail>
          </Location>
          <Location>
            <Detail>RightSideOf Aircraft</Detail>
          </Location>
          <Limitations>
            <Detail>SeatToBeLeftVacant/OfferedLast</Detail>
          </Limitations>
          <Facilities>
            <Detail>ChargeableSeat</Detail>
          </Facilities>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>1.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>2.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
          <Offer entitledInd="true">
            <CommercialName>ECONOMY STANDARD</CommercialName>
            <OfferItemId>offerItem_3</OfferItemId>
            <TravellerID>3.1</TravellerID>
            <Price>
              <TotalAmount currencyCode="RUB">0</TotalAmount>
            </Price>
          </Offer>
        </Seat>
      </Row>
      <Wing firstRow="15" lastRow="21"/>
      <Column>
        <Column>A</Column>
        <Characteristics>Window</Characteristics>
      </Column>
      <Column>
        <Column>B</Column>
      </Column>
      <Column>
        <Column>C</Column>
        <Characteristics>Aisle</Characteristics>
      </Column>
      <Column>
        <Column>D</Column>
        <Characteristics>Aisle</Characteristics>
      </Column>
      <Column>
        <Column>E</Column>
      </Column>
      <Column>
        <Column>G</Column>
        <Characteristics>Aisle</Characteristics>
      </Column>
      <Column>
        <Column>H</Column>
        <Characteristics>Aisle</Characteristics>
      </Column>
      <Column>
        <Column>J</Column>
      </Column>
      <Column>
        <Column>K</Column>
        <Characteristics>Window</Characteristics>
      </Column>
    </Cabin>
    <OfferId>ce847dccc4b6fk9nbl3ebgpta0</OfferId>
  </SeatMap>
</EnhancedSeatMapRS>
```
{{< /details >}}

## Расшифровка характеристик мест в салоне

Возможные варианты характеристик мест в салоне (а также рядов, салонов и др.) описаны в [схеме сервиса](http://files.developer.sabre.com/wsdl/sabreXML1.0.00/Merchandising/EnhancedSeatMap_6_0_0.xsd) EnhancedSeatMapRQ. В схеме указано описание характеристик, а также указаны соответствующие коды стандарта [PADIS](https://www.google.com/search?q=site%3Aiata.org+padis) (Passenger and Airport Data Interchange Standards), устанавливаемый IATA.
