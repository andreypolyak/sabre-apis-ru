# Получение норм провоза багажа

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Перевозчики файлируют информацию о нормах провоза багажа на рейсах в тарифах. Существует два основных способа файлирования этой информации:
- установка ограничений по количеству мест багажа (т.н. Piece Concept)
- установка ограничений по максимальному весу багажа (т.н. Weight Concept)

Помимо основных ограничений (количество мест или вес багажа), перевозчики могут накладывать и дополнительные ограничения (вес и размеры багажа).

В Sabre APIs существует несколько способов получения норм провоза багажа:
- получение норм провоза багажа в поисковой выдаче сервисов [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) и [BargainFinderMax_ADRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max/bfm_ad) или при проверке стоимости и наличия мест при помощи сервиса [RevalidateItinRQ](https://developer.sabre.com/docs/read/soap_apis/air/search/revalidate_itinerary)
- получение норм провоза багажа при создании бронирования при помощи сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record)
- получение норм провоза багажа при создании бронирования при помощи сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking)
- получение норм провоза багажа без имеющегося бронирования при помощи сервиса сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking)
- получение норм провоза багажа для открытого бронирования при помощи сервиса [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/soap_apis/air/book/price_air_itinerary)

Ниже представлены рекомендации по использованию этих сервисов.

## Получение норм провоза багажа в поисковой выдаче или при проверке стоимости и наличия мест (BargainFinderMaxRQ, BargainFinderMax_ADRQ, RevalidateItinRQ)

Для получения всей возможной информации о нормах провоза багажа необходимо указать значение ```A``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@RequestType``` и значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@Description```.

{% xmlsec "Пример", false %}
<Baggage Description="true" RequestType="A"/>
{% endxmlsec %}

Для каждого найденного варианта перелетов ответ на запрос может содержать один или несколько элементов ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/ItinTotalFare/TPA_Extensions/BaggageInformationList/BaggageInformation```, который будет содержать информацию о нормах провоза багажа. Для каждого элемента в атрибутах ```/BaggageInformation/Segment/@Id``` указаны номера сегментов, для которых применима норма провоза багажа.

В зависимости от способа файлирования норм провоза багажа ответ может содержать:
- ```/BaggageInformation/Allowance/@Pieces``` — количество мест багажа
- ```/BaggageInformation/Allowance/@Weight``` — максимальный вес всех мест багажа
- ```/BaggageInformation/Allowance/@Unit``` — единицы измерения, как правило в килограммах (```kg```)
- ```/BaggageInformation/Allowance/@Description1``` — информация о максимальном весе багажа, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
    - ```XX``` — вес в фунтах
    - ```YY``` — вес в килограммах
- ```/BaggageInformation/Allowance/@Description2``` — информация о максимальных размерах багажа, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
    - ```XX``` — длина в дюймах
    - ```YYY``` — длина в сантиметрах

{% xmlsec "Пример (без багажа)", false %}
<Allowance Pieces="0"/>
{% endxmlsec %}

{% xmlsec "Пример (неограниченное количество мест багажа до 30 кг)", false %}
<Allowance Weight="30" Unit="kg"/>
{% endxmlsec %}

{% xmlsec "Пример (2 места багажа до 32 кг)", false %}
<Allowance Pieces="2" Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS"/>
{% endxmlsec %}

## Получение норм провоза багажа и ручной клади при создании бронирования (CreatePassengerNameRecordRQ)

При создании бронирования при помощи сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md)) ответ будет содержать информацию о нормах провоза багажа и ручной клади.

Эти данные будут располагаться в двух местах:
- ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того, чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
1. Найти такие элементы ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```, у которых бы дочерние элементы ```/BaggageProvisions/ProvisionType``` имели значение ```A``` (нормы провоза багажа).
2. Определить соответствие между найденными элементами ```/BaggageProvisions``` и сегментами, к которым они относятся. Уникальным идентификатором каждого сегмента в бронировании будет являться комбинация следующих атрибутов:
    - ```/BaggageProvisions/Associations/CarrierCode``` — код маркетингового перевозчика
    - ```/BaggageProvisions/Associations/DepartureDate``` — дата вылета
    - ```/BaggageProvisions/Associations/FlightNumber``` — номер рейса
    - ```/BaggageProvisions/Associations/OriginLocation/@LocationCode``` — код аэропорта отправления
    - ```/BaggageProvisions/Associations/DestinationLocation/@LocationCode``` — код аэропорта прибытия
3. Связать нормы провоза багажа (элементы ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```) с описанием норм провоза багажа (элементы ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties```) при помощи соответствия между элементами ```/BaggageProvisions/SubCodeInfo/SubCodeForAllowance``` и ```/SubCodeProperties/ExtendedSubCodeKey```.
4. В зависимости от способа файлирования норм провоза багажа информация может содержаться в следующих элементах:
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionOne/Text``` — текстовая информация о максимальном весе багажа, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
        - ```XX``` — вес в фунтах
        - ```YY``` — вес в килограммах
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionTwo/Text``` — информация о максимальных размерах багажа, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
        - ```XX``` — длина в дюймах
        - ```YYY``` — длина в сантиметрах
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSizeInAlternate``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSize``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeightInAlternate``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeight``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/NumPiecesBDI``` — количество мест багажа
    - ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/WeightLimit``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)

