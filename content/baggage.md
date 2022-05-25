---
title: Получение норм провоза багажа
---

{{< toc >}}

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

## Получение норм провоза багажа и ручной клади в поисковой выдаче или при проверке стоимости и наличия мест (BargainFinderMaxRQ, BargainFinderMax_ADRQ, RevalidateItinRQ)

Для получения всей возможной информации о нормах провоза багажа необходимо указать значение ```A``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@RequestType``` и значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@Description```.

Для получения информации о нормах провоза ручной клади на борту необходимо указать значение ```true``` у атрибута ```/OTA_AirLowFareSearchRQ/TravelPreferences/Baggage/@CarryOnInfo```.

{{< details title="Пример" >}}
```XML
<Baggage CarryOnInfo="true" Description="true" RequestType="A"/>
```
{{< /details >}}

Информация о багаже и ручной клади будет представлена в разных элементах ответа в зависимости от выбранного [вида ответа](shop.html#вид-ответа).

#### OTA ответ

Для каждой найденной рекомендации ответ на запрос может содержать один или несколько элементов ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/ItinTotalFare/TPA_Extensions/BaggageInformationList/BaggageInformation```, который будет содержать информацию о нормах провоза багажа (если значение атрибута ```/@ProvisionType``` равно ```A```) или ручной клади (если значение атрибута ```/@ProvisionType``` равно ```B```). Для каждого элемента в атрибутах ```/BaggageInformation/Segment/@Id``` указаны номера сегментов, для которых применима норма провоза багажа.

В зависимости от способа файлирования норм провоза багажа/ручной клади ответ может содержать:
- ```/Allowance/@Pieces``` — количество мест багажа/ручной клади
- ```/Allowance/@Weight``` — максимальный вес всех мест багажа/ручной клади
- ```/Allowance/@Unit``` — единицы измерения, как правило в килограммах (```kg```)
- ```/Allowance/@Description1``` — информация о максимальном весе багажа/ручной клади, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
    - ```XX``` — вес в фунтах
    - ```YY``` — вес в килограммах
- ```/Allowance/@Description2``` — информация о максимальных размерах багажа/ручной клади, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
    - ```XX``` — длина в дюймах
    - ```YYY``` — длина в сантиметрах

{{< details title="Пример (без багажа)" >}}
```XML
<Allowance Pieces="0"/>
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
<Allowance Weight="30" Unit="kg"/>
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг)" >}}
```XML
<Allowance Pieces="2" Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS"/>
```
{{< /details >}}

#### GIR ответ

Для каждой найденной рекомендации ответ на запрос может содержать один или несколько элементов ```/GroupedItineraryResponse/ItineraryGroup/Itinerary/PricingInformation/Fare/PassengerInfo/BaggageInformation```, который будет содержать информацию о нормах провоза багажа (если значение атрибута ```/@ProvisionType``` равно ```A```) или ручной клади (если значение атрибута ```/@ProvisionType``` равно ```B```). Для каждого элемента в атрибутах ```/BaggageInformation/Segment/@Id``` указаны номера сегментов, для которых применима норма провоза багажа. В качестве значения атрибута  ```/BaggageInformation/Allowance/@Ref``` будет указана ссылка на соответствующий элемент ```/GroupedItineraryResponse/BaggageAllowanceDesc```, в котором в зависимости от способа файлирования норм провоза багажа/ручной клади может быть указано:
- ```/@Pieces``` — количество мест багажа/ручной клади
- ```/@Weight``` — максимальный вес всех мест багажа/ручной клади
- ```/@Unit``` — единицы измерения, как правило в килограммах (```kg```)
- ```/@Description1``` — информация о максимальном весе багажа/ручной клади, как правило в формате ```UP TO XX POUNDS/YY KILOGRAMS```, где:
    - ```XX``` — вес в фунтах
    - ```YY``` — вес в килограммах
- ```/@Description2``` — информация о максимальных размерах багажа/ручной клади, как правило в формате ```UP TO XX LINEAR INCHES/YYY LINEAR CENTIMETERS```, где:
    - ```XX``` — длина в дюймах
    - ```YYY``` — длина в сантиметрах

{{< details title="Пример (без багажа)" >}}
```XML
<BaggageAllowanceDesc ID="1" Pieces="0"/>
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
<BaggageAllowanceDesc ID="1" Weight="30" Unit="kg"/>
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг)" >}}
```XML
<BaggageAllowanceDesc ID="1" Pieces="2" Description1="UP TO 70 POUNDS/32 KILOGRAMS" Description2="UP TO 62 LINEAR INCHES/158 LINEAR CENTIMETERS"/>
```
{{< /details >}}

