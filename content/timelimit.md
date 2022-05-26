---
title: Тайм-лимиты бронирований
---

{{< toc >}}

## Введение

Тайм-лимит — это предельный срок, устанавливаемый перевозчиком для бронирования, до наступления которого должны быть оформлены авиабилеты. Если после наступления тайм-лимита для бронирования билеты не будут оформлены, перевозчик оставляет за собой право снять места (отменить сегменты).

Перевозчик может устанавливать тайм-лимит двумя способами:
- в тарифе при его файлировании
- в SSR сообщении, отправленном в бронирование

## Получение тайм-лимита

Тайм-лимит, установленный перевозчиком в тарифе, можно получить:
- при [поиске перелетов по заданным датам](shop.html) в ответе на запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max), при [поиске перелетов по гибким датам](shop-alternate-dates.html) в ответе на запрос к сервису [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) и при [проверке стоимости и наличия мест](revalidate-itinerary.html) в ответе на запрос к сервису [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary):
    - OTA ответ: значение атрибутов ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/@LastTicketDate``` (дата) и ```/@LastTicketTime``` (время)
    - GIR ответ: значение атрибутов ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/@LastTicketDate``` (дата) и ```/@LastTicketTime``` (время)
- при [создании бронирований в 1 шаг](create-booking-1step.html) в ответе на запрос к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) в виде значения элемента ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)
- при [создании бронирований в 2 шага](create-booking-2steps.html) в ответе на запрос к сервису [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) в виде значения элемента ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)
- при расчете стоимости бронирования в ответе на запрос к сервису [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/price_air_itinerary) в виде значения элемента ```/OTA_AirPriceRS/PriceQuote/MiscInformation/HeaderInformation/LastTicketingDate``` (дата и время)

Установленный в тарифе тайм-лимит будет указан в часовом поясе того города, к которому относится PCC, в котором производится поиск, бронирование или расчет стоимости.

