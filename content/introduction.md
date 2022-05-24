---
title: Начало работы
---

{{< toc >}}

## Документация

### Dev Studio

[Sabre Dev Studio](https://developer.sabre.com) — портал для разработчиков Sabre APIs, на котором располагается:
- [документация по сервисам](https://developer.sabre.com/product-catalog)
- [общая документация](https://developer.sabre.com/guides/travel-agency)
- [примеры использования](https://developer.sabre.com/solutions)
- [список обновлений](https://developer.sabre.com/release_notes)
- [блог](https://developer.sabre.com/blog)

Для каждого сервиса на Dev Studio есть страница с описанием и примером запроса и ответа, а также страница с ресурсами, на которой представлены:

- история изменения версий сервиса (Release Notes)
- документация по запросу к сервису (Request Documentation)
- документация по ответу от сервиса (Response Documentation)
- примеры запросов и ответов (Samples)
- ссылка на WSDL-файл (WSDL)
- ссылка на XSD-схемы запросов и ответов (Schemas)

### Рассылка Sabre APIs

Почтовая рассылка Sabre APIs содержит информацию о новых сервисах и продуктах, важных изменениях и других новостях. Для подписки на рассылку необходимо отправить адрес электронной почты своему куратору в Sabre.

### Sabre Central

[Sabre Central](https://central.sabre.com) — агентский портал Sabre, на котором доступны новости Sabre, обучающие материалы, документация по продуктам и другая информация. Для входа используется любая [учетная запись Sabre](configuration.html#учетные-записи-пользователей-epr).

### Sabre Central Marketpace

[Sabre Central Marketplace](https://central.sabre.com/marketplace) — агентский портал Sabre, на котором доступны описания всех продуктов Sabre. Для входа используется любая [учетная запись Sabre](configuration.html#учетные-записи-пользователей-epr).

### Finder

[Finder](https://central.sabre.com/s/finder) — справочная система по всем терминальным командам и настройкам Sabre. Для входа используется любая [учетная запись Sabre](configuration.html#учетные-записи-пользователей-epr).

### Справочник форматов Sabre

Справочник форматов Sabre доступен для загрузки на сайте [Sabre Helpdesk](http://airts.ru/upload/Manuals_and_Installers/Manuals/Practice_manuals/Format.pdf).

## Сервисы Sabre

В Sabre существуют два вида сервисов: SOAP и REST. В данном руководстве описано взаимодействие только с SOAP сервисами.

### Протокол SOAP
SOAP — протокол обмена сообщениями между несколькими системами, который использует язык разметки XML для сообщений.

Для взаимодействия с SOAP сервисами Sabre необходимо отправить специальным образом структурированное сообщение в формате XML через протокол HTTPS. В ответ сервис Sabre направит сообщение с результатами выполнения запроса. Все исходящие от сервисов Sabre сообщения всегда должны быть инициированы запросом со стороны системы агентства.

Для шифрования данных при отправке запросов к сервисам Sabre и получения ответов от них используется криптографический протокол TLS версии 1.2 и выше.

### Сообщения

Сообщения, отправляемые с использованием SOAP сервисов, должны быть обернуты в т.н. конверт (Envelope). SOAP конверт должен содержать заголовок сообщения (Header) и его тело (Body).

{{< details title="SOAP конверт" open=true >}}
```XML
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header>
    <!-- Заголовок сообщения-->
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <!-- Тело сообщения-->
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}

В заголовке сообщения необходимо добавить обязательные элементы:
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/From/PartyId``` — идентификатор отправителя. Может быть выбран произвольно отправителем. В ответе на запрос он будет указан в качестве идентификатора получателя
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/To/PartyId``` — идентификатор получателя. Может быть выбран произвольно отправителем. В ответе на запрос он будет указан в качестве идентификатора отправителя
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/ConversationId``` — идентификатор диалога. Может быть выбран произвольно отправителем. Он будет использован в ответе на запрос в качестве идентификатора диалога
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/MessageData/MessageId``` — идентификатор сообщения. Может быть выбран произвольно отправителем. Он будет использован в ответе на запрос в качестве идентификатора сообщения, для которого отправляется ответ
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/MessageData/Timestamp``` — время отправки сообщения. Может быть указано произвольно отправителем
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/MessageHeader/Action``` — название используемого [сервиса](services.html)
- ```/SOAP-ENV:Envelope/SOAP-ENV:Header/Security/BinarySecurityToken``` — токен сессии или токен доступа (используется для всех запросов кроме запроса на создание сессии или токена доступа, подробнее см. [Аутентификация](authentication.html))

{{< details title="Пример" open=true >}}
```XML
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Header>
    <MessageHeader xmlns="http://www.ebxml.org/namespaces/messageHeader">
      <From>
        <PartyId>Agency</PartyId>
      </From>
      <To>
        <PartyId>Sabre</PartyId>
      </To>
      <ConversationId>694ec185-72b5-40c8-bdb8-2d11efb16e0a</ConversationId>
      <MessageData>
        <MessageId>21d22b9c-69d1-4f82-a602-f814be4c0ac7</MessageId>
        <Timestamp>2018-04-02T19:35:13</Timestamp>
      </MessageData>
      <Action>CreatePassengerNameRecordRQ</Action>
    </MessageHeader>
    <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <BinarySecurityToken>Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758208100314490!1658458!0</BinarySecurityToken>
    </Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <!-- Тело сообщения -->
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}

### Компрессия данных

Для ускорения получения ответов от сервисов Sabre рекомендуется включить gzip компрессию ответов, указав в HTTP-заголовках запросов параметр ```Accept-Encoding``` со значением ```gzip, deflate```:

{{< details title="Заголовок" open=true >}}
```
Accept-Encoding: gzip, deflate
```
{{< /details >}}

## Среды и адреса для отправки запросов

В Sabre существует две среды для работы:
- **CERT**. Тестовая среда для разработки и отладки приложений. В этой среде можно создавать тестовые бронирования и оформлять билеты без необходимости их отмены. Среда подключена к тестовым средам перевозчиков, поэтому некоторые действия могут быть недоступны в ней (см. ниже). Адрес для отправки запросов: ```https://sws-crt.cert.havail.sabre.com```
- **RES**. "Боевая" среда для использования в приложениях. Среда подключена к боевым средам перевозчиков. Адрес для отправки запросов: ```https://webservices.havail.sabre.com```

Каждой среде соответствует специальная сборка терминала Sabre Red: [PROD](http://updatesite.my.sabre.com/updatesite/installers/jre/srw.html), [CERT](http://updatesite.my.cert.sabre.com/updatesite/installers/jre/srw.html).

Среды независимы друг от друга, это означает, что в случае выполнения каких-либо изменений в одной среде (создание бронирования, изменение настроек, создание или изменение учетных записей и т.д.), эти изменения не попадут в другую среду. Однако, два раза в год тестовая среда очищается и на ней разворачивается выполненный ранее слепок из боевой среды. Агентства заранее уведомляются об этом [рассылкой](introduction.html#рассылка-sabre-apis).

Создаваемый слепок содержит в себе [учетные записи](configuration.html#учетные-записи-пользователей-epr) и [настройки PCC](tjr-settings.html), но не содержит бронирования или билеты. Поэтому не рекомендуется изменять или создавать учетные записи или настройки в тестовой среде в момент между созданием слепка среды и его разворачиванием в тестовой среде.

При работе в среде **CERT** могут возникать проблемы при получении информации о наличии мест, подтверждении бронирования и оформлении билетов для некоторых перевозчиков. Для того чтобы избежать этих проблем рекомендуется проводить тестирование на следующих перевозчиках:

- EY — Etihad
- B2 — Belavia
- DV — SCAT Airlines
- KC — Air Astana
- AA — American Airlines

Также рекомендуется создавать бронирования с более ранними датами вылета (не более недели от текущей даты).

## Терминальные команды

Многие сервисы Sabre имеют аналогичные команды, доступные в терминале Sabre (в синем экране). Соответствующую команду можно увидеть в документации к некоторым сервисам, а также в ответе на запрос, если в корневом элементе последнего указать значение ```true``` у атрибута ```ReturnHostCommand```. Такая возможность предусмотрена для тех сервисов, название которых содержит буквы LLS, например сервис [IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/Ignore_Transaction) (игнорирование бронирования).

{{< details title="Пример запроса" open=true >}}
```XML
<IgnoreTransactionRQ ReturnHostCommand="true" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10"/>
```
{{< /details >}}

В ответе на данный запрос будет указана аналогичная команда для терминала Sabre — ```I```.

{{< details title="Пример ответа" open=true >}}
```XML
<IgnoreTransactionRS Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-03T12:05:22-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="10EB49">I</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</IgnoreTransactionRS>
```
{{< /details >}}

## Примеры исходных кодов

См. раздел [Solutions](https://developer.sabre.com/solutions/sample-code) на портале Sabre Dev Studio.

## Обработка ошибок

См. раздел [Errors](https://developer.sabre.com/docs/travel-agency/guides/reference/errors) на портале Sabre Dev Studio.

## Версионирование

Sabre APIs поддерживают [семантическое версионирование](http://semver.org/lang/ru). Это означает, что номер версии каждого сервиса состоит из 3 чисел, разделенных точками, например ```3.2.0```, где:
- первое число — мажорная версия сервиса. Меняется при несовместимых изменения сервиса с изменением схемы запроса или ответа
- второе число — минорная версия сервиса. Меняется при добавлении нового функционала с изменением схемы запроса или ответа без нарушения обратной совместимости
- третье число — патч версия сервиса. Меняется при добавлении незначительных изменений, не влияющих на схему запроса или ответа

Sabre официально поддерживает только 5 последних версий каждого сервиса. Более ранние версии также могут работать, однако официально не поддерживаются.

{{< hint warning >}}
Обратите внимание на то, что ранние версии сервисов могут быть отключены. Список версий сервисов, планируемых к отключению, представлен на портале [Sabre Dev Studio](https://developer.sabre.com/guides/travel-agency/developer-guides/api-retirement-schedule).
{{< /hint >}}
