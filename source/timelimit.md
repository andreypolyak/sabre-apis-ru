# Тайм-лимиты бронирований

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Тайм-лимит — это предельный срок, устанавливаемый перевозчиком для бронирования, до наступления которого должны быть оформлены авиабилеты. Если после наступления тайм-лимита для бронирования билеты не будут оформлены, перевозчик оставляет за собой право снять места (отменить сегменты).

Перевозчик может устанавливать тайм-лимит двумя способами:
- в тарифе при его файлировании
- в SSR сообщении, отправленном в бронирование

## Получение тайм-лимита

Тайм-лимит, установленный перевозчиком в тарифе, можно получить:
- при [поиске перелетов по заданным датам](shop.md) в ответе на запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), при [поиске перелетов по гибким датам](shop-alternate-dates.md) в ответе на запрос к сервису [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и при [проверке стоимости и наличия мест](revalidate-itinerary.md) в ответе на запрос к сервису [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary):
    - OTA ответ: значение атрибутов ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/@LastTicketDate``` (дата) и ```/@LastTicketTime``` (время)
    - GIR ответ: значение атрибутов ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/@LastTicketDate``` (дата) и ```/@LastTicketTime``` (время)
- при [создании бронирований в 1 шаг](create-booking-1step.md) в ответе на запрос к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) в виде значения элемента ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)
- при [создании бронирований в 2 шага](create-booking-2steps.md) в ответе на запрос к сервису [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) в виде значения элемента ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)
- при расчете стоимости бронирования в ответе на запрос к сервису [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/price_air_itinerary) в виде значения элемента ```/OTA_AirPriceRS/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)

Установленный в тарифе тайм-лимит будет указан в часовом поясе того города, к которому относится PCC, в котором производится поиск, бронирование или расчет стоимости.

Алгоритм получения тайм-лимита из SSR сообщений перевозчика:
1. Отправить запрос на чтение бронирование [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary)
2. Получить список SSR сообщений. Они будут находиться в последовательно расположенных элементах ```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo```
3. Отфильтровать SSR сообщения, которые имеют тип ```AFX``` (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/@Type```) и код ```OTHS``` или ```ADTK``` (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/Service/@SSR_Type```). В них могут находиться необходимые сообщения с тайм-лимитом
4. Для получения тайм-лимита из текста (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/Service/Text```) SSR сообщений сравнить их с известными шаблонами такого рода сообщений (см. ниже)

В некоторых случаях установленные в тарифе тайм-лимиты могут не совпадать с тайм-лимитами переданными в SSR сообщениях. Как правило перевозчики в этом случае предлагают считать тайм-лимитом более раннее время.

## Установка тайм-лимита при создании бронирования (PassengerDetailsRQ или CreatePassengerNameRecordRQ)

При создании бронирования одним из обязательных полей является поле тайм-лимита. Тайм-лимит указывается в запросе к сервису [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) в элементе ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/AgencyInfo/Ticketing``` или в запросе к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) в элементе ```/CreatePassengerNameRecordRQ/TravelItineraryAddInfo/AgencyInfo/Ticketing```.

В запросе необходимо указать:
- ```/@TicketType``` — тип тайм-лимита:
    - ```7TAW``` — бронирование готово к оформлению билетов
    - ```7TAX``` — бронирование **не** готово к оформлению билетов
    - ```7T-A``` — тайм-лимит не установлен (бронирование не попадет в очередь при наступлении времени тайм-лимита)

Дополнительно можно указать:
- ```/@PseudoCityCode``` — PCC, в очередь в котором должно быть помещено бронирование 
- ```/@QueueNumber``` — номер очереди, в которую должно быть помещено бронирование в случае наступления тайм-лимита
- ```/@TicketTimeLimit``` — время наступления тайм-лимита

Установленное время наступления тайм-лимита должно отвечать следующим требованиям:
- не быть раньше, чем текущее время
- не быть позже, чем время вылета для самого раннего сегмента в бронировании
- быть кратным одному часу. Например: ```01-31T23:00```

Если в запросе не было указано время тайм-лимита или время тайм-лимита меньше, чем через 2 часа, то бронирование будет перемещено в очередь немедленно. В противном случае бронирование будет помещено в очередь при наступлении тайм-лимита.

По умолчанию при наступлении тайм-лимита бронирование будет помещено в 9 (для ```7TAW```) или 10 (для ```7TAX```) очередь. В случае, если была указана другая очередь, то бронирование попадет в нее.

По умолчанию бронирование помещено в очередь в том PCC, в котором оно было создано. В случае, если был указан другой PCC, то бронирование попадет в очередь в этом PCC.

## Изменение тайм-лимита в бронировании (UpdatePassengerNameRecordRQ)

Для изменения тайм-лимита в бронировании, например, при получении SSR сообщения с новым временем, необходимо заново его добавить в бронирование при помощи сервиса [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record) (см. [Редактирование бронирований](edit-booking.md)).

В запросе необходимо указать:

- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/TravelItineraryAddInfo/AgencyInfo/Ticketing``` — тайм-лимит (см. выше)
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

Для изменения тайм-лимита в другом PCC его можно указать в качестве значения атрибута ```/UpdatePassengerNameRecordRQ/@targetCity```.