## Получение норм провоза багажа и ручной клади при создании бронирования в 1 шаг (CreatePassengerNameRecordRQ)

При создании бронирования при помощи сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.html)) ответ будет содержать информацию о нормах провоза багажа и ручной клади.

Эти данные будут располагаться в двух местах:
- ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/CreatePassengerNameRecordRS/AirPrice/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
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

{{< details title="Пример (без багажа, 1 место ручной клади)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)" >}}
```XML
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
```
{{< /details >}}

## Получение норм провоза багажа и ручной клади при создании бронирования в 2 шага (EnhancedAirBookRQ)

При создании бронирования при помощи сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.html)) ответ будет содержать информацию о нормах провоза багажа и ручной клади.

Эти данные будут располагаться в двух местах:
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
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

{{< details title="Пример (без багажа, 1 место ручной клади)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)" >}}
```XML
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
```
{{< /details >}}

## Получение норм провоза багажа и ручной клади без имеющегося бронирования (EnhancedAirBookRQ)

Для получения норм провоза багажа без имеющегося бронирования используется сервис [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking), который позволяет забронировать сегменты, выполнить расчет стоимости и игнорировать созданные сегменты.

Запрос к сервису строится по аналогии с запросом на бронирование (см. [Создание бронирований в 2 шага](create-booking-2steps.html)) за исключением:
- указывается статус сегмента ```QF``` (атрибут ```/EnhancedAirBookRQ/OTA_AirBookRQ/OriginDestinationInformation/FlightSegment/@Status```) — специальный статус сегмента, используемый исключительно для расчета стоимости. При бронировании сегментов с таким статусом не отправляется запрос в инвенторную систему перевозчика
- отсутствует атрибут ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/@Retain``` — сохранение PQ не требуется
- у атрибутов ```/EnhancedAirBookRQ/PreProcessing/@IgnoreBefore``` и ```/EnhancedAirBookRQ/PostProcessing/@IgnoreAfter``` устанавливается значение ```true``` — игнорирование текущего бронирования до и после выполнения запроса

В результате работы сервиса создаются фиктивные сегменты со статусом QF, для которых производится расчет стоимости, после чего бронирование игнорируется.

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
    <Success timeStamp="2022-05-24T11:59:42.698-05:00"/>
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
          <GrandTotalTaxes>45582</GrandTotalTaxes>
          <RequiresRebook>false</RequiresRebook>
          <TicketNumber>0</TicketNumber>
          <TotalAmount>530852</TotalAmount>
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
      <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="530852">
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
            <Taxes TotalAmount="16713">
              <Tax Amount="2490" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
              <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="158" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1102" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="6216" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
              <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="186823" CurrencyCode="RUB"/>
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
            <Taxes TotalAmount="8007">
              <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
              <Tax Amount="158" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
              <Tax Amount="1102" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
              <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="136287" CurrencyCode="RUB"/>
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
            <Taxes TotalAmount="4149">
              <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
            </Taxes>
            <TotalFare Amount="20919" CurrencyCode="RUB"/>
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
        </AirItineraryPricingInfo>
      </PricedItinerary>
    </PriceQuote>
  </OTA_AirPriceRS>
</EnhancedAirBookRS>
```
{{< /details >}}