Нормы провоза ручной клади можно получить, воспользовавшись тем же алгоритмом, за исключением того, что в п.1 необходимо найти элементы, имеющие значение ```B``` (нормы провоза ручной клади).

Коды единиц измерения:
- ```C``` — сантиметры
- ```I``` — дюймы
- ```K``` — килограммы
- ```L``` — фунты

{% xmlsec "Пример (без багажа, 1 место ручной клади)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>PC OF BAG 31 50KG UPTO 203LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="50">
      <Text>UP TO 110 POUNDS/50 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6B">
      <Text>UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>027ACUT</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">203</MaximumSizeInAlternate>
      <MaximumSize Units="I">80</MaximumSize>
      <MaximumWeightInAlternate Units="K">50</MaximumWeightInAlternate>
      <MaximumWeight Units="L">110</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAAUT</ExtendedSubCodeKey>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="4">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="5">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="6">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="7">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CarrierCode RPH="2">UT</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <FlightNumber RPH="2">4413</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (неограниченное количество мест багажа до 30 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAATK</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">415</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CarrierCode RPH="2">TK</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <FlightNumber RPH="2">415</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAALH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <BookingMethod>01</BookingMethod>
    <CommercialNameofBaggageItemType>UPTO70LB 32KG AND62LI 158LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="32">
      <Text>UP TO 70 POUNDS/32 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6U">
      <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0FMACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
      <MaximumSize Units="I">62</MaximumSize>
      <MaximumWeightInAlternate Units="K">32</MaximumWeightInAlternate>
      <MaximumWeight Units="L">70</MaximumWeight>
    </SizeWeightInfo>
    <SSR_Code>XBAG</SSR_Code>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABLH</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRY8KG 18LB UPTO46LI 118LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="08">
      <Text>UP TO 18 POUNDS/8 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="4Y">
      <Text>UP TO 46 LINEAR INCHES/118 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0M1ACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">118</MaximumSizeInAlternate>
      <MaximumSize Units="I">46</MaximumSize>
      <MaximumWeightInAlternate Units="K">8</MaximumWeightInAlternate>
      <MaximumWeight Units="L">18</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="DME" RPH="2"/>
    <FlightNumber RPH="1">1299</FlightNumber>
    <FlightNumber RPH="2">1452</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">4</PNR_Segment>
    <PNR_Segment RPH="2">5</PNR_Segment>
    <ResBookDesigCode RPH="1">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CarrierCode RPH="3">LH</CarrierCode>
    <CarrierCode RPH="4">LH</CarrierCode>
    <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DepartureDate RPH="3">2018-04-08</DepartureDate>
    <DepartureDate RPH="4">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <DestinationLocation LocationCode="FRA" RPH="3"/>
    <DestinationLocation LocationCode="DME" RPH="4"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <FlightNumber RPH="3">1299</FlightNumber>
    <FlightNumber RPH="4">1452</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <OriginLocation LocationCode="IST" RPH="3"/>
    <OriginLocation LocationCode="FRA" RPH="4"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <PNR_Segment RPH="3">4</PNR_Segment>
    <PNR_Segment RPH="4">5</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <ResBookDesigCode RPH="3">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="4">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
    <StatusCode RPH="3">QF</StatusCode>
    <StatusCode RPH="4">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0M1ACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0LNABLH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

## Получение норм провоза багажа и ручной клади при создании бронирования (EnhancedAirBookRQ)

При создании бронирования при помощи сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.md)) ответ будет содержать информацию о нормах провоза багажа и ручной клади.

Эти данные будут располагаться в двух местах:
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того, чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
1. Найти такие элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```, у которых бы дочерние элементы ```/BaggageProvisions/ProvisionType``` имели значение ```A``` (нормы провоза багажа).
2. Определить соответствие между найденными элементами ```/BaggageProvisions``` и сегментами, к которым они относятся. Уникальным идентификатором каждого сегмента в бронировании будет являться комбинация следующих атрибутов:
    - ```/BaggageProvisions/Associations/CarrierCode``` — код маркетингового перевозчика
    - ```/BaggageProvisions/Associations/DepartureDate``` — дата вылета
    - ```/BaggageProvisions/Associations/FlightNumber``` — номер рейса
    - ```/BaggageProvisions/Associations/OriginLocation/@LocationCode``` — код аэропорта отправления
    - ```/BaggageProvisions/Associations/DestinationLocation/@LocationCode``` — код аэропорта прибытия
3. Связать нормы провоза багажа (элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```) с описанием норм провоза багажа (элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties```) при помощи соответствия между элементами ```/BaggageProvisions/SubCodeInfo/SubCodeForAllowance``` и ```/SubCodeProperties/ExtendedSubCodeKey```.
4. В зависимости от способа файлирования норм провоза багажа информация может содержаться в следующих элементах:
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionOne/Text``` — текстовая информация о максимальном весе багажа, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
        - ```XX``` — вес в фунтах
        - ```YY``` — вес в килограммах
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionTwo/Text``` — информация о максимальных размерах багажа, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
        - ```XX``` — длина в дюймах
        - ```YYY``` — длина в сантиметрах
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSizeInAlternate``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSize``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeightInAlternate``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeight``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/NumPiecesBDI``` — количество мест багажа
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/WeightLimit``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)