{% xmlsec "Пример запроса", false %}
<UpdatePassengerNameRecordRQ targetCity="2FRH" version="1.0.0" xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <Itinerary id="AUDBSP"/>
  <TravelItineraryAddInfo>
    <AgencyInfo>
      <Ticketing TicketTimeLimit="02-01T23:00" TicketType="7TAW"/>
    </AgencyInfo>
  </TravelItineraryAddInfo>
  <PostProcessing>
    <EndTransaction>
      <Source ReceivedFrom="API"/>
    </EndTransaction>
    <RedisplayReservation/>
  </PostProcessing>
</UpdatePassengerNameRecordRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2020-01-29T01:55:02.724-06:00"/>
  </ApplicationResults>
  <ItineraryRef ID="AUDBSP"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>EKATERINA</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
      </CustomerInfo>
      <ItineraryInfo>
        <ItineraryPricing>
          <PriceQuote RPH="1">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1054/29JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-01-29T10:54" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="58000" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="6008" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">608RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="64008" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="116000"/>
                    <Taxes>
                      <Tax Amount="12016"/>
                    </Taxes>
                    <TotalFare Amount="128016"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/YCLR"/>
                  <FareCalculation>
                    <Text>MOW SU AER29000SU MOW29000RUB58000END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="29000" FareBasisCode="YCLR" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="ADT">
                <PassengerData NameNumber="01.01">IVANOV/IVAN MR</PassengerData>
                <PassengerData NameNumber="02.01">IVANOVA/ELENA MS</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="2">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1054/29JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-01-29T10:54" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="43500" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="5704" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">5400YQ</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">304RI</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="49204" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="43500"/>
                    <Taxes>
                      <Tax Amount="5704"/>
                    </Taxes>
                    <TotalFare Amount="49204"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>NON-REF/SEE RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/CH25/YCLR/CH25"/>
                  <FareCalculation>
                    <Text>MOW SU AER21750SU MOW21750RUB43500END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/CH25"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="21750" FareBasisCode="YCLR/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="CH25">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="CNN">
                <PassengerData NameNumber="03.01">IVANOV/ANDREY</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuote RPH="3">
            <MiscInformation>
              <SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
                <Text>2FRH 9LSC*AWT 1054/29JAN20</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-01-29T10:54" TaxExempt="false" ValidatingCarrier="SU">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="0" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="0" TaxCode="TE"/>
                  </Taxes>
                  <TotalFare Amount="0" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="0"/>
                    <Taxes>
                      <Tax Amount="0"/>
                    </Taxes>
                    <TotalFare Amount="0"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPASU$MP-I$BREC$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - SU</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>RULES</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YCLR/IN00/YCLR/IN00"/>
                  <FareCalculation>
                    <Text>MOW SU AER0SU MOW0RUB0END</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1138"/>
                    <OriginLocation LocationCode="SVO"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-01</NotValidAfter>
                      <NotValidBefore>2020-09-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="01P"/>
                    <FareBasis Code="YCLR/IN00"/>
                    <MarketingAirline Code="SU" FlightNumber="1129"/>
                    <OriginLocation LocationCode="AER"/>
                    <ValidityDates>
                      <NotValidAfter>2020-09-08</NotValidAfter>
                      <NotValidBefore>2020-09-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SVO"/>
                  </FlightSegment>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="AER" Origin="MOW"/>
                    <Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="IN00">
                    <Location Destination="MOW" Origin="AER"/>
                    <Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</ResTicketingRestrictions>
                  <ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</ResTicketingRestrictions>
                </PTC_FareBreakdown>
              </AirItineraryPricingInfo>
            </PricedItinerary>
            <ResponseHeader>
              <Text>FARE - PRICE RETAINED</Text>
              <Text>FARE USED TO CALCULATE DISCOUNT</Text>
              <Text>FARE NOT GUARANTEED UNTIL TICKETED</Text>
            </ResponseHeader>
            <PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
              <PassengerInfo PassengerType="INF">
                <PassengerData NameNumber="04.01">IVANOVA/EKATERINA</PassengerData>
              </PassengerInfo>
              <TicketingInstructionsInfo/>
            </PriceQuotePlus>
          </PriceQuote>
          <PriceQuoteTotals>
            <BaseFare Amount="159500.00"/>
            <Taxes>
              <Tax Amount="17720.00"/>
            </Taxes>
            <TotalFare Amount="177220.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-29T01:54:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AER"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <SupplierRef ID="DCSU*AIQYAY"/>
              <UpdatedArrivalTime>09-01T10:15</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-01T07:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SVO</DepartureAirport>
                  <DepartureTerminalName>TERMINAL B - DOMESTIC</DepartureTerminalName>
                  <DepartureTerminalCode>B</DepartureTerminalCode>
                  <ArrivalAirport>AER</ArrivalAirport>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1138</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>150</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*AIQYAY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-01T07:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-01T10:15:00</ArrivalDateTime>
                  <FlightNumber>1138</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-29T01:54:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-01-29T01:54:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
              <Equipment AirEquipType="73H"/>
              <MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>MARKETED BY AEROFLOT</Banner>
              </MarketingAirline>
              <Meal Code="S"/>
              <OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
                <Banner>OPERATED BY AEROFLOT</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="SU"/>
              <DisclosureCarrier Code="SU" DOT="false">
                <Banner>AEROFLOT</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AER"/>
              <SupplierRef ID="DCSU*AIQYAY"/>
              <UpdatedArrivalTime>09-08T05:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>09-08T02:45</UpdatedDepartureTime>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AER</DepartureAirport>
                  <ArrivalAirport>SVO</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL B - DOMESTIC</ArrivalTerminalName>
                  <ArrivalTerminalCode>B</ArrivalTerminalCode>
                  <EquipmentType>73H</EquipmentType>
                  <MarketingAirlineCode>SU</MarketingAirlineCode>
                  <MarketingFlightNumber>1129</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MealCode>S</MealCode>
                  <ElapsedTime>155</ElapsedTime>
                  <AirMilesFlown>873</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="SU" DOT="false">
                    <Banner>AEROFLOT</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCSU*AIQYAY</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2020-09-08T02:45:00</DepartureDateTime>
                  <ArrivalDateTime>2020-09-08T05:20:00</ArrivalDateTime>
                  <FlightNumber>1129</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <SegmentBookedDate>2020-01-29T01:54:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW2FRH01FEB009/1100P/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="AUDBSP" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2020-01-29T01:54" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-01-29T01:55" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="3"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="26" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="9" RPH="001" Type="AFX">
        <Service SSR_Code="OSI">
          <PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</PersonName>
          <Text>AA INF</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="002" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="30" RPH="003" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="18" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="19" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="SU"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
          <ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
            <FreeText>INF</FreeText>
            <FullText>AA INF</FullText>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>EKATERINA</FirstName>
            <ReferenceId>4</ReferenceId>
            <NameRefNumber>04.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
          <ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-16" id="16"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-or-17" id="17"/>
        <OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1138</FlightNumber>
              <DepartureDate>2020-09-01</DepartureDate>
              <BoardPoint>SVO</BoardPoint>
              <OffPoint>AER</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB19</FreeText>
            <FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>SU</CarrierCode>
              <FlightNumber>1129</FlightNumber>
              <DepartureDate>2020-09-08</DepartureDate>
              <BoardPoint>AER</BoardPoint>
              <OffPoint>SVO</OffPoint>
              <ClassOfService>Y</ClassOfService>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM SU HK1/79851234567/RU</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>79851234567</PhoneNumber>
              <Language>RU</Language>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
              <Language>RU</Language>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>20NOV1980</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>IVAN</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>true</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>2234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15AUG2025</DocumentExpirationDate>
              <DateOfBirth>20JAN1980</DateOfBirth>
              <Gender>F</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>ELENA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>3234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>20NOV2025</DocumentExpirationDate>
              <DateOfBirth>15JAN2012</DateOfBirth>
              <Gender>M</Gender>
              <LastName>IVANOV</LastName>
              <FirstName>ANDREY</FirstName>
              <MiddleName>IVANOVICH</MiddleName>
              <Infant>false</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2019</DateOfBirth>
              <Gender>FI</Gender>
              <LastName>IVANOVA</LastName>
              <FirstName>EKATERINA</FirstName>
              <MiddleName>IVANOVNA</MiddleName>
              <Infant>true</Infant>
              <PrimaryDocHolderInd>false</PrimaryDocHolderInd>
              <HasDocumentData>true</HasDocumentData>
            </TravelDocument>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
          <Email comment="BC/" type="BC">
            <Address>AGENCY@AGENCY.COM</Address>
          </Email>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
          <Email comment="TO/" type="TO">
            <Address>CUSTOMER@CUSTOMER.COM</Address>
          </Email>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
      </OpenReservationElements>
    </TravelItinerary>
  </TravelItineraryRead>