Информация о нормах провоза багажа и ручной клади будет располагаться в двух местах:
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/EnhancedAirBookRS/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
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

{{< details title="Пример (без багажа, 1 место ручной клади)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)" >}}
```XML
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
```
{{< /details >}}

## Получение норм провоза багажа и ручной клади для открытого бронирования (OTA_AirPriceLLSRQ)

Для получения норм провоза багажа и ручной клади для открытого бронирования (см. [Редактирование бронирований](edit-booking.html)) необходимо отправить запрос к сервису [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary).

Запрос к сервису составляется по аналогии с заполнением элемента ```AirPrice``` сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.html)) или элемента ```OTA_AirPriceRQ``` сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.html)).

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
        <PassengerType Code="ADT" Quantity="2"/>
        <PassengerType Code="CNN" Quantity="1"/>
        <PassengerType Code="INF" Quantity="1"/>
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
    <stl:Success timeStamp="2022-05-24T12:02:01-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WPAEY¥P2ADT/1CNN/1INF¥BRYF</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
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
        <DepartureDate>2022-12-01</DepartureDate>
        <Text>VALIDATING CARRIER SPECIFIED</Text>
        <Text>BSP - EY</Text>
        <Text>TCH - EY</Text>
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
        <GrandTotalTaxes>45582</GrandTotalTaxes>
        <RequiresRebook>false</RequiresRebook>
        <TicketNumber>0</TicketNumber>
        <TotalAmount>530852</TotalAmount>
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
    <PricedItinerary AlternativePricing="false" CurrencyCode="RUB" MultiTicket="false" TotalAmount="530852">
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
          <Taxes TotalAmount="16713">
            <Tax Amount="2490" TaxCode="AU" TaxName="PASSENGER MOVEMENT CHARGE  PMC" TicketingTaxCode="AU"/>
            <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="158" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1102" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="6216" TaxCode="GB" TaxName="AIR PASSENGER DUTY APD" TicketingTaxCode="GB"/>
            <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="186823" CurrencyCode="RUB"/>
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
          <Taxes TotalAmount="8007">
            <Tax Amount="2598" TaxCode="WY" TaxName="PASSENGER SERVICES CHARGE DEPA" TicketingTaxCode="WY"/>
            <Tax Amount="158" TaxCode="ZR2" TaxName="INTERNATIONAL ADVANCED PASSENG" TicketingTaxCode="ZR"/>
            <Tax Amount="1102" TaxCode="F62" TaxName="PASSENGER FACILITIES CHARGE" TicketingTaxCode="F6"/>
            <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="136287" CurrencyCode="RUB"/>
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
          <Taxes TotalAmount="4149">
            <Tax Amount="4149" TaxCode="UB" TaxName="PASSENGER SERVICE CHARGE DEPAR" TicketingTaxCode="UB"/>
          </Taxes>
          <TotalFare Amount="20919" CurrencyCode="RUB"/>
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
      </AirItineraryPricingInfo>
    </PricedItinerary>
  </PriceQuote>
</OTA_AirPriceRS>
```
{{< /details >}}

Информация о нормах провоза багажа и ручной клади будет располагаться в двух местах:
- ```/OTA_AirPriceRS/PriceQuote/MiscInformation/BaggageInfo/SubCodeProperties``` — общее описание норм провоза багажа и ручной клади
- ```/OTA_AirPriceRS/PriceQuote/PricedItinerary/AirItineraryPricingInfo/BaggageProvisions``` — нормы провоза багажа для каждого созданного элемента расчета (PQ) в бронировании

Для того чтобы получить информацию о нормах провоза багажа для каждого PQ в бронировании, необходимо:
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

{{< details title="Пример (без багажа, 1 место ручной клади)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (неограниченное количество мест багажа до 30 кг)" >}}
```XML
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
```
{{< /details >}}

{{< details title="Пример (2 места багажа до 32 кг и 2 места ручной клади до 8 кг)" >}}
```XML
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
```
{{< /details >}}
