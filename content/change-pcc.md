---
title: Переход в другие PCC
---

По умолчанию после создания [сессии](authentication.html#сессии) текущим PCC будет выбран тот PCC, в котором была создана эта сессия. Для того чтобы изменить текущий PCC нужно в него перейти. Это можно сделать двумя способами:
- используя встроенную в некоторые сервисы возможность перехода в другой PCC:
    - [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.html#переход-в-другой-pcc))
    - [UpdatePassengerNameRecordRQ](https://developer.sabre.com/docs/soap_apis/air/book/update_passenger_name_record) (см. [Редактирование бронирований](edit-booking.html#dobavlenie_elementov_bronirovaniya_updatepassengernamerecordrq))
    - [AirTicketRQ](https://developer.sabre.com/docs/soap_apis/air/fulfill/enhanced_air_ticket) (см. [Оформление билетов и EMD](issue-ticket.html#переход-в-другой-pcc))
    - [ExchangeBookingRQ](https://developer.sabre.com/docs/read/soap_apis/air/fulfill/exchange_booking) (см. [Оформление билетов и EMD](exchange-ticket.html#переход-в-другой-pcc))
- используя сервис для перехода в другой PCC [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa)


{{< hint warning >}}
Обратите внимание на то, что для перехода в другой PCC требуется наличие Branch Access между ним и iPCC, в котором была создана сессия. Подробнее о Branch Access см. в разделе [Конфигурация Sabre](configuration.html).
{{< /hint >}}

В запросе к сервису ContextChangeLLSRQ необходимо указать PCC для перехода в качестве значения атрибута  ```/ContextChangeRQ/ChangeAAA/@PseudoCityCode```.

{{< details title="Пример запроса" >}}
```XML
<ContextChangeRQ ReturnHostCommand="true" Version="2.0.3" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <ChangeAAA PseudoCityCode="2FRH"/>
</ContextChangeRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<ContextChangeRS Version="2.0.3" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-22T03:20:01-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="1936F4">AAA2FRH*SWS-OVER*</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <SecurityToken Updated="false">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!1579684797721!317!9</SecurityToken>
  <Text>2FRH.9LSC*AWT.A</Text>
  <Text>NO MESSAGE..22JAN</Text>
</ContextChangeRS>
```
{{< /details >}}