</UpdatePassengerNameRecordRS>
{% endxmlsec %}

## Шаблоны сообщений от перевозчиков с тайм-лимитом

В данном разделе представлены шаблоны сообщений от перевозчиков, содержащие тайм-лимиты.

**Пожалуйста, обратите внимание на то, что представленный список может содержать ошибочные или неточные данные, поскольку содержимое сообщений может быть в любой момент изменено перевозчиком.**

*Мы будем благодарны за любые исправления и дополнения, отправленные по электронной почте по адресу andrey.polyak@sabre.com.*

*Данные также доступны для загрузки в формате [xlsx](https://andreypolyak.github.io/sabre-apis-ru/assets/data/Timelimit%20SSR%20templates.xlsx) и [csv](https://andreypolyak.github.io/sabre-apis-ru/assets/data/Timelimit%20SSR%20templates.csv).*

Таблица содержит 3 столбца:
- ***Авиакомпания*** — код авиакомпании, отправляющей SSR сообщения с таким шаблоном
- ***Часовой пояс*** — информация о часовом поясе времени тайм-лимита. Возможные значения:
    - *GMT* — часовой пояс GMT (время по Гринвичу)
    - *CST (GMT-6)* — часовой пояс CST (Central Standard Time)
    - *Город в сообщении* — используется часовой пояс того города, что указан в сообщении
    - *Штат в сообщении* — используется часовой пояс того штата в США, что указан в сообщении
    - *Страна в сообщении* — используется часовой пояс той страны, что указана в сообщении
    - *Не указан* — информация о часовом поясе не указана в сообщении
    - *Не требуется* — информация о часовом поясе не требуется, поскольку тайм-лимит указан, относительно текущего времени
- ***Шаблон*** — шаблон сообщения, присылаемого перевозчиком. Шаблон содержит постоянную часть и переменные, которые выделены фигурными скобками. Возможные названия переменных:
    - ```{yyyy}``` — год наступления тайм-лимита (4 цифры)
    - ```{yy}``` — год наступления тайм-лимита (2 цифры)
    - ```{MMM}``` — месяц наступления тайм-лимита (3 буквы)
    - ```{dd}``` — день наступления тайм-лимита (2 цифры)
    - ```{ddd}``` — день недели наступления тайм-лимита (3 буквы)
    - ```{HH}``` — час наступления тайм-лимита (2 цифры)
    - ```{+HH}``` — часов до наступления тайм-лимита (2 цифры)
    - ```{mm}``` — минуты наступления тайм-лимита (2 цифры)
    - ```{cty}``` — город или аэропорт часового пояса (3 буквы)
    - ```{country}``` — страна часового пояса (2 буквы)
    - ```{state}``` — штат США часового пояса (2 буквы)
    - ```{fltyy}``` — год вылета рейса (2 цифры)
    - ```{fltMMM}``` — месяц вылета рейса (3 буквы)
    - ```{fltdd}``` — день вылета рейса (2 цифры)
    - ```{fltnum}``` — номер рейса (1-4 цифры)
    - ```{cls}``` — класс бронирования рейса (1 буква)
    - ```{msgyy}``` — год отправки сообщения (2 цифры)
    - ```{msgMMM}``` — месяц отправки сообщения (3 буквы)
    - ```{msgMM}``` — месяц отправки сообщения (2 цифры)
    - ```{msgdd}``` — день отправки сообщения (2 цифры)
    - ```{msgHH}``` — часы отправки сообщения (2 цифры)
    - ```{msgmm}``` — минуты отправки сообщения (2 цифры)
    - ```{segstat}``` — статус сегмента (2 буквы)
    - ```{paxnum}``` — количество мест (1 цифра)
    - ```{*}``` — случайный символ (количество звездочек соответствует количеству символов)

| Авиакомпания | Часовой пояс | Шаблон |
| ------------ | ------------ | ------ |
| 3K  | GMT | ```1S SUBJ CXL ON/BEFORE {dd}{MMM} {HH}{mm}Z WITHOUT PAYMENT``` |
| 3U  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL 3U{fltnum} {cls}{fltdd}{fltMMM}``` |
| 4U  | GMT | ```1S TO 4U ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| 5N  | GMT | ```1S 5N-{fltnum}/{fltdd}{fltMMM}{fltyy} BY {dd}{MMM}/{HH}{mm}Z OR CNL``` |
| 5N  | GMT | ```1S TO 5N BY {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE CANCELLED``` |
| 6H  | Город в сообщении | ```1S TO 6H BY {cty}{HH}{mm}/{dd}{MMM} OTHERWISE WILL BE XLD``` |
| 7R  | GMT | ```1S TO 7R BY {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE CANCELLED``` |
| 8M  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| 8Q  | GMT | ```1S PLS ADTK OR CNL 8Q FLIGHT BY {dd}{MMM} {HH} {mm} GMT``` |
| 9U  | Город в сообщении | ```1S.ISSUE TICKETS BY {dd}{MMM} {HH}{mm} LT {cty} OR CANX``` |
| 9W  | Город в сообщении | ```1S TO 9W BY {dd}{MMM}{yy} {HH}{mm}{cty} {dd}{MMM}{yy} {HH}{mm}{country} ELSE WILL BE XXLD``` |
| A3  | Город в сообщении | ```1S AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY {dd}{MMM}{yy} {HH}{mm} {cty} LT``` |
| A3  | Город в сообщении | ```1S A3/OA AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY {dd}{MMM}{yy} {HH}{mm} {cty} LT``` |
| A9  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| AB  | GMT | ```1S AB WILL CXL OR SEND ADM IF NO TKT IS ISSUED BY {HH}{mm}GMT0/{dd}{MMM}{yy}``` |
| AC  | Страна в сообщении  | ```PLADV TICKET NBR BY {dd}{MMM}{yy} {HH}{mm}{country} TO AVOID``` |
| AD  | GMT | ```1S TO AD ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| AE  | Город в сообщении | ```1S PLS TKT BY {HH}{mm}/{dd}{MMM}{yy} {cty} OR ITIN WILL BE AUTO-CANCELED BY CI/AE``` |
| AF  | Не указан | ```1S TO AF BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| AH  | Город в сообщении | ```AA  AHTL/ PLS ADVS TKT BY {dd}{MMM}{yy} {HH} {mm} {cty} LT``` |
| AI  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY AI BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| AM  | Город в сообщении | ```PLS ADV TKT BY {dd}{MMM} {HH}{mm} {cty} OR PNR WILL BE CNL``` |
| AR  | CST (GMT-6) | ```1S PLS ADV TKNO BY {HH}{mm} {dd}{MMM} CST OR WILL XXL SET {msgdd}{msgMMM}{msgyy}``` |
| AT  | Не указан | ```1S ADTK BY {HH}{mm} LOCAL TIME/{dd}{MMM}{yyyy} OR SPACE WILL BE CXLD``` |
| AV  | GMT | ```1S PLEASE SEND AVTA TKNA BY {HH}{mm}/{dd}{MMM} GMT USING ATN ENTRY``` |
| AY  | Город в сообщении | ```1S IF NO TKT IS ISSUED BY {dd}{MMM}{yyyy}/{HH}{mm} {cty} TIME``` |
| AZ  | Город в сообщении | ```1S TO AZ BY {dd}{MMM} {HH}{mm} {cty} OR AZ FLTS WILL BE CNLD``` |
| AZ  | Не указан | ```1S TO AZ BY {dd}{MMM} OR AZ FLTS WILL BE CNLD``` |
| B2  | Не указан | ```1S PLS ADV TKTNUMBR FOR B2 BY {dd}{MMM} {HH}{mm} OR AUTOCNL``` |
| B2  | Не указан | ```1S PLS ADV TKTNUMBR FOR B2 IN {cls} CLASS BY {dd}{MMM} {HH}{mm} OR AUTOCNL``` |
| B6  | Штат в сообщении  | ```1S PLS TICKET OR CANCEL BY {dd}{MMM}{yy} {HH}{mm}{country}{state} PER GDS``` |
| B6  | Страна в сообщении  | ```1S PLS TKT BY {dd}{MMM}{yy} {HH}{mm}{country} PER B6 AND SU BILATERAL``` |
| BA  | Не указан | ```1S ATTN FROM BA - ENTER VALID TICKET NBR BY {dd}{MMM}{yy}``` |
| BA  | Не указан | ```1S AGT/BA PLS ENTER GENUINE TICKET NUMBER IN PNR BY {dd}{MMM}{yy}``` |
| BD  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL BD{fltnum} {cls}{fltdd}{fltMMM}``` |
| BG  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY BG BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| BJ  | GMT | ```1S PLS ADTK OR CNL BJ FLIGHT BY {HH} {mm} / {dd}{MMM} GMT``` |
| BT  | GMT | ```1S PLS ADTK BY {dd}{MMM}{yy} {HH}{mm}Z OR BT SPACE WILL BE CANCELLED``` |
| BT  | GMT | ```1S REMINDER PLS ADTK BY {dd}{MMM}{yy} {HH}{mm}Z OR BT SPACE WILL BE CANCELLED``` |
| CA  | Не указан | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL CA ALL SEGS``` |
| CA  | Не указан | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL CA NON-TKT SEGS``` |
| CI  | Город в сообщении | ```1S PLS TKT BY {HH}{mm}/{dd}{MMM}{yy} {cty} OR ITIN WILL BE AUTO-CANCELED BY CI/AE``` |
| CM  | Не указан | ```1S {segstat}{paxnum}. PLS SEND TKT NUMBER IN OSI/SSR {HH}{mm}/{dd}{MMM}``` |
| CX  | GMT | ```1S ADV TKT NBR TO CX/KA BY {dd}{MMM} {HH}{mm} GMT OR SUBJECT TO CANCEL``` |
| CX  | GMT | ```1S ADV TKT NBR TO CX/KA BY {dd}{MMM} GMT {HH}{mm} OR SUBJECT TO CANCEL``` |
| CZ  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL CZ BOOKING``` |
| DE  | GMT | ```1S PLS ISSUE TIX FOR ALL DE/MT/HQ/DK SEGMENTS UNTIL {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED/ {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| DK  | GMT | ```1S PLS ISSUE TIX FOR ALL DE/MT/HQ/DK SEGMENTS UNTIL {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED/ {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| DL  | Город в сообщении | ```AA {segstat}{paxnum}. PLS TKT BY {HH}{mm} {dd}{MMM}{yy} {cty}``` |
| DL  | Город в сообщении | ```1S {segstat}{paxnum}. PLS TKT BY {HH}{mm} {dd}{MMM}{yy} {cty}``` |
| DV  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY DV BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| EK  | Город в сообщении | ```AA  RITK/ADTKT BY {dd}{MMM} {HH}{mm} {cty} LT``` |
| EK  | Город в сообщении | ```AA  RITK/ADTKT BY {dd}{MMM} {HH}{mm} {cty} LT ELSE BKG WILL BE XXLD``` |
| EL  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY EL BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| EW  | GMT | ```1S TO EW ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| EY  | Город в сообщении | ```1S ADTK BY {dd}{MMM}{yy} {HH}{mm} {cty} LT OR EY SPACE WILL BE CXLD``` |
| F9  | GMT | ```1S TO F9 ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| FB  | Не указан | ```1S ADTK BY {HH}{mm} LOCAL TIME/{dd}{MMM}{yyyy} OR SPACE WILL BE CXLD``` |
| FI  | GMT | ```1S PLS ADV TKT NBRS LATEST {dd}{MMM}{yy} {HH}{mm} GMT FI SEGMENTS OR ACC TO FARERULE IF EARLIER``` |
| FJ  | GMT | ```1S PLS ADTK ADV FJ TKTG DETAILS BY {dd}{MMM}{yy} {HH}{mm}Z``` |
| FM  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL FM{fltnum} {cls}{fltdd}{fltMMM}``` |
| G3  | GMT | ```1S SUBJ CXL ON/BEFORE {dd}{MMM} {HH}{mm}Z WITHOUT PAYMENT``` |
| GA  | Не указан | ```ADTK 1S TO GA BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| GF  | GMT | ```1S BY {dd}{MMM}{yy} {HH}{mm}GMT OR GF WILL CANCEL``` |
| GS  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL GS{fltnum} {cls}{fltdd}{fltMMM}``` |
| H1  | GMT | ```1S PLS ISSUE TKT AND ADV TKT NUMBER LATEST BY {dd}{MMM}{yy} {HH}{mm}Z OTHERWISE THIS PNR WILL BE CXLD WITHOUT ANY FURTHER NOTIFICATION``` |
| HO  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL HO{fltnum} {cls}{fltdd}{fltMMM}``` |
| HQ  | GMT | ```1S PLS ISSUE TIX FOR ALL DE/MT/HQ/DK SEGMENTS UNTIL {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED/ {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| HU  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL HU{fltnum} {cls}{fltdd}{fltMMM}``` |
| HX  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL HX{fltnum} {cls}{fltdd}{fltMMM}``` |
| HY  | Город в сообщении | ```1S.ISSUE TICKETS BY {dd}{MMM} {HH}{mm} LT {cty} OR CANX``` |
| HZ  | GMT | ```1S TO HZ BY {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE CANCELLED``` |
| IB  | GMT | ```1S IB REMINDS YOU TO ISSUE AND ADV E-TKT IN PNR BY {dd}{MMM}{yyyy} {HH}{mm} GMT0``` |
| IG  | GMT | ```1S.ISSUE TICKETS BY {dd}{MMM} {HH}{mm} LT {cty} OR CANX``` |
| IZ  | GMT | ```1S IZ PLZ PAY BY {dd}{MMM}{yy} {HH}{mm} GMT TO AVOID CANCELLATION``` |
| J2  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY J2 BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| JD  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL JD{fltnum} {cls}{fltdd}{fltMMM}``` |
| JL  | Не указан | ```AA JL {cls}-CLS BY XX {dd}{MMM} XX USING SSR OR WILL BE XLD``` |
| JP  | Не указан | ```1S PLS TKT BY {HH}{mm}/{dd}{MMM}{yy} OR ITIN WILL BE AUTO-CANCELED BY JP``` |
| JU  | Не указан | ```1S {****} ROBOTAUTO-PROCESS {dd}{MMM}{yyyy}/{HH}{mm} - SET {msgMM}/{msgdd}/{msgyy} {msgHH}{msgmm}``` |
| K6  | Город в сообщении | ```1S PLEASE TICKET OR CANX BY {dd}{MMM}{yy} {HH}{mm}{cty}``` |
| KA  | GMT | ```1S ADV TKT NBR TO CX/KA BY {dd}{MMM} {HH}{mm} GMT OR SUBJECT TO CANCEL``` |
| KA  | GMT | ```1S ADV TKT NBR TO CX/KA BY {dd}{MMM} GMT {HH}{mm} OR SUBJECT TO CANCEL``` |
| KC  | Город в сообщении | ```1S UNTIL {dd}{MMM}{yyyy}/{HH}{mm}/{cty}//{dd}{MMM}{yyyy}/{HH}{mm}/{cty} OR XXLD``` |
| KE  | Город в сообщении | ```1S TO KE BY {dd}{MMM} {HH}{mm} {cty} OTHERWISE WILL BE XLD``` |
| KK  | Город в сообщении | ```1S TO KK BY {cty}{HH}{mm}/{dd}{MMM} OTHERWISE WILL BE XLD``` |
| KL  | GMT | ```1S TO KL BY {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE WILL BE XXLD``` |
| KM  | Не указан | ```1S KM SECTORS EXPIRE ON {dd}{MMM}``` |
| KQ  | GMT | ```1S TO KQ BY {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE WILL BE XXLD``` |
| KQ  | GMT | ```1S TO KQ/KL BY {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE WILL BE XXLD``` |
| LA  | Город в сообщении | ```1S PLS ADV TKT NBR BEFORE {dd}{MMM}{yy} {HH}{mm} {cty} LT OR AUTO CNL``` |
| LH  | GMT | ```1S PLS ISS AUTOMATIC TKT BY {dd}{MMM}{yy}/{HH}{mm}Z OR LH OPTG/MKTG SEGS WILL BE XLD. APPLIC FARE RULE APPLIES IF ITDEMANDS EARLIER TKTG.``` |
| LO  | Не указан | ```1S PLS ISSUE TKT BY {HH}{mm}/{dd}{MMM} OR LO ITIN WILL BE CXLD``` |
| LX  | GMT | ```1S PLS ADV TKT NBR FOR ITIN BY {dd}{MMM}{yy}/{HH}{mm}Z OR LX OPTG/MKTG FLTS WILL BE CNLD  {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| LY  | Не указан | ```1S ADTK TO LY BY {dd}{MMM}{yyyy}/{HH}{mm} OR SPACE WILL BE CXLD AUTOMATICALLY``` |
| MF  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL MF{fltnum} {cls}{fltdd}{fltMMM}``` |
| MH  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY MH BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| MI  | Не указан | ```1S TO MI BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| MK  | Не указан | ```1S PLS ADV TKT NO BY {HH}{mm}/{dd}{MMM}{yyyy} OR MK WILL CXL.``` |
| MS  | Не указан | ```1S TO MS BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| MT  | GMT | ```1S PLS ISSUE TIX FOR ALL DE/MT/HQ/DK SEGMENTS UNTIL {dd}{MMM}{yy}/{HH}{mm}Z OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED/ {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| MU  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL MU{fltnum} {cls}{fltdd}{fltMMM}``` |
| NH  | Город в сообщении | ```1S TO NH BY {dd}{MMM} {HH}{mm} {cty} TIME ZONE OTHERWISE WILL BE XLD``` |
| NT  | Город в сообщении | ```1S ADTK BY {HH}{mm} {cty}/{dd}{MMM}{yy} OR NT SPACE WILL BE CXLD``` |
| NX  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL NX{fltnum} {cls}{fltdd}{fltMMM}``` |
| OD  | Город в сообщении | ```1S SS/{cty}  {HH}{mm}/{dd}{MMM}``` |
| OK  | GMT | ```1S OK CANCELS IF NO TKT ADVISED BY {dd}{MMM} {HH}{mm}UTC``` |
| OK  | Не указан | ```1S KK1 TO OK BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE CANCELLED``` |
| OM  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY OM BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| OS  | GMT | ```1S PLS ADV TKT NBRS OF OS SEG LATEST {dd}{MMM}{yy} {HH}{mm}GMT OR SEG WILL BE CANX``` |
| OY  | GMT | ```1S TO OY ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| OY  | GMT | ```SUBJ CXL ON/BEFORE {dd}{MMM} {HH}{mm}Z WITHOUT PAYMENT``` |
| OZ  | Не указан | ```1S TO OZ BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| PC  | GMT | ```1S ADV TKNE OR XX BY {dd}{MMM} {HH} {mm} GMT``` |
| PG  | Город в сообщении | ```1S ADV TKTNBR BY {dd}{MMM}{yy} {HH}{mm} {cty} OR SEG WILL BE CXLD``` |
| PN  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL PN{fltnum} {cls}{fltdd}{fltMMM}``` |
| PR  | Город в сообщении | ```1S ADV TKT BY {dd}{MMM}{yy} {HH}{mm} {cty} OR SEG WILL BE CXLD``` |
| PS  | Не указан | ```1S TO PS BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| PS  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY PS BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| QF  | Не указан | ```1S ADTK NO LATER THAN {dd}{MMM} TO AVOID CANCELLATION``` |
| QR  | Не указан | ```1S PLS TICKET BY {HH}{mm}/{dd}{MMM}{yyyy} LCLT AT BOARD POINT OR QR WILL CXL``` |
| QS  | Город в сообщении | ```1S TO QS BY {dd}{MMM} {HH}{mm} {cty} TIME ZONE OTHERWISE WILL BE XLD``` |
| R3  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY R3 BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| RJ  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E OR FA NOT RCVD BY RJ BY {dd}{MMM}{yy} {HH}{mm} {cty} LT``` |
| RJ  | Не указан | ```1S TO RJ BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| RO  | Не указан | ```1S ADTK BY {HH}{mm}/{dd}{MMM}{yyyy} OR RO SPACE WILL BE CXLD``` |
| RS  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY RS BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| S4  | Город в сообщении | ```1S ADTK BY {HH}{mm} {cty}/{dd}{MMM}{yy} OR SP-S4 SPACE WILL BE CXLD``` |
| S7  | Город в сообщении | ```1S.ISSUE TKT BY {dd}{MMM} {HH}{mm} LT {cty} OR PNR WILL BE CXLD``` |
| S7  | Не указан | ```1S TO  S7  BY {dd}{MMM} OTHERWISE WILL BE XLD``` |
| SA  | Не указан | ```SSR OTHS 1S PLS ADV TKT NO BY {HH}{mm}/{dd}{MMM}{yyyy} MOW OR SAA WILL CXL``` |
| SK  | Город в сообщении | ```1S ADTK WITHIN TKT DEADLINE OR SK WILL CNL AT {HH}{mm} {cty}/{dd}{MMM}{yy}``` |
| SN  | GMT | ```1S PLS ADV TKT NBR FOR ITIN BY {dd}{MMM}{yy}/{HH}{mm}Z OR SN OPTG/MKTG FLTS WILL BE CNLD  {msgdd}{msgMMM}{msgyy}{msgHH}{msgmm}``` |
| SP  | Город в сообщении | ```1S ADTK BY {HH}{mm} {cty}/{dd}{MMM}{yy} OR SP-S4 SPACE WILL BE CXLD``` |
| SQ  | Не указан | ```1S TO SQ BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| ST  | GMT | ```1S AUTO XX IF SSR TKNE NOT RCVD BY {HH}{mm}/{dd}{MMM}/UTC``` |
| SU  | Не указан | ```1S ATTN LAST DAY FOR TICKETING {dd}{MMM}{yy} OR PNR WILL BE CNLD``` |
| SU  | Не требуется  | ```1S ATTN TKT MUST BE COMPLETED WITHIN {+HH} HOURS AFTER RES``` |
| SU  | Не требуется  | ```1S ATTN CRT FLT TKT MUST BE COMPLETED WITHIN {+HH}H AFTER RES``` |
| SU  | Город в сообщении | ```1S ADV TKT BY {HH}{mm} {cty} {dd}{MMM} OR PNR WILL BE CXLD``` |
| SU  | Не указан | ```1S ATTN CRIT FLT LAST DAY FOR TICKETING {dd}{MMM}``` |
| SU  | Город в сообщении | ```1S SS/{cty}  {HH}{mm}/{dd}{MMM}-{ddd}``` |
| SV  | Не указан | ```1S TO SV BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| SW  | GMT | ```1S PLS ADTK OR CNL SW FLIGHT BY {dd}{MMM} {HH} {mm} GMT``` |
| SX  | GMT | ```1S AUTO XX IF SSR TKNE NOT RCVD BY {HH}{mm}/{dd}{MMM}/UTC``` |
| TA  | GMT | ```1S PLEASE SEND AVTA TKNA BY {HH}{mm}/{dd}{MMM} GMT USING ATN ENTRY``` |
| TG  | Не указан | ```1S TO TG BY {dd}{MMM} {HH}{mm} OTHERWISE WILL BE XLD``` |
| TK  | Не указан | ```AA TO  TK BY {dd}{MMM} {HH}{mm} IRC-2/ADV OTO TKT``` |
| TK  | Не указан | ```AA TO  TK BY {dd}{MMM} {HH}{mm} IRC-2/ADV MORE TKT``` |
| TN  | Город в сообщении | ```1S PLS TKT BY {HH}{mm}/{dd}{MMM}{yy} {cty} OR ITIN WILL BE AUTO-CANCELED BY TN``` |
| TP  | Город в сообщении | ```1S ADTK BY {HH}{mm} {cty}/{dd}{MMM}{yy} OR TP SPACE WILL BE CXLD``` |
| TR  | GMT | ```1S SUBJ CXL ON/BEFORE {dd}{MMM} {HH}{mm}Z WITHOUT PAYMENT``` |
| TR  | GMT | ```1S TO TR ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| U6  | Город в сообщении | ```1S PLS ISSUE TKT BY {HH}{mm} {dd}{MMM}{yy}/{cty} OR SUBJECT TO AUTOCXL BY U6``` |
| UA  | Не указан | ```1S {segstat}{paxnum}.TKT UASEGS BY {dd}{MMM}{yy} TO AVOID AUTO CXL /EARLIER``` |
| UL  | Город в сообщении | ```1S PLS TKT BY {HH}{mm}/{dd}{MMM}/{cty} OR ITIN WILL BE AUTO-CANCELED BY UL``` |
| UT  | GMT | ```1S UT-{fltnum}/{fltdd}{fltMMM}{fltyy} BY {dd}{MMM}/{HH}{mm}Z OR CNL``` |
| UT  | GMT | ```1S TO UT BY {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE CANCELLED``` |
| UX  | Не указан | ```1S PLS REMEMBER TO ADTK BY {HH}{mm}/{dd}{MMM}{yyyy} OR XX PNR/ UXSPCTRL``` |
| VN  | Город в сообщении | ```1S ADV TKT BY {dd}{MMM}{yy} {HH}{mm}{cty}RU OR WL BE CXLD``` |
| VS  | Не указан | ```1S {segstat}{paxnum}.UNTKTDVS SEGS MAY CANX {dd}{MM}{yy}``` |
| VT  | Город в сообщении | ```1S AUTO XX IF SSR TKNA/E/M/C NOT RCVD BY VT BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| VX  | CST (GMT-6) | ```1S ADV TKT NBR BEFORE {dd}{MMM}{yy} {HH}{mm} CST OR VX SEG WILL BE CXL``` |
| VY  | GMT | ```1S TO VY ON/BEFORE {dd}{MMM} {HH}{mm}Z OTHERWISE WILL BE XLD``` |
| W2  | GMT | ```1S AUTO XX IF SSR TKNE NOT RCVD BY {HH}{mm}/{dd}{MMM}/UTC``` |
| XQ  | Город в сообщении | ```1S ADTK OR BKG WILL BE CNLD BY {HH}{mm}/{dd}{MMM}/{cty} LT``` |
| YE  | GMT | ```1S AUTO XX IF SSR TKNE NOT RCVD BY {HH}{mm}/{dd}{MMM}/UTC``` |
| ZH  | Город в сообщении | ```1S BY {cty}{dd}{MMM}{yy}/{HH}{mm} OR CXL ZH{fltnum} {cls}{fltdd}{fltMMM}``` |
| ZM  | GMT | ```1S ADV TKNE OR XX BY {dd}{MMM} {HH} {mm} GMT``` |