Нормы провоза ручной клади можно получить, воспользовавшись тем же алгоритмом, за исключением того, что в п.1 необходимо найти элементы, имеющие значение ```B``` (нормы провоза ручной клади).

Коды единиц измерения:
- ```C``` — сантиметры
- ```I``` — дюймы
- ```K``` — килограммы
- ```L``` — фунты

{% xmlsec "Пример (без багажа, 1 место ручной клади)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>PC OF BAG 31 50KG UPTO 203LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="50">
      <Text>UP TO 110 POUNDS/50 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6B">
      <Text>UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>027ACUT</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">203</MaximumSizeInAlternate>
      <MaximumSize Units="I">80</MaximumSize>
      <MaximumWeightInAlternate Units="K">50</MaximumWeightInAlternate>
      <MaximumWeight Units="L">110</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAAUT</ExtendedSubCodeKey>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="4">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="5">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="6">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="7">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CarrierCode RPH="2">UT</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <FlightNumber RPH="2">4413</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (неограниченное количество мест багажа до 30 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAATK</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">415</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CarrierCode RPH="2">TK</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <FlightNumber RPH="2">415</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAALH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <BookingMethod>01</BookingMethod>
    <CommercialNameofBaggageItemType>UPTO70LB 32KG AND62LI 158LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="32">
      <Text>UP TO 70 POUNDS/32 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6U">
      <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0FMACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
      <MaximumSize Units="I">62</MaximumSize>
      <MaximumWeightInAlternate Units="K">32</MaximumWeightInAlternate>
      <MaximumWeight Units="L">70</MaximumWeight>
    </SizeWeightInfo>
    <SSR_Code>XBAG</SSR_Code>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABLH</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRY8KG 18LB UPTO46LI 118LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="08">
      <Text>UP TO 18 POUNDS/8 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="4Y">
      <Text>UP TO 46 LINEAR INCHES/118 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0M1ACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">118</MaximumSizeInAlternate>
      <MaximumSize Units="I">46</MaximumSize>
      <MaximumWeightInAlternate Units="K">8</MaximumWeightInAlternate>
      <MaximumWeight Units="L">18</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="DME" RPH="2"/>
    <FlightNumber RPH="1">1299</FlightNumber>
    <FlightNumber RPH="2">1452</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">4</PNR_Segment>
    <PNR_Segment RPH="2">5</PNR_Segment>
    <ResBookDesigCode RPH="1">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CarrierCode RPH="3">LH</CarrierCode>
    <CarrierCode RPH="4">LH</CarrierCode>
    <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DepartureDate RPH="3">2018-04-08</DepartureDate>
    <DepartureDate RPH="4">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <DestinationLocation LocationCode="FRA" RPH="3"/>
    <DestinationLocation LocationCode="DME" RPH="4"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <FlightNumber RPH="3">1299</FlightNumber>
    <FlightNumber RPH="4">1452</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <OriginLocation LocationCode="IST" RPH="3"/>
    <OriginLocation LocationCode="FRA" RPH="4"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <PNR_Segment RPH="3">4</PNR_Segment>
    <PNR_Segment RPH="4">5</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <ResBookDesigCode RPH="3">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="4">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
    <StatusCode RPH="3">QF</StatusCode>
    <StatusCode RPH="4">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0M1ACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0LNABLH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

## Получение норм провоза багажа и ручной клади без имеющегося бронирования (EnhancedAirBookRQ)

Для получения норм провоза багажа без имеющегося бронирования используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking), который позволяет забронировать сегменты, выполнить расчет стоимости и игнорировать созданные сегменты.

Запрос к сервису строится по аналогии с запросом на бронирование (см. [Создание бронирований в 2 шага](create-booking-2steps.md)) за исключением:
- указывается статус сегмента ```QF``` (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика
- отсутствует атрибут ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@Retain``` — сохранение PQ не требуется
- у атрибутов ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` и ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter``` устанавливается значение ```true``` — игнорирование текущего бронирования до и после выполнения запроса

В результате работы сервиса создаются фиктивные сегменты со статусом QF, для которых производится расчет стоимости, после чего бронирование игнорируется.

{% xmlsec "Пример запроса", false %}
<EnhancedAirBookRQ HaltOnError="true" haltOnInvalidMCT="true" IgnoreOnError="true" version="3.10.0" xmlns="http://services.sabre.com/sp/eab/v3_10">
  <OTA_AirBookRQ>
    <OriginDestinationInformation>
      <FlightSegment DepartureDateTime="2019-09-01T00:00:00" FlightNumber="1138" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
        <DestinationLocation LocationCode="AER"/>
        <MarketingAirline Code="SU" FlightNumber="1138"/>
        <OriginLocation LocationCode="SVO"/>
      </FlightSegment>
      <FlightSegment DepartureDateTime="2019-09-08T00:00:00" FlightNumber="1129" NumberInParty="3" ResBookDesigCode="Y" Status="QF">
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
        </PricingQualifiers>
      </OptionalQualifiers>
    </PriceRequestInformation>
  </OTA_AirPriceRQ>
  <PostProcessing IgnoreAfter="true"/>
  <PreProcessing IgnoreBefore="true"/>
</EnhancedAirBookRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<EnhancedAirBookRS xmlns="http://services.sabre.com/sp/eab/v3_10">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2019-06-06T16:57:53.855-05:00"/>
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
            <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
            <EMD_Type>4</EMD_Type>
            <ExtendedSubCodeKey>0LNABSU</ExtendedSubCodeKey>
          </SubCodeProperties>
          <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
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
        </BaggageInfo>
        <HeaderInformation SolutionSequenceNmbr="1">
          <BargainFinder>
            <AlternateBooking ResBookDesigCode="1Y"/>
            <AlternateBooking ResBookDesigCode="2Y"/>
          </BargainFinder>
          <DepartureDate>2019-09-01</DepartureDate>
          <LastTicketingDate>08-27T23:59</LastTicketingDate>
          <Text>VALIDATING CARRIER SPECIFIED</Text>
          <Text>BSP - SU</Text>
          <Text>RUT - SU</Text>
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
          <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
          <Text>25CM HEIGHT</Text>
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
          <GrandTotalTaxes>17690</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>177190</TotalAmount>
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
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="177190">
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
              <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
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
            <Construction Amount="58000" CurrencyCode="RUB" RateOfExchange="65.400000"/>
            <Taxes TotalAmount="5996">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
              <Tax Amount="596" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="63996" CurrencyCode="RUB"/>
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
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
              <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
                <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
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
            <Construction Amount="43500" CurrencyCode="RUB" RateOfExchange="65.400000"/>
            <Taxes TotalAmount="5698">
              <Tax Amount="5400" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
              <Tax Amount="298" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
            </Taxes>
            <TotalFare Amount="49198" CurrencyCode="RUB"/>
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
        </AirItineraryPricingInfo>
        <AirItineraryPricingInfo SolutionSequenceNmbr="1">
          <BaggageProvisions RPH="1">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="3">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
              <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <RefundForm>1</RefundForm>
            <RefundReissue>Y</RefundReissue>
            <SubCodeInfo>
              <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
            </SubCodeInfo>
          </BaggageProvisions>
          <BaggageProvisions RPH="5">
            <Associations>
              <CarrierCode RPH="1">SU</CarrierCode>
              <CarrierCode RPH="2">SU</CarrierCode>
              <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
              <DepartureDate RPH="1">2019-09-01</DepartureDate>
              <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
                <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
                <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
                <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
                <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
                <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
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
            <BaseFare Amount="0" CurrencyCode="RUB"/>
            <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="65.400000"/>
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
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
</EnhancedAirBookRS>
{% endxmlsec %}

Информация о нормах провоза багажа и ручной клади будет располагаться в двух местах:
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того, чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
1. Найти такие элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```, у которых бы дочерние элементы ```/BaggageProvisions/ProvisionType``` имели значение ```A``` (нормы провоза багажа).
2. Определить соответствие между найденными элементами ```/BaggageProvisions``` и сегментами, к которым они относятся. Уникальным идентификатором каждого сегмента в бронировании будет являться комбинация следующих атрибутов:
    - ```/BaggageProvisions/Associations/CarrierCode``` — код маркетингового перевозчика
    - ```/BaggageProvisions/Associations/DepartureDate``` — дата вылета
    - ```/BaggageProvisions/Associations/FlightNumber``` — номер рейса
    - ```/BaggageProvisions/Associations/OriginLocation/@LocationCode``` — код аэропорта отправления
    - ```/BaggageProvisions/Associations/DestinationLocation/@LocationCode``` — код аэропорта прибытия
3. Связать нормы провоза багажа (элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```) с описанием норм провоза багажа (элементы ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties```) при помощи соответствия между элементами ```/BaggageProvisions/SubCodeInfo/SubCodeForAllowance``` и ```/SubCodeProperties/ExtendedSubCodeKey```.
4. В зависимости от способа файлирования норм провоза багажа информация может содержаться в следующих элементах:
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionOne/Text``` — текстовая информация о максимальном весе багажа, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
        - ```XX``` — вес в фунтах
        - ```YY``` — вес в килограммах
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionTwo/Text``` — информация о максимальных размерах багажа, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
        - ```XX``` — длина в дюймах
        - ```YYY``` — длина в сантиметрах
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSizeInAlternate``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSize``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeightInAlternate``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeight``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/NumPiecesBDI``` — количество мест багажа
    - ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/WeightLimit``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)

Нормы провоза ручной клади можно получить, воспользовавшись тем же алгоритмом, за исключением того, что в п.1 необходимо найти элементы, имеющие значение ```B``` (нормы провоза ручной клади).

Коды единиц измерения:
- ```C``` — сантиметры
- ```I``` — дюймы
- ```K``` — килограммы
- ```L``` — фунты

{% xmlsec "Пример (без багажа, 1 место ручной клади)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>PC OF BAG 31 50KG UPTO 203LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="50">
      <Text>UP TO 110 POUNDS/50 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6B">
      <Text>UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>027ACUT</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">203</MaximumSizeInAlternate>
      <MaximumSize Units="I">80</MaximumSize>
      <MaximumWeightInAlternate Units="K">50</MaximumWeightInAlternate>
      <MaximumWeight Units="L">110</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAAUT</ExtendedSubCodeKey>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="4">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="5">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="6">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="7">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CarrierCode RPH="2">UT</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <FlightNumber RPH="2">4413</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (неограниченное количество мест багажа до 30 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAATK</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">415</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CarrierCode RPH="2">TK</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <FlightNumber RPH="2">415</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAALH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <BookingMethod>01</BookingMethod>
    <CommercialNameofBaggageItemType>UPTO70LB 32KG AND62LI 158LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="32">
      <Text>UP TO 70 POUNDS/32 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6U">
      <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0FMACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
      <MaximumSize Units="I">62</MaximumSize>
      <MaximumWeightInAlternate Units="K">32</MaximumWeightInAlternate>
      <MaximumWeight Units="L">70</MaximumWeight>
    </SizeWeightInfo>
    <SSR_Code>XBAG</SSR_Code>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABLH</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRY8KG 18LB UPTO46LI 118LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="08">
      <Text>UP TO 18 POUNDS/8 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="4Y">
      <Text>UP TO 46 LINEAR INCHES/118 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0M1ACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">118</MaximumSizeInAlternate>
      <MaximumSize Units="I">46</MaximumSize>
      <MaximumWeightInAlternate Units="K">8</MaximumWeightInAlternate>
      <MaximumWeight Units="L">18</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="DME" RPH="2"/>
    <FlightNumber RPH="1">1299</FlightNumber>
    <FlightNumber RPH="2">1452</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">4</PNR_Segment>
    <PNR_Segment RPH="2">5</PNR_Segment>
    <ResBookDesigCode RPH="1">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CarrierCode RPH="3">LH</CarrierCode>
    <CarrierCode RPH="4">LH</CarrierCode>
    <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DepartureDate RPH="3">2018-04-08</DepartureDate>
    <DepartureDate RPH="4">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <DestinationLocation LocationCode="FRA" RPH="3"/>
    <DestinationLocation LocationCode="DME" RPH="4"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <FlightNumber RPH="3">1299</FlightNumber>
    <FlightNumber RPH="4">1452</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <OriginLocation LocationCode="IST" RPH="3"/>
    <OriginLocation LocationCode="FRA" RPH="4"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <PNR_Segment RPH="3">4</PNR_Segment>
    <PNR_Segment RPH="4">5</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <ResBookDesigCode RPH="3">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="4">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
    <StatusCode RPH="3">QF</StatusCode>
    <StatusCode RPH="4">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0M1ACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0LNABLH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

## Получение норм провоза багажа и ручной клади для открытого бронирования (OTA_AirPriceLLSRQ)

Для получения норм провоза багажа и ручной клади для открытого бронирования (см. [Редактирование бронирований](edit-booking.md)) необходимо отправить запрос к сервису [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary).

Запрос к сервису составляется по аналогии с заполнением элемента ```AirPrice``` сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md)) или элемента ```OTA_AirPriceRQ``` сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.md)).

{% xmlsec "Пример запроса", false %}
<OTA_AirPriceRQ ReturnHostCommand="true" Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <PriceRequestInformation Retain="true">
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
      </PricingQualifiers>
    </OptionalQualifiers>
  </PriceRequestInformation>
</OTA_AirPriceRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<OTA_AirPriceRS Version="2.17.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2019-02-05T08:55:30-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPASU¥P2ADT/1CNN/1INF¥BREC¥RQ</stl:HostCommand>
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
      </BaggageInfo>
      <HeaderInformation SolutionSequenceNmbr="1">
        <DepartureDate>2019-09-01</DepartureDate>
        <LastTicketingDate>08-27T23:59</LastTicketingDate>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - SU</Text>
        <Text>RUT - SU</Text>
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
        <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
        <Text>25CM HEIGHT</Text>
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
        <GrandTotalEquivFareAmount>164725</GrandTotalEquivFareAmount>
        <GrandTotalTaxes>15080</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>179805</TotalAmount>
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
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="179805">
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
            <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
          <Text>MOW SU AER29950SU MOW29950RUB59900END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29950" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR" FareAmount="29950" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
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
              <Text>01/UP TO 22 POUNDS/10 KILOGRAMS AND 55CM LENGTH X 40CM WIDTH X</Text>
              <Text>25CM HEIGHT</Text>
              <Text>CARRY ON CHARGES</Text>
              <Text>SVOAER AERSVO-SU-CARRY ON FEES UNKNOWN-CONTACT CARRIER</Text>
              <Text>ADDITIONAL ALLOWANCES AND/OR DISCOUNTS MAY APPLY DEPENDING ON</Text>
              <Text>FLYER-SPECIFIC FACTORS /E.G. FREQUENT FLYER STATUS/MILITARY/</Text>
              <Text>CREDIT CARD FORM OF PAYMENT/EARLY PURCHASE OVER INTERNET,ETC./</Text>
            </NonUS_DOT_Disclosure>
          </BaggageInfo>
          <BaseFare Amount="59900" CurrencyCode="RUB"/>
          <Construction Amount="59900" CurrencyCode="RUB" RateOfExchange="69.100000"/>
          <Taxes TotalAmount="5126">
            <Tax Amount="4530" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            <Tax Amount="596" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="65026" CurrencyCode="RUB"/>
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
          <FareBasis Code="YCLR" FareAmount="29950" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
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
          <FareBasis Code="YCLR" FareAmount="29950" FarePassengerType="ADT" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
            <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
          <Text>MOW SU AER22462SU MOW22463RUB44925END</Text>
        </FareCalculation>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="SVO" ArrivalAirportCode="AER" ArrivalCityCode="AER" CityCode="MOW" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="22462" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
          <RuleCategoryIndicator>10</RuleCategoryIndicator>
          <RuleCategoryIndicator>16</RuleCategoryIndicator>
          <RuleCategoryIndicator>19</RuleCategoryIndicator>
        </FareCalculationBreakdown>
        <FareCalculationBreakdown>
          <Branch FirstJointCarrier="SU" PCC="9LSC"/>
          <Departure AirlineCode="SU" AirportCode="AER" ArrivalAirportCode="SVO" ArrivalCityCode="MOW" CityCode="AER" GenericInd="O"/>
          <FareBasis Cabin="Y" Code="YCLR/CH25" FareAmount="22463" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25" TripTypeInd="R"/>
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
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 50 POUNDS/23</Text>
              <Text>KILOGRAMS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
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
          <BaseFare Amount="44925" CurrencyCode="RUB"/>
          <Construction Amount="44925" CurrencyCode="RUB" RateOfExchange="69.100000"/>
          <Taxes TotalAmount="4828">
            <Tax Amount="4530" TaxCode="YQF" TaxName="SERVICE FEE - FUEL" TicketingTaxCode="YQ"/>
            <Tax Amount="298" TaxCode="RI3" TaxName="TERMINAL USE CHARGE DOMESTIC D" TicketingTaxCode="RI"/>
          </Taxes>
          <TotalFare Amount="49753" CurrencyCode="RUB"/>
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
          <FareBasis Code="YCLR/CH25" FareAmount="22462" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
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
          <FareBasis Code="YCLR/CH25" FareAmount="22463" FarePassengerType="CNN" FareType="P" FilingCarrier="SU" GlobalInd="EH" Market="MOWAER" TicketDesignator="CH25"/>
          <FreeBaggageAllowance>PC001</FreeBaggageAllowance>
        </PTC_FareBreakdown>
      </AirItineraryPricingInfo>
      <AirItineraryPricingInfo SolutionSequenceNmbr="1">
        <BaggageProvisions RPH="1">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="3">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
        <BaggageProvisions RPH="4">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-08</DepartureDate>
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
            <Base Amount="2500" CurrencyCode="RUB"/>
            <Equiv Amount="2500" CurrencyCode="RUB"/>
            <TaxIndicator>X</TaxIndicator>
            <Total>2500</Total>
          </PriceInformation>
          <ProvisionType>C</ProvisionType>
          <RefundForm>1</RefundForm>
          <RefundReissue>Y</RefundReissue>
          <SubCodeInfo>
            <SubCodeForChargesOthers>0GOACSU</SubCodeForChargesOthers>
          </SubCodeInfo>
        </BaggageProvisions>
        <BaggageProvisions RPH="5">
          <Associations>
            <CarrierCode RPH="1">SU</CarrierCode>
            <CarrierCode RPH="2">SU</CarrierCode>
            <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
            <DepartureDate RPH="1">2019-09-01</DepartureDate>
            <DepartureDate RPH="2">2019-09-08</DepartureDate>
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
              <Text>2NDCHECKED BAG FEE-SVOAER-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
              <Text>BAG ALLOWANCE     -AERSVO-01P/SU/EACH PIECE UP TO 22 POUNDS/10</Text>
              <Text>KILOGRAMS AND UP TO 45 LINEAR INCHES/115 LINEAR CENTIMETERS</Text>
              <Text>2NDCHECKED BAG FEE-AERSVO-RUB2500/SU/UP TO 50 POUNDS/23 KILOGRA</Text>
              <Text>MS AND UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
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
          <BaseFare Amount="0" CurrencyCode="RUB"/>
          <Construction Amount="0" CurrencyCode="RUB" RateOfExchange="69.100000"/>
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
      </AirItineraryPricingInfo>
    </PricedItinerary>
  </PriceQuote>
</OTA_AirPriceRS>
{% endxmlsec %}

Информация о нормах провоза багажа и ручной клади будет располагаться в двух местах:
- ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того, чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
1. Найти такие элементы ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```, у которых бы дочерние элементы ```/BaggageProvisions/ProvisionType``` имели значение ```A``` (нормы провоза багажа).
2. Определить соответствие между найденными элементами ```/BaggageProvisions``` и сегментами, к которым они относятся. Уникальным идентификатором каждого сегмента в бронировании будет являться комбинация следующих атрибутов:
    - ```/BaggageProvisions/Associations/CarrierCode``` — код маркетингового перевозчика
    - ```/BaggageProvisions/Associations/DepartureDate``` — дата вылета
    - ```/BaggageProvisions/Associations/FlightNumber``` — номер рейса
    - ```/BaggageProvisions/Associations/OriginLocation/@LocationCode``` — код аэропорта отправления
    - ```/BaggageProvisions/Associations/DestinationLocation/@LocationCode``` — код аэропорта прибытия
3. Связать нормы провоза багажа (элементы ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions```) с описанием норм провоза багажа (элементы ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties```) при помощи соответствия между элементами ```/BaggageProvisions/SubCodeInfo/SubCodeForAllowance``` и ```/SubCodeProperties/ExtendedSubCodeKey```.
4. В зависимости от способа файлирования норм провоза багажа информация может содержаться в следующих элементах:
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionOne/Text``` — текстовая информация о максимальном весе багажа, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
        - ```XX``` — вес в фунтах
        - ```YY``` — вес в килограммах
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/DescriptionTwo/Text``` — информация о максимальных размерах багажа, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
        - ```XX``` — длина в дюймах
        - ```YYY``` — длина в сантиметрах
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSizeInAlternate``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumSize``` — максимальный размер багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeightInAlternate``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties/SizeWeightInfo/MaximumWeight``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)
    - ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/NumPiecesBDI``` — количество мест багажа
    - ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions/WeightLimit``` — максимальный вес багажа (код единицы измерения указан в атрибуте ```/@Units```)

Нормы провоза ручной клади можно получить, воспользовавшись тем же алгоритмом, за исключением того, что в п.1 необходимо найти элементы, имеющие значение ```B``` (нормы провоза ручной клади).

Коды единиц измерения:
- ```C``` — сантиметры
- ```I``` — дюймы
- ```K``` — килограммы
- ```L``` — фунты

{% xmlsec "Пример (без багажа, 1 место ручной клади)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>PC OF BAG 31 50KG UPTO 203LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="50">
      <Text>UP TO 110 POUNDS/50 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6B">
      <Text>UP TO 80 LINEAR INCHES/203 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>027ACUT</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">203</MaximumSizeInAlternate>
      <MaximumSize Units="I">80</MaximumSize>
      <MaximumWeightInAlternate Units="K">50</MaximumWeightInAlternate>
      <MaximumWeight Units="L">110</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAAUT</ExtendedSubCodeKey>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="4">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>0</NumPiecesBDI>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAAUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="5">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="6">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">4413</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>UT</CarrierWhoseBaggageProvisionsApply>
  <Commissionable>N</Commissionable>
  <FeeNotGuaranteedIndicator>Y</FeeNotGuaranteedIndicator>
  <Interlineable>N</Interlineable>
  <NoChargeNotAvailableIndicator>X</NoChargeNotAvailableIndicator>
  <PassengerType Code="ADT"/>
  <PriceInformation>
    <Base Amount="0" CurrencyCode="RUB"/>
    <Equiv Amount="0" CurrencyCode="RUB"/>
    <Total>0</Total>
  </PriceInformation>
  <ProvisionType>C</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>027ACUT</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="7">
  <Associations>
    <CarrierCode RPH="1">UT</CarrierCode>
    <CarrierCode RPH="2">UT</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">4416</FlightNumber>
    <FlightNumber RPH="2">4413</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (неограниченное количество мест багажа до 30 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAATK</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABTK</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CountForSegmentAssociatedID>1</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="VKO" RPH="1"/>
    <FlightNumber RPH="1">415</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <PNR_Segment RPH="1">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0DFAATK</SubCodeForChargesOthers>
  </SubCodeInfo>
  <WeightLimit Units="K">30</WeightLimit>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">TK</CarrierCode>
    <CarrierCode RPH="2">TK</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="IST" RPH="1"/>
    <DestinationLocation LocationCode="VKO" RPH="2"/>
    <FlightNumber RPH="1">414</FlightNumber>
    <FlightNumber RPH="2">415</FlightNumber>
    <OriginLocation LocationCode="VKO" RPH="1"/>
    <OriginLocation LocationCode="IST" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">Y</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Y</ResBookDesigCode>
    <StatusCode RPH="1">SS</StatusCode>
    <StatusCode RPH="2">SS</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>TK</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>1</NumPiecesBDI>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForChargesOthers>0LNABTK</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}

{% xmlsec "Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)", false %}
<!--Часть ответа вырезана-->
<BaggageInfo>
  <SubCodeProperties RPH="1" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <CommercialNameofBaggageItemType>FREE BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0DFAALH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
  </SubCodeProperties>
  <SubCodeProperties RPH="2" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <BookingMethod>01</BookingMethod>
    <CommercialNameofBaggageItemType>UPTO70LB 32KG AND62LI 158LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="32">
      <Text>UP TO 70 POUNDS/32 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="6U">
      <Text>UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0FMACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">158</MaximumSizeInAlternate>
      <MaximumSize Units="I">62</MaximumSize>
      <MaximumWeightInAlternate Units="K">32</MaximumWeightInAlternate>
      <MaximumWeight Units="L">70</MaximumWeight>
    </SizeWeightInfo>
    <SSR_Code>XBAG</SSR_Code>
  </SubCodeProperties>
  <SubCodeProperties RPH="3" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRYON HAND BAGGAGE ALLOWANCE</CommercialNameofBaggageItemType>
    <EMD_Type>4</EMD_Type>
    <ExtendedSubCodeKey>0LNABLH</ExtendedSubCodeKey>
  </SubCodeProperties>
  <SubCodeProperties RPH="4" SolutionSequenceNmbr="1">
    <AncillaryFeeGroupCode>BG</AncillaryFeeGroupCode>
    <AncillaryService SubGroupCode="CY">
      <Text>CARRY ON HAND BAGGAGE</Text>
    </AncillaryService>
    <CommercialNameofBaggageItemType>CARRY8KG 18LB UPTO46LI 118LCM</CommercialNameofBaggageItemType>
    <DescriptionOne Code="08">
      <Text>UP TO 18 POUNDS/8 KILOGRAMS</Text>
    </DescriptionOne>
    <DescriptionTwo Code="4Y">
      <Text>UP TO 46 LINEAR INCHES/118 LINEAR CENTIMETERS</Text>
    </DescriptionTwo>
    <EMD_Type>2</EMD_Type>
    <ExtendedSubCodeKey>0M1ACLH</ExtendedSubCodeKey>
    <RFIC>C</RFIC>
    <SizeWeightInfo>
      <MaximumSizeInAlternate Units="C">118</MaximumSizeInAlternate>
      <MaximumSize Units="I">46</MaximumSize>
      <MaximumWeightInAlternate Units="K">8</MaximumWeightInAlternate>
      <MaximumWeight Units="L">18</MaximumWeight>
    </SizeWeightInfo>
  </SubCodeProperties>
</BaggageInfo>
<!--Часть ответа вырезана-->
<BaggageProvisions RPH="1">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="2">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CountForSegmentAssociatedID>2</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-08</DepartureDate>
    <DepartureDate RPH="2">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="DME" RPH="2"/>
    <FlightNumber RPH="1">1299</FlightNumber>
    <FlightNumber RPH="2">1452</FlightNumber>
    <OriginLocation LocationCode="IST" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <PNR_Segment RPH="1">4</PNR_Segment>
    <PNR_Segment RPH="2">5</PNR_Segment>
    <ResBookDesigCode RPH="1">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="2">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>A</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0FMACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0DFAALH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<BaggageProvisions RPH="3">
  <Associations>
    <CarrierCode RPH="1">LH</CarrierCode>
    <CarrierCode RPH="2">LH</CarrierCode>
    <CarrierCode RPH="3">LH</CarrierCode>
    <CarrierCode RPH="4">LH</CarrierCode>
    <CountForSegmentAssociatedID>4</CountForSegmentAssociatedID>
    <DepartureDate RPH="1">2018-04-01</DepartureDate>
    <DepartureDate RPH="2">2018-04-01</DepartureDate>
    <DepartureDate RPH="3">2018-04-08</DepartureDate>
    <DepartureDate RPH="4">2018-04-08</DepartureDate>
    <DestinationLocation LocationCode="FRA" RPH="1"/>
    <DestinationLocation LocationCode="IST" RPH="2"/>
    <DestinationLocation LocationCode="FRA" RPH="3"/>
    <DestinationLocation LocationCode="DME" RPH="4"/>
    <FlightNumber RPH="1">1449</FlightNumber>
    <FlightNumber RPH="2">1304</FlightNumber>
    <FlightNumber RPH="3">1299</FlightNumber>
    <FlightNumber RPH="4">1452</FlightNumber>
    <OriginLocation LocationCode="DME" RPH="1"/>
    <OriginLocation LocationCode="FRA" RPH="2"/>
    <OriginLocation LocationCode="IST" RPH="3"/>
    <OriginLocation LocationCode="FRA" RPH="4"/>
    <PNR_Segment RPH="1">2</PNR_Segment>
    <PNR_Segment RPH="2">3</PNR_Segment>
    <PNR_Segment RPH="3">4</PNR_Segment>
    <PNR_Segment RPH="4">5</PNR_Segment>
    <ResBookDesigCode RPH="1">P</ResBookDesigCode>
    <ResBookDesigCode RPH="2">P</ResBookDesigCode>
    <ResBookDesigCode RPH="3">Z</ResBookDesigCode>
    <ResBookDesigCode RPH="4">Z</ResBookDesigCode>
    <StatusCode RPH="1">QF</StatusCode>
    <StatusCode RPH="2">QF</StatusCode>
    <StatusCode RPH="3">QF</StatusCode>
    <StatusCode RPH="4">QF</StatusCode>
  </Associations>
  <CarrierWhoseBaggageProvisionsApply>LH</CarrierWhoseBaggageProvisionsApply>
  <NumPiecesBDI>2</NumPiecesBDI>
  <NumPiecesITR>2</NumPiecesITR>
  <ProvisionType>B</ProvisionType>
  <SubCodeInfo>
    <SubCodeForAllowance RPH="1">0M1ACLH</SubCodeForAllowance>
    <SubCodeForChargesOthers>0LNABLH</SubCodeForChargesOthers>
  </SubCodeInfo>
</BaggageProvisions>
<!--Часть ответа вырезана-->
{% endxmlsec %}