Алгоритм получения тайм-лимита из SSR сообщений перевозчика:
1. Отправить запрос на чтение бронирование [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/get_itinerary)
2. Получить список SSR сообщений. Они будут находиться в последовательно расположенных элементах ```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo```
3. Отфильтровать SSR сообщения, которые имеют тип ```AFX``` (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/@Type```) и код ```OTHS``` или ```ADTK``` (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/Service/@SSR_Type```). В них могут находиться необходимые сообщения с тайм-лимитом
4. Для получения структурированной информации о тайм-лимите из текста (```/TravelItineraryReadRS/TravelItinerary/SpecialServiceInfo/Service/Text```) SSR сообщения требуется проверить их при помощи регулярных выражений из [списка](timelimit.html#регулярные-выражения-для-поиска-сообщений-с-тайм-лимитом-от-перевозчиков) в данном разделе

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

Для изменения тайм-лимита в бронировании, например, при получении SSR сообщения с новым временем, необходимо заново его добавить в бронирование при помощи сервиса [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record) (см. [Редактирование бронирований](edit-booking.html)).

В запросе необходимо указать:

- ```/UpdatePassengerNameRecordRQ/Itinerary/@id``` — код бронирования (PNR Record Locator)
- ```/UpdatePassengerNameRecordRQ/TravelItineraryAddInfo/AgencyInfo/Ticketing``` — тайм-лимит (см. выше)
- ```/UpdatePassengerNameRecordRQ/PostProcessing/EndTransaction/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования
- ```/UpdatePassengerNameRecordRQ/PostProcessing/RedisplayReservation``` — получение в ответе обновленного состояния бронирования

Для выполнения операции в другом PCC его можно указать в качестве значения атрибута ```/UpdatePassengerNameRecordRQ/@targetCity```.

Дополнительно можно запросить проверку минимального стыковочного времени, указав значение ```true``` у атрибута ```/UpdatePassengerNameRecordRQ/@haltOnInvalidMCT```. В случае наличия в бронировании сегментов с нарушением правил минимального стыковочного времени, сервис прервет выполнение запроса и вернет ошибку. Бронирование в этом случае сохранено не будет.

{{< details title="Пример запроса" >}}
```XML
<UpdatePassengerNameRecordRQ haltOnInvalidMCT="true" targetCity="2FRH" version="1.1.0" xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <Itinerary id="TGNUYC"/>
  <TravelItineraryAddInfo>
    <AgencyInfo>
      <Ticketing TicketTimeLimit="05-23T23:00" TicketType="7TAW"/>
    </AgencyInfo>
  </TravelItineraryAddInfo>
  <PostProcessing>
    <EndTransaction>
      <Source ReceivedFrom="API"/>
    </EndTransaction>
    <RedisplayReservation/>
  </PostProcessing>
</UpdatePassengerNameRecordRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<UpdatePassengerNameRecordRS xmlns="http://services.sabre.com/sp/updatereservation/v1_1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns14="http://services.sabre.com/sp/preferences/v1" xmlns:ns15="http://services.sabre.com/STL/v01" xmlns:ns16="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://opentravel.org/common/message/v02" xmlns:ns5="http://opentravel.org/common/v02" xmlns:ns6="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2022-05-23T08:41:42.983-05:00"/>
  </ApplicationResults>
  <ItineraryRef ID="TGNUYC"/>
  <TravelItineraryRead>
    <TravelItinerary>
      <CustomerInfo>
        <ContactNumbers>
          <ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
          <ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
        </ContactNumbers>
        <PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-3.1">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</Email>
          <GivenName>IVAN MR</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-5.2">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ELENA MS</GivenName>
          <Surname>IVANOVA</Surname>
        </PersonName>
        <PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-7.3">
          <Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</Email>
          <GivenName>ANDREY</GivenName>
          <Surname>IVANOV</Surname>
        </PersonName>
        <PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-9.4">
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="1" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="4099.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="184455" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="18041" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2700AU</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">6678GB</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="202496" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="8198.00"/>
                    <EquivFare Amount="368910"/>
                    <Taxes>
                      <Tax Amount="36082"/>
                    </Taxes>
                    <TotalFare Amount="404992"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="ADT" Quantity="02"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AU/YLWF2AU/YLXF2AU/YLXF2AU"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1531.08EY X/AUH Q25.00EY SYD1504.72NUC3085.80END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AU"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="153108" FareBasisCode="YLWF2AU" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="150472" FareBasisCode="YLXF2AU" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="2" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="3091.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="139095" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="8663" TaxCode="XT"/>
                    <TaxBreakdownCode TaxPaid="false">2816WY</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">174ZR</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">1216F6</TaxBreakdownCode>
                    <TaxBreakdownCode TaxPaid="false">4457UB</TaxBreakdownCode>
                  </Taxes>
                  <TotalFare Amount="147758" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="3091.00"/>
                    <EquivFare Amount="139095"/>
                    <Taxes>
                      <Tax Amount="8663"/>
                    </Taxes>
                    <TotalFare Amount="147758"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="CNN" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUCH/YLWF2AUCH/YLXF2AUCH/YLXF2AUCH"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON Q25.00 1148.31EY X/AUH Q25.00EY SYD1128.54NUC2326.85END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLWF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="OK">
                    <BaggageAllowance Number="35K"/>
                    <FareBasis Code="YLXF2AUCH"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="114831" FareBasisCode="YLWF2AUCH" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="112854" FareBasisCode="YLXF2AUCH" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
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
                <Text>2FRH 9LSC*AWT 1345/20MAY22</Text>
              </SignatureLine>
            </MiscInformation>
            <PricedItinerary DisplayOnly="false" InputMessage="WPAEY¥MP-I¥BRYF¥RQ" RPH="3" StatusCode="A" StoredDateTime="2022-05-20T13:45" TaxExempt="false" ValidatingCarrier="EY">
              <AirItineraryPricingInfo>
                <ItinTotalFare>
                  <BaseFare Amount="404.00" CurrencyCode="AUD"/>
                  <EquivFare Amount="18180" CurrencyCode="RUB"/>
                  <Taxes>
                    <Tax Amount="4457" TaxCode="UB"/>
                  </Taxes>
                  <TotalFare Amount="22637" CurrencyCode="RUB"/>
                  <Totals>
                    <BaseFare Amount="404.00"/>
                    <EquivFare Amount="18180"/>
                    <Taxes>
                      <Tax Amount="4457"/>
                    </Taxes>
                    <TotalFare Amount="22637"/>
                  </Totals>
                </ItinTotalFare>
                <PassengerTypeQuantity Code="INF" Quantity="01"/>
                <PTC_FareBreakdown>
                  <Endorsements>
                    <Endorsement type="PRICING_PARAMETER">
                      <Text>WPAEY$MP-I$BRYF$RQ</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>VALIDATING CARRIER SPECIFIED - EY</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>CHG BEF DEP UP TO RUB1XXX0/CHG AFT DEP UP TO RUB1XXX0/REF BEF</Text>
                    </Endorsement>
                    <Endorsement type="WARNING">
                      <Text>DEP UP TO RUB0/REF AFT DEP UP TO RUB0/SEE RULES</Text>
                    </Endorsement>
                    <Endorsement type="SYSTEM_ENDORSEMENT">
                      <Text>NON ENDO/ REF</Text>
                    </Endorsement>
                  </Endorsements>
                  <FareBasis Code="YLWF2AUIN/YLWF2AUIN/YLXF2AUIN/YLXF2AUIN"/>
                  <FareCalculation>
                    <Text>SYD EY X/AUH EY LON153.10EY X/AUH EY SYD150.47NUC303.57END ROE1.328146</Text>
                  </FareCalculation>
                  <FareSource>ATPC</FareSource>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-01T23:25" FlightNumber="2463" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="2463"/>
                    <OriginLocation LocationCode="SYD"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-01</NotValidAfter>
                      <NotValidBefore>2022-12-01</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-02T10:35" FlightNumber="25" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLWF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="25"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-02</NotValidAfter>
                      <NotValidBefore>2022-12-02</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="O" DepartureDateTime="12-08T08:30" FlightNumber="12" ResBookDesigCode="Y" SegmentNumber="3" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="12"/>
                    <OriginLocation LocationCode="LHR"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment ConnectionInd="X" DepartureDateTime="12-08T22:10" FlightNumber="464" ResBookDesigCode="Y" SegmentNumber="4" Status="NS">
                    <BaggageAllowance Number="10K"/>
                    <FareBasis Code="YLXF2AUIN"/>
                    <MarketingAirline Code="EY" FlightNumber="464"/>
                    <OriginLocation LocationCode="AUH"/>
                    <ValidityDates>
                      <NotValidAfter>2022-12-08</NotValidAfter>
                      <NotValidBefore>2022-12-08</NotValidBefore>
                    </ValidityDates>
                  </FlightSegment>
                  <FlightSegment>
                    <OriginLocation LocationCode="SYD"/>
                  </FlightSegment>
                  <FareComponent Amount="15310" FareBasisCode="YLWF2AUIN" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="LON" Origin="SYD"/>
                    <Dates ArrivalDateTime="12-02T14:10" DepartureDateTime="12-01T23:25"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>1</FlightSegmentNumber>
                      <FlightSegmentNumber>2</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
                  <FareComponent Amount="15047" FareBasisCode="YLXF2AUIN" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="EY" TicketDesignator="">
                    <Location Destination="SYD" Origin="LON"/>
                    <Dates ArrivalDateTime="12-09T17:55" DepartureDateTime="12-08T08:30"/>
                    <FlightSegmentNumbers>
                      <FlightSegmentNumber>3</FlightSegmentNumber>
                      <FlightSegmentNumber>4</FlightSegmentNumber>
                    </FlightSegmentNumbers>
                  </FareComponent>
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
            <BaseFare Amount="11693.00"/>
            <EquivFare Amount="526185.00"/>
            <Taxes>
              <Tax Amount="49202.00"/>
            </Taxes>
            <TotalFare Amount="575387.00"/>
          </PriceQuoteTotals>
        </ItineraryPricing>
        <ReservationItems>
          <Item RPH="1">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-02T06:40" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-01T23:25" ElapsedTime="13.15" FlightNumber="2463" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="O" Sequence="1"/>
              <Meal Code="R"/>
              <OperatingAirline Code="EY" FlightNumber="2463" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="SYD"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-02T06:40</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-01T23:25</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="2" sequence="1">
                  <DepartureAirport>SYD</DepartureAirport>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>2463</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>R</MealCode>
                  <ElapsedTime>795</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-01T23:25:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T06:40:00</ArrivalDateTime>
                  <FlightNumber>2463</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="2">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-02T14:10" CodeShare="false" ConnectionInd="I" DayOfWeekInd="5" DepartureDateTime="2022-12-02T10:35" ElapsedTime="07.35" FlightNumber="0025" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="001" Ind="I" Sequence="2"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0025" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-02T14:10</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-02T10:35</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="3" sequence="2">
                  <DepartureAirport>AUH</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>LHR</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>25</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>1</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>455</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-02T10:35:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-02T14:10:00</ArrivalDateTime>
                  <FlightNumber>25</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="3">
            <FlightSegment AirMilesFlown="3420" ArrivalDateTime="12-08T19:20" CodeShare="false" ConnectionInd="O" DayOfWeekInd="4" DepartureDateTime="2022-12-08T08:30" ElapsedTime="06.50" FlightNumber="0012" Id="18" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0003" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="AUH" Terminal="TERMINAL 3" TerminalCode="3"/>
              <Equipment AirEquipType="781"/>
              <MarketingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="O" Sequence="1"/>
              <Meal Code="M"/>
              <OperatingAirline Code="EY" FlightNumber="0012" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="LHR" Terminal="TERMINAL 3" TerminalCode="3"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-08T19:20</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T08:30</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="4" sequence="3">
                  <DepartureAirport>LHR</DepartureAirport>
                  <DepartureTerminalName>TERMINAL 3</DepartureTerminalName>
                  <DepartureTerminalCode>3</DepartureTerminalCode>
                  <ArrivalAirport>AUH</ArrivalAirport>
                  <ArrivalTerminalName>TERMINAL 3</ArrivalTerminalName>
                  <ArrivalTerminalCode>3</ArrivalTerminalCode>
                  <EquipmentType>781</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>12</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>1</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <MealCode>M</MealCode>
                  <ElapsedTime>410</ElapsedTime>
                  <AirMilesFlown>3420</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T08:30:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-08T19:20:00</ArrivalDateTime>
                  <FlightNumber>12</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>false</inboundConnection>
                  <outboundConnection>true</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
          <Item RPH="4">
            <FlightSegment AirMilesFlown="7506" ArrivalDateTime="12-09T17:55" CodeShare="false" ConnectionInd="I" DayOfWeekInd="4" DepartureDateTime="2022-12-08T22:10" ElapsedTime="13.45" FlightNumber="0464" Id="19" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2022-05-20T05:45:00" SegmentNumber="0004" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
              <DestinationLocation LocationCode="SYD"/>
              <Equipment AirEquipType="789"/>
              <MarketingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>MARKETED BY ETIHAD AIRWAYS</Banner>
              </MarketingAirline>
              <MarriageGrp Group="002" Ind="I" Sequence="2"/>
              <OperatingAirline Code="EY" FlightNumber="0464" ResBookDesigCode="Y">
                <Banner>OPERATED BY ETIHAD AIRWAYS</Banner>
              </OperatingAirline>
              <OperatingAirlinePricing Code="EY"/>
              <DisclosureCarrier Code="EY" DOT="false">
                <Banner>ETIHAD AIRWAYS</Banner>
              </DisclosureCarrier>
              <OriginLocation LocationCode="AUH"/>
              <SupplierRef ID="DCEY*BWJNXL"/>
              <UpdatedArrivalTime>12-09T17:55</UpdatedArrivalTime>
              <UpdatedDepartureTime>12-08T22:10</UpdatedDepartureTime>
              <Cabin Code="Y" Lang="EN" Name="ECONOMY" SabreCode="Y" ShortName="ECONOMY"/>
            </FlightSegment>
            <Product>
              <ProductDetails productCategory="AIR">
                <ProductName type="AIR"/>
                <Air segmentAssociationId="5" sequence="4">
                  <DepartureAirport>AUH</DepartureAirport>
                  <ArrivalAirport>SYD</ArrivalAirport>
                  <EquipmentType>789</EquipmentType>
                  <MarketingAirlineCode>EY</MarketingAirlineCode>
                  <MarketingFlightNumber>464</MarketingFlightNumber>
                  <MarketingClassOfService>Y</MarketingClassOfService>
                  <MarriageGrp>
                    <Group>2</Group>
                    <Sequence>2</Sequence>
                  </MarriageGrp>
                  <Cabin code="Y" lang="EN" name="ECONOMY" sabreCode="Y" shortName="ECONOMY"/>
                  <ElapsedTime>825</ElapsedTime>
                  <AirMilesFlown>7506</AirMilesFlown>
                  <FunnelFlight>false</FunnelFlight>
                  <ChangeOfGauge>false</ChangeOfGauge>
                  <DisclosureCarrier Code="EY" DOT="false">
                    <Banner>ETIHAD AIRWAYS</Banner>
                  </DisclosureCarrier>
                  <AirlineRefId>DCEY*BWJNXL</AirlineRefId>
                  <Eticket>true</Eticket>
                  <DepartureDateTime>2022-12-08T22:10:00</DepartureDateTime>
                  <ArrivalDateTime>2022-12-09T17:55:00</ArrivalDateTime>
                  <FlightNumber>464</FlightNumber>
                  <ClassOfService>Y</ClassOfService>
                  <ActionCode>HK</ActionCode>
                  <NumberInParty>3</NumberInParty>
                  <inboundConnection>true</inboundConnection>
                  <outboundConnection>false</outboundConnection>
                  <ScheduleChangeIndicator>false</ScheduleChangeIndicator>
                  <SegmentBookedDate>2022-05-20T05:45:00</SegmentBookedDate>
                </Air>
              </ProductDetails>
            </Product>
          </Item>
        </ReservationItems>
        <Ticketing RPH="01" TicketTimeLimit="TAW2FRH23MAY009/1100P/"/>
      </ItineraryInfo>
      <ItineraryRef AirExtras="false" ID="TGNUYC" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
        <Header>PRICE QUOTE RECORD EXISTS - SYSTEM</Header>
        <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2022-05-20T05:45" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2022-05-23T08:41" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="7"/>
      </ItineraryRef>
      <RemarkInfo>
        <Remark Id="30" RPH="001" Type="General">
          <Text>TEXT REMARK</Text>
        </Remark>
      </RemarkInfo>
      <SpecialServiceInfo Id="54" RPH="001" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>EY HK1/9851234567</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="56" RPH="002" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>EY HK1/9851234567</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="59" RPH="003" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>EY HK1/CUSTOMER//CUSTOMER.COM</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="61" RPH="004" Type="AFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>EY HK1/CUSTOMER//CUSTOMER.COM</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="20" RPH="001" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="21" RPH="002" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="22" RPH="003" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="23" RPH="004" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="DOCS">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="24" RPH="005" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="25" RPH="006" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="26" RPH="007" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="27" RPH="008" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="INFT">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="28" RPH="009" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/79851234567/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="29" RPH="010" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="01.01">IVANOV/IVAN MR</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM/RU</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="55" RPH="011" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/9851234567</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="57" RPH="012" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCM">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/9851234567</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="60" RPH="013" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="02.01">IVANOVA/ELENA MS</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM</Text>
        </Service>
      </SpecialServiceInfo>
      <SpecialServiceInfo Id="62" RPH="014" Type="GFX">
        <Service SSR_Code="SSR" SSR_Type="CTCE">
          <Airline Code="EY"/>
          <PersonName NameNumber="03.01">IVANOV/ANDREY</PersonName>
          <Text>HK1/CUSTOMER//CUSTOMER.COM</Text>
        </Service>
      </SpecialServiceInfo>
      <OpenReservationElements>
        <OpenReservationElement elementId="pnr-54" id="54" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/9851234567</FreeText>
            <FullText>CTCM EY HK1/9851234567</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>9851234567</PhoneNumber>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-56" id="56" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <FreeText>/9851234567</FreeText>
            <FullText>CTCM EY HK1/9851234567</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>9851234567</PhoneNumber>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-59" id="59" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <Comment>COM</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-61" id="61" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="AFX">
            <Comment>COM</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</FullText>
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
        <OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</FullText>
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
        <OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FreeText>
            <FullText>DOCS EY HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</FullText>
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
        <OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FreeText>
            <FullText>DOCS EY HK1/P/RU/1234567890/RU/20FEB2022/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</FullText>
            <TravelDocument>
              <Type>P</Type>
              <DocumentIssueCountry>RU</DocumentIssueCountry>
              <DocumentNumber>1234567890</DocumentNumber>
              <DocumentNationalityCountry>RU</DocumentNationalityCountry>
              <DocumentExpirationDate>15APR2025</DocumentExpirationDate>
              <DateOfBirth>20FEB2022</DateOfBirth>
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
        <OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 SYDAUH2463Y01DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="16" SegmentAssociationId="2">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>2463</FlightNumber>
              <DepartureDate>2022-12-01</DepartureDate>
              <BoardPoint>SYD</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHLHR0025Y02DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="17" SegmentAssociationId="3">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0025</FlightNumber>
              <DepartureDate>2022-12-02</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>LHR</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-26" id="26" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 LHRAUH0012Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="18" SegmentAssociationId="4">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0012</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>LHR</BoardPoint>
              <OffPoint>AUH</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-27" id="27" type="SRVC">
          <ServiceRequest actionCode="NN" airlineCode="EY" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/IVANOVA/EKATERINA/20FEB22</FreeText>
            <FullText>INFT EY NN1 AUHSYD0464Y08DEC/IVANOVA/EKATERINA/20FEB22</FullText>
          </ServiceRequest>
          <SegmentAssociation Id="19" SegmentAssociationId="5">
            <AirSegment>
              <CarrierCode>EY</CarrierCode>
              <FlightNumber>0464</FlightNumber>
              <DepartureDate>2022-12-08</DepartureDate>
              <BoardPoint>AUH</BoardPoint>
              <OffPoint>SYD</OffPoint>
              <ClassOfService>Y</ClassOfService>
              <BookingStatus>NN</BookingStatus>
            </AirSegment>
          </SegmentAssociation>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>IVAN MR</FirstName>
            <ReferenceId>1</ReferenceId>
            <NameRefNumber>01.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-28" id="28" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/79851234567/RU</FreeText>
            <FullText>CTCM EY HK1/79851234567/RU</FullText>
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
        <OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM/RU</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM/RU</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM/RU</FullText>
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
        <OpenReservationElement elementId="pnr-55" id="55" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/9851234567</FreeText>
            <FullText>CTCM EY HK1/9851234567</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>9851234567</PhoneNumber>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-57" id="57" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <FreeText>/9851234567</FreeText>
            <FullText>CTCM EY HK1/9851234567</FullText>
            <PassengerContactMobilePhone>
              <PhoneNumber>9851234567</PhoneNumber>
            </PassengerContactMobilePhone>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-60" id="60" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOVA</LastName>
            <FirstName>ELENA MS</FirstName>
            <ReferenceId>2</ReferenceId>
            <NameRefNumber>02.01</NameRefNumber>
          </NameAssociation>
        </OpenReservationElement>
        <OpenReservationElement elementId="pnr-62" id="62" type="SRVC">
          <ServiceRequest actionCode="HK" airlineCode="EY" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
            <Comment>COM</Comment>
            <FreeText>/CUSTOMER//CUSTOMER.COM</FreeText>
            <FullText>CTCE EY HK1/CUSTOMER//CUSTOMER.COM</FullText>
            <PassengerContactEmail>
              <Email>CUSTOMER@CUSTOMER.COM</Email>
            </PassengerContactEmail>
          </ServiceRequest>
          <NameAssociation>
            <LastName>IVANOV</LastName>
            <FirstName>ANDREY</FirstName>
            <ReferenceId>3</ReferenceId>
            <NameRefNumber>03.01</NameRefNumber>
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
```
{{< /details >}}

## Регулярные выражения для поиска сообщений с тайм-лимитом от перевозчиков

В данном разделе представлены [регулярные выражения](https://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D1%8B%D0%B5_%D0%B2%D1%8B%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F) для поиска сообщений с тайм-лимитом от более чем 150 перевозчиков. Для проверки и тестирования регулярных выражений можно использовать сервис [regex101](https://regex101.com/).

{{< hint danger >}}
Обратите внимание на то, что представленный список может содержать ошибочные или неточные данные, поскольку содержимое сообщений может быть в любой момент изменено перевозчиком.
{{< /hint >}}

Регулярные выражения используют именованные группы для поиска необходимых переменных внутри сообщения перевозчика. В зависимости от сообщения могут быть найдены следующие именованные группы:
- ```carrier``` — код маркетингового перевозчика, который отправил сообщение
- ```full_year``` — год наступления тайм-лимита. 4 цифры, например ```2022```
- ```year``` — год наступления тайм-лимита. 2 цифры, например ```22```
- ```month``` — месяц наступления тайм-лимита. 3 буквы, например ```MAY```
- ```day``` — день наступления тайм-лимита. 2 цифры, например ```30```
- ```hour``` — час наступления тайм-лимита. 2 цифры, например ```23```
- ```minute``` — минута наступления тайм-лимита. 2 цифры, например ```59```
- ```location``` — код города или аэропорта часового пояса. 3 буквы, например ```MOW```
- ```timezone``` — часовой пояс. Возможные значения:
    - ```Z``` — UTC+0
    - ```GMT``` — UTC+0
    - ```UTC``` — UTC+0
    - ```CST``` — UTC-6
    - ```CDT``` — UTC-5
    - ```HDQ``` — часовой пояс авиакомпании

{{< hint danger >}}
Обратите внимание на то, что не во всех сообщениях может содержаться вся информация о тайм-лимите. Например, некоторые перевозчики не сообщают в своих сообщениях чаосовй пояс для времени тайм-лимита.
{{< /hint >}}

В представленных ниже текстовых файлах на каждой строке располагается отдельное регулярное выражение для проверки сообщений. Из-за различий в синтаксисе именованных групп для разных языков программирования предложены разные регулярные выражения:
- Python, PHP, Golang используют синтаксис ```(?P<имя>выражение)``` для именованных групп
- C#, Java, Javascript используют синтаксис ```(?<имя>выражение)``` для именованных групп

{{< details title="Python, PHP, Golang" >}}
```
^(1S )?(?P<carrier>\w\w) PLZ PAY BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST) TO AVOID CANCELLATION$
^(1S )?(?P<carrier>\w\w) REMINDS YOU TO ISSUE AND ADV E-TKT IN PNR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<full_year>20[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST)0$
^(1S )?(?P<carrier>\w\w) REQUIERE EMISION E INCLUSION DEL E-TKT EN PNR ANTES DEL (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<full_year>20[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST)0$
^(1S )?(?P<carrier>\w\w) TTL EXPIRE ON (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)\/(?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) \/\/.*$
^(1S )?(?P<carrier>\w\w) WILL CANCEL IF NO TKT BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?(?P<carrier>\w\w)\/\w\w AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT$
^(1S )?(?P<location>\w{3}) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$
^(1S )?.REMINDER (?P<carrier>\w\w) SEGS SUBJ TO CXL ON (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)$
^(1S )?.RI PLSSEND TKT NUMBER BEFORE (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?.TKT (?P<carrier>\w\w)SEGS BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) TO AVOID AUTO CXL \/EARLIER$
^(1S )?.UNTKTD(?P<carrier>\w\w) SEGS MAY CANX (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) TKT PER FARE RULES TO AVOID AD$
^(1S )?.UNTKTD(?P<carrier>\w\w) SEGS WILL CX (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) TKT PER FARE RULES TO AVOID ADM$
^(1S )?ADTK BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT OR (?P<carrier>\w\w) SPACE WILL BE CXLD$
^(1S )?ADTK BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) LT (?P<timezone>Z|UTC|GMT|HDQ|CST) OR (?P<carrier>\w\w) SPACE WILL BE CXLD$
^(1S )?ADTK BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<location>\w{3}) LT ELSE (?P<carrier>\w\w) WILL XXL$
^(1S )?ADTK BY (0?[1-9]|[12]\d|3[01])(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)([2-9]\d) ([0-2]\d)([0-5]\d)HDQ (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<location>\w{3}) PER.*$
^(1S )?ADTK NO LATER THAN (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) TO AVOID CANCELLATION$
^(1S )?ADTK OR BKG WILL BE CNLD BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(?P<location>\w{3}) LT$
^(1S )?ADV TKNE OR XX BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d) (?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?ADV TKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<location>\w{3})\w\w OR WL BE CXLD$
^(1S )?AGT\/(?P<carrier>\w\w) PLS ENTER GENUINE TICKET NUMBER IN PNR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)$
^(1S )?AGT\/(?P<carrier>\w\w) PLS ENTER TICKET NUMBER IN PNR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) OR RISK CANCELLATION$
^(1S )?AGT\/(?P<carrier>\w\w) PLS TICKET ACCORDING TO FARE RULES AND ENTER GENUINE TICKET NUMBER IN PNR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)$
^(1S )?AUTO XX IF SSR TKNE NOT RCVD BY (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<location>\w{3}) LT$
^(1S )?AUTO XX IF SSR TKNE NOT RCVD BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?BY (?P<location>\w{3})(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)\/(?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OR CXL (?P<carrier>\w\w).*$
^(1S )?ISSUE TICKETS FOR (?P<carrier>\w\w) FLIGHTS BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?PLEASE INSERT TKT NUMBER BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<location>\w{3})$
^(1S )?PLS ADTK BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST) OR SEATS WILL BE XLD$
^(1S )?PLS ADTK BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<location>\w{3}) (0?[1-9]|[12]\d|3[01])(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)([2-9]\d) ([0-2]\d)([0-5]\d)\w{3}$
^(1S )?PLS ADTK BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OR (?P<carrier>\w\w) SPACE WILL BE CANCELLED$
^(1S )?PLS ADTK OR CNL (?P<carrier>\w\w) FLIGHT BY (?P<hour>[0-2]\d) (?P<minute>[0-5]\d) \/ (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?PLS ADV TKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) OR PNR WILL BE CNL$
^(1S )?PLS ADV TKT NBR BEFORE (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT OR AUTO CNL$
^(1S )?PLS ADV TKT NBR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)\/(?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OR (?P<carrier>\w\w) OPTG\/MKTG FLTS WILL BE CANX \/ APPLIC FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG$
^(1S )?PLS ADV TKT NBR BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)\/(?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OR (?P<carrier>\w\w) OPTG\/MKTG FLTS WILL BE CANX \/ APPLIC FARE RULE APPLIES IF IT DEMANDS$
^(1S )?PLS ADV TKT NBR OR (?P<carrier>\w\w) SPACE WILL BE CXLD BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}).*$
^(1S )?PLS ADV TKT OR XX PNR TL(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*(?P<carrier>\w\w)$
^(1S )?PLS ADV TKTNUMBR FOR (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OR AUTOCNL$
^(1S )?PLS ADVISE (?P<carrier>\w\w) TKT NUMBERS BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$
^(1S )?PLS ISSUE ETKT LATEST (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<timezone>Z|UTC|GMT|HDQ|CST) OR (?P<carrier>\w\w) SEG WILL BE XLD$
^(1S )?PLS ISSUE TIX FOR ALL (?P<carrier>\w\w) SEGMENTS UNTIL (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d)\/(?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED\/.*$
^(1S )?PLS TKT BY (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) LST OR (?P<carrier>\w\w) SEGS WILL BE CXLD$
^(1S )?PLS TKT OR CXL (?P<carrier>\w\w) FLT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<location>\w{3}) PER.*$
^(1S )?RITK\/ADTKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT ELSE BKG WILL BE XXLD$
^(1S )?RITK\/ADTKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT FARE RULE APPLIES IF$
^(1S )?RITK\/ADTKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT$
^(1S )?RITK\/ADTKT BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<year>[2-9]\d) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) LT ELSE BKG WILL BE$
^(1S )?SUBJ CXL ON\/BEFORE (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) WITHOUT PAYMENT$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) OR (?P<carrier>\w\w) FLTS WILL BE CNLD$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) OTHERWISE MAY BE XLD$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) OTHERWISE WILL BE XLD$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) (?P<location>\w{3}) TIME ZONE OTHERWISE WILL BE XLD$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) IRC-2\/ADV OTO TKT$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) TKT REMINDER OR ITIN MAY XL$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?P<carrier>\w\w) BY (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE XLD$
^(1S )?TO (?P<carrier>\w\w) BY (?P<location>\w{3})(?P<hour>[0-2]\d)(?P<minute>[0-5]\d)\/(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) OTHERWISE WILL BE XLD$
^(1S )?TO (?P<carrier>\w\w) BY(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?P<carrier>\w\w) BY(?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OTHERWISE WILL BE XLND$
^(1S )?TO (?P<carrier>\w\w) ON\/BEFORE (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d) OTHERWISE WILL BE XLD$
^(1S )?TO (?P<carrier>\w\w) ON\/BEFORE (?P<day>0?[1-9]|[12]\d|3[01])(?P<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?P<hour>[0-2]\d)(?P<minute>[0-5]\d)(?P<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE XLD$
```
{{< /details >}}

{{< details title="C#, Java, Javascript" >}}
```
^(1S )?(?<carrier>\w\w) PLZ PAY BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST) TO AVOID CANCELLATION$
^(1S )?(?<carrier>\w\w) REMINDS YOU TO ISSUE AND ADV E-TKT IN PNR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<full_year>20[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST)0$
^(1S )?(?<carrier>\w\w) REQUIERE EMISION E INCLUSION DEL E-TKT EN PNR ANTES DEL (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<full_year>20[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST)0$
^(1S )?(?<carrier>\w\w) TTL EXPIRE ON (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)\/(?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) \/\/.*$
^(1S )?(?<carrier>\w\w) WILL CANCEL IF NO TKT BY (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?(?<carrier>\w\w)\/\w\w AUTO XX IF ELECTRONIC TKT NR NOT RCVD BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT$
^(1S )?(?<location>\w{3}) (?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$
^(1S )?.REMINDER (?<carrier>\w\w) SEGS SUBJ TO CXL ON (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)$
^(1S )?.RI PLSSEND TKT NUMBER BEFORE (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?.TKT (?<carrier>\w\w)SEGS BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) TO AVOID AUTO CXL \/EARLIER$
^(1S )?.UNTKTD(?<carrier>\w\w) SEGS MAY CANX (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) TKT PER FARE RULES TO AVOID AD$
^(1S )?.UNTKTD(?<carrier>\w\w) SEGS WILL CX (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) TKT PER FARE RULES TO AVOID ADM$
^(1S )?ADTK BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT OR (?<carrier>\w\w) SPACE WILL BE CXLD$
^(1S )?ADTK BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) LT (?<timezone>Z|UTC|GMT|HDQ|CST) OR (?<carrier>\w\w) SPACE WILL BE CXLD$
^(1S )?ADTK BY (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<location>\w{3}) LT ELSE (?<carrier>\w\w) WILL XXL$
^(1S )?ADTK BY (0?[1-9]|[12]\d|3[01])(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)([2-9]\d) ([0-2]\d)([0-5]\d)HDQ (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<location>\w{3}) PER.*$
^(1S )?ADTK NO LATER THAN (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) TO AVOID CANCELLATION$
^(1S )?ADTK OR BKG WILL BE CNLD BY (?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(?<location>\w{3}) LT$
^(1S )?ADV TKNE OR XX BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d) (?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?ADV TKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<location>\w{3})\w\w OR WL BE CXLD$
^(1S )?AGT\/(?<carrier>\w\w) PLS ENTER GENUINE TICKET NUMBER IN PNR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)$
^(1S )?AGT\/(?<carrier>\w\w) PLS ENTER TICKET NUMBER IN PNR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) OR RISK CANCELLATION$
^(1S )?AGT\/(?<carrier>\w\w) PLS TICKET ACCORDING TO FARE RULES AND ENTER GENUINE TICKET NUMBER IN PNR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)$
^(1S )?AUTO XX IF SSR TKNE NOT RCVD BY (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<location>\w{3}) LT$
^(1S )?AUTO XX IF SSR TKNE NOT RCVD BY (?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?BY (?<location>\w{3})(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)\/(?<hour>[0-2]\d)(?<minute>[0-5]\d) OR CXL (?<carrier>\w\w).*$
^(1S )?ISSUE TICKETS FOR (?<carrier>\w\w) FLIGHTS BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?PLEASE INSERT TKT NUMBER BY (?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<location>\w{3})$
^(1S )?PLS ADTK BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST) OR SEATS WILL BE XLD$
^(1S )?PLS ADTK BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<location>\w{3}) (0?[1-9]|[12]\d|3[01])(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)([2-9]\d) ([0-2]\d)([0-5]\d)\w{3}$
^(1S )?PLS ADTK BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OR (?<carrier>\w\w) SPACE WILL BE CANCELLED$
^(1S )?PLS ADTK OR CNL (?<carrier>\w\w) FLIGHT BY (?<hour>[0-2]\d) (?<minute>[0-5]\d) \/ (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<timezone>Z|UTC|GMT|HDQ|CST)$
^(1S )?PLS ADV TKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) OR PNR WILL BE CNL$
^(1S )?PLS ADV TKT NBR BEFORE (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT OR AUTO CNL$
^(1S )?PLS ADV TKT NBR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)\/(?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OR (?<carrier>\w\w) OPTG\/MKTG FLTS WILL BE CANX \/ APPLIC FARE RULE APPLIES IF IT DEMANDS EARLIER TKTG$
^(1S )?PLS ADV TKT NBR BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)\/(?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OR (?<carrier>\w\w) OPTG\/MKTG FLTS WILL BE CANX \/ APPLIC FARE RULE APPLIES IF IT DEMANDS$
^(1S )?PLS ADV TKT NBR OR (?<carrier>\w\w) SPACE WILL BE CXLD BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}).*$
^(1S )?PLS ADV TKT OR XX PNR TL(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*(?<carrier>\w\w)$
^(1S )?PLS ADV TKTNUMBR FOR (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) OR AUTOCNL$
^(1S )?PLS ADVISE (?<carrier>\w\w) TKT NUMBERS BY (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$
^(1S )?PLS ISSUE ETKT LATEST (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<timezone>Z|UTC|GMT|HDQ|CST) OR (?<carrier>\w\w) SEG WILL BE XLD$
^(1S )?PLS ISSUE TIX FOR ALL (?<carrier>\w\w) SEGMENTS UNTIL (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d)\/(?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE UNTICKETED SEGMENTS WILL BE CANCELLED\/.*$
^(1S )?PLS TKT BY (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) LST OR (?<carrier>\w\w) SEGS WILL BE CXLD$
^(1S )?PLS TKT OR CXL (?<carrier>\w\w) FLT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<location>\w{3}) PER.*$
^(1S )?RITK\/ADTKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT ELSE BKG WILL BE XXLD$
^(1S )?RITK\/ADTKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT FARE RULE APPLIES IF$
^(1S )?RITK\/ADTKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT$
^(1S )?RITK\/ADTKT BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<year>[2-9]\d) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) LT ELSE BKG WILL BE$
^(1S )?SUBJ CXL ON\/BEFORE (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) WITHOUT PAYMENT$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) OR (?<carrier>\w\w) FLTS WILL BE CNLD$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) OTHERWISE MAY BE XLD$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) OTHERWISE WILL BE XLD$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) (?<location>\w{3}) TIME ZONE OTHERWISE WILL BE XLD$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) IRC-2\/ADV OTO TKT$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) TKT REMINDER OR ITIN MAY XL$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?<carrier>\w\w) BY (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE XLD$
^(1S )?TO (?<carrier>\w\w) BY (?<location>\w{3})(?<hour>[0-2]\d)(?<minute>[0-5]\d)\/(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) OTHERWISE WILL BE XLD$
^(1S )?TO (?<carrier>\w\w) BY(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<hour>[0-2]\d)(?<minute>[0-5]\d) OTHERWISE WILL BE CANCELLED$
^(1S )?TO (?<carrier>\w\w) BY(?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?<hour>[0-2]\d)(?<minute>[0-5]\d) OTHERWISE WILL BE XLND$
^(1S )?TO (?<carrier>\w\w) ON\/BEFORE (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d) OTHERWISE WILL BE XLD$
^(1S )?TO (?<carrier>\w\w) ON\/BEFORE (?<day>0?[1-9]|[12]\d|3[01])(?<month>JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) (?<hour>[0-2]\d)(?<minute>[0-5]\d)(?<timezone>Z|UTC|GMT|HDQ|CST) OTHERWISE WILL BE XLD$
```
{{< /details >}}
