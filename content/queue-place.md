---
title: Помещение бронирований в очереди
---

{{< toc >}}

## Введение

Бронирование может быть помещено в очередь по двум разным причинам:

- автоматически при наступлении определенного события
- вручную после отправки специального запроса

Список системных очередей и событий, при которых бронирования будут помещены в них автоматически представлены в разделе [Обработка очередей](queues.html).

Ниже представлены несколько способов помещения бронирования в очередь вручную.

## Помещения бронирования в очередь при создании бронирования (PassengerDetailsRQ)

См. [Создание бронирований в 2 шага](create-booking-2steps.html).

## Помещения бронирования в очередь при создании бронирования (CreatePassengerNameRecordRQ)

См. [Создание бронирований в 1 шаг](create-booking-1step.html).

## Помещение бронирования в очередь (QueuePlaceLLSRQ)

Для отправки открытого в текущей сессии бронирования в определенную очередь используется сервис [QueuePlaceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/queue/place_queue_message).

В запросе к сервису [QueuePlaceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/queue/place_queue_message) необходимо указать:
- ```/QueuePlaceRQ/QueueInfo/QueueIdentifier/@Number``` — номер очереди

Дополнительно можно указать:
- ```/QueuePlaceRQ/QueueInfo/QueueIdentifier/@PrefatoryInstructionCode``` — PIC, код причины постановки в очередь
- ```/QueuePlaceRQ/QueueInfo/QueueIdentifier/@PseudoCityCode``` — PCC (по умолчанию бронирование будет помещено в текущий PCC)

Сервис может поместить как текущее открытое в сессии бронирование, так и любое другое бронирование, для чего необходимо указать его код в атрибуте:
- ```/QueuePlaceRQ/QueueInfo/UniqueID/@ID``` — код бронирования, PNR Record Locator

{{< hint warning >}}
Обратите внимание на то, что после выполнения запроса все изменения в открытом бронировании будут сохранены, а бронирование закрыто.
{{< /hint >}}

{{< details title="Пример запроса" >}}
```XML
<QueuePlaceRQ ReturnHostCommand="true" Version="2.0.4" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <QueueInfo>
    <QueueIdentifier Number="400" PrefatoryInstructionCode="11" PseudoCityCode="9LSC"/>
    <UniqueID ID="DXKCZQ"/>
  </QueueInfo>
</QueuePlaceRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<QueuePlaceRS Version="2.0.4" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-02T15:17:48-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52D10D">QP/9LSC400/11*DXKCZQ</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <QueueInfo DateTime="04-02T15:17">
    <QueueIdentifier Number="0400" PseudoCityCode="9LSC"/>
    <UniqueID ID="DXKCZQ"/>
  </QueueInfo>
  <Text>QUEUE PLACEMENT COMPLETED</Text>
</QueuePlaceRS>
```
{{< /details >}}
