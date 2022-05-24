---
title: Аутентификация
aliases:
    - /sessions
---

{{< toc >}}

## Введение

Для аутентификации в системе Sabre при использовании Sabre APIs могут быть использованы два механизма:
- сессии (sessions)
- токены доступа (access tokens)

В таблице ниже описаны принципиальные различия двух механизмов:

|   | Сессии | Токены доступа |
|---|---|---|
| **Используются для аутентификации и авторизации** | Да | Да |
| **Хранят состояние (каждый последующий запрос зависит от предыдущего)** | Да | Нет |
| **Время жизни** | Гарантированное время жизни — 15 минут, максимальное время жизни — 30 минут | 7 дней |
| **Одновременное использование одной сессии или токена в нескольких запросах** | Нет | Да |
| **Максимальное количество одновременно активных сессий или токенов доступа** | От 50 одновременно открытых сессий (в зависимости от настроек PCC) | Без ограничений |
| **Принудительное закрытие** | [Каждое воскресенье в 00:15 по Центральноамериканскому времени (08:15 по Московскому времени летом и в 09:15 зимой)](http://files.developer.sabre.com/doc/developmentpatterns/NORMOAA_Pattern_2015-2-20.pdf) | Нет |
| **Поддержка сервисами** | Все сервисы | Некоторые сервисы (см. список в [Список сервисов](services.html)) |
| **Создание** | [SessionCreateRQ](https://developer.sabre.com/docs/soap_apis/session_management/create_session) | [TokenCreateRQ](https://developer.sabre.com/docs/read/soap_apis/session_management/create_access_token) |
| **Закрытие** | [SessionCloseRQ](https://developer.sabre.com/docs/soap_apis/session_management/close_session) | Недоступно |
| **Продление времени жизни** | [OTA_PingRQ](https://developer.sabre.com/docs/soap_apis/session_management/refresh_session) или отправка любого запроса | Недоступно |

После создания сессии или токена доступа в ответе будет представлен идентификатор сессии или токена доступа.

Пример идентификатора сессии:

```
Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESA!ICESMSLB\/RES.LB!-3292053128691423346!1291480!0
```

Пример идентификатора токена доступа:

```
T1RLAQId95/WFF0HHN4hYzDJDxQdcQzEDhDPlavekGd+JIT1h1yTVCggAACwUYKogIH6j6DlWeQQbK3oVdLvm1P/B+y0FwmSZTetQIIBMnVOoQ8XJ5pql0LZpCsAfPWnLf9mndGQbJKBUZ0Ggs5gsdVwxJ/C0WEd1GHcAk6EzzpJLSTaEejbi1i4rxmZzynu9zlG6up6WomVrxutpOVly4EUmlLWcxxyrJ3S4kDYWzBPgB4ttLYaA4Jl9VbPvAKxtuULknOuMSZu9m1HxUFx+npDEqx/NoLmjma+TCg*
```

Полученный идентификатор необходимо указать в качестве значения элемента ```/SOAP-ENV:Envelope/SOAP-ENV:Header/Security/BinarySecurityToken``` любого запроса.

Дополнительную информацию об аутентификации в Sabre APIs можно получить на портале [Sabre Dev Studio](https://developer.sabre.com/guides/travel-agency/developer-guides/manage-token).

## Сессии

### Создание сессии (SessionCreateRQ)

Для создания сессии используется сервис [SessionCreateRQ](https://developer.sabre.com/docs/soap_apis/session_management/create_session).

В запросе необходимо указать:
- ```wsse:Username``` — имя пользователя (референция, EPR)
- ```wsse:Password``` — пароль
- ```Organization``` — iPCC
- элемент ```Domain``` должен содержать значение ```DEFAULT```

Ответ будет содержать токен созданной сессии ```wsse:BinarySecurityToken```, который необходимо использовать при отправке других запросов.

{{< details title="Пример запроса" >}}
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
      <ConversationId>330c2c47-b98a-48b5-aa10-718d254ef3bc</ConversationId>
      <MessageData>
        <MessageId>1d7aa47e-149a-4261-b421-741a4c452942</MessageId>
        <Timestamp>2018-04-02T19:24:16</Timestamp>
      </MessageData>
      <Action>SessionCreateRQ</Action>
    </MessageHeader>
    <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <UsernameToken>
        <Username>{{username}}</Username>
        <Password>{{password}}</Password>
        <Organization>{{pcc}}</Organization>
        <Domain>DEFAULT</Domain>
      </UsernameToken>
    </Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <SessionCreateRQ Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2002/11"/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}


{{< details title="Пример ответа" >}}
```XML
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>330c2c47-b98a-48b5-aa10-718d254ef3bc</eb:ConversationId>
      <eb:Service eb:type="sabreXML">Session</eb:Service>
      <eb:Action>SessionCreateRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1645456698561970611</eb:MessageId>
        <eb:Timestamp>2018-04-02T19:24:16</eb:Timestamp>
        <eb:RefToMessageId>1d7aa47e-149a-4261-b421-741a4c452942</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758806579122550!1655914!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <SessionCreateRS status="Approved" version="1" xmlns="http://www.opentravel.org/OTA/2002/11">
      <ConversationId>330c2c47-b98a-48b5-aa10-718d254ef3bc</ConversationId>
    </SessionCreateRS>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}

В случае, если логин или пароль в запросе неверные или учетная запись заблокирована, то система вернет ответ с ошибкой ```USG_AUTHENTICATION_FAILED```. В этом случае рекомендуется [сменить пароль и при необходимости разблокировать EPR](configuration.html#смена-пароля-и-разблокировка-epr).

{{< details title="Пример ответа с ошибкой" >}}
```XML
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>dcee8572-2958-47a3-bda5-13b15868325f</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>2327729667967520610</eb:MessageId>
        <eb:Timestamp>2020-01-17T18:33:16</eb:Timestamp>
        <eb:RefToMessageId>1a35d735-4582-4756-9f4c-cd627ccf1786</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.AuthenticationFailed</faultcode>
      <faultstring>Authentication failed</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_AUTHENTICATION_FAILED</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}

### Обновление сессии (OTA_PingRQ)

Для того чтобы сессия не была закрыта по таймауту необходимо отправить запрос к сервису [OTA_PingRQ](https://developer.sabre.com/docs/soap_apis/session_management/refresh_session).

{{< details title="Пример запроса" >}}
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
      <ConversationId>0dc27b92-e02b-4f1e-8355-97f2f9bd3a60</ConversationId>
      <MessageData>
        <MessageId>87cb2dda-0464-4b96-9a72-baf8f6286bcf</MessageId>
        <Timestamp>2018-04-02T19:25:16</Timestamp>
      </MessageData>
      <Action>OTA_PingRQ</Action>
    </MessageHeader>
    <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <BinarySecurityToken EncodingType="Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758806579122550!1655914!0</BinarySecurityToken>
    </Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <OTA_PingRQ Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2003/05"/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>0dc27b92-e02b-4f1e-8355-97f2f9bd3a60</eb:ConversationId>
      <eb:Service eb:type="sabreXML">Session</eb:Service>
      <eb:Action>OTA_PingRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1647317699162230610</eb:MessageId>
        <eb:Timestamp>2018-04-02T19:25:16</eb:Timestamp>
        <eb:RefToMessageId>87cb2dda-0464-4b96-9a72-baf8f6286bcf</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758806579122550!1655914!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <OTA_PingRS Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2003/05">
      <Success/>
      <EchoData/>
    </OTA_PingRS>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}

### Закрытие сессии (SessionCloseRQ)

Для закрытия сессии используется сервис [SessionCloseRQ](https://developer.sabre.com/docs/soap_apis/session_management/close_session).

В запросе необходимо указать:
- ```wsse:BinarySecurityToken``` — токен сессии
 
{{< details title="Пример запроса" >}}
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
      <ConversationId>ef18b24d-6c48-48f0-8357-ab4dbfc22742</ConversationId>
      <MessageData>
        <MessageId>9f23c9a8-1cea-4ba4-8edd-b8d2f0335c57</MessageId>
        <Timestamp>2018-04-02T19:25:33</Timestamp>
      </MessageData>
      <Action>SessionCloseRQ</Action>
    </MessageHeader>
    <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <BinarySecurityToken EncodingType="Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758806579122550!1655914!0</BinarySecurityToken>
    </Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <SessionCloseRQ Version="1.0.0" xmlns="http://www.opentravel.org/OTA/2002/11"/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<?xml version="1.0" encoding="UTF-8"?>
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>ef18b24d-6c48-48f0-8357-ab4dbfc22742</eb:ConversationId>
      <eb:Service eb:type="sabreXML">Session</eb:Service>
      <eb:Action>SessionCloseRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1647964699332930610</eb:MessageId>
        <eb:Timestamp>2018-04-02T19:25:33</eb:Timestamp>
        <eb:RefToMessageId>9f23c9a8-1cea-4ba4-8edd-b8d2f0335c57</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3161758806579122550!1655914!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <SessionCloseRS status="Approved" version="1" xmlns="http://www.opentravel.org/OTA/2002/11"/>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}

### Получение информации об используемых сессиях (OLTMC USER DISP NAME)

Для того чтобы узнать количество используемых на данный момент сессий для определенного iPCC необходимо отправить терминальную команду ```OLTMC USER DISP NAME [iPCC]``` при помощи сервиса [SabreCommandLLSRQ](commands.html) или в терминале Sabre Red.

Например, для получения информации о сессиях для iPCC 9LSC необходимо отправить команду ```OLTMC USER DISP NAME 9LSC```.

Ответ будет содержать информацию о количестве используемых сессий (```INUSE```) и о максимальном количестве доступных сессий для данного iPCC (```MAX```).

{{< details title="Пример ответа системы" open=true >}}
```
CSMP0097I 05.05.34 CPU-D SS-BSS  SSU-AA   IS-01                 
                                                                
-TAM USER CONTROL FILE-                                         
 MAXIMUM DEFINABLE USERS    - 14999                             
 MAXIMUM CONFIGURABLE USERS - 14999                             
 CURRENT NUMBER USERS -       14507                             
 USER FLUSH CRET TIME VALUE -   60                              
-TAM USER FILE-                                                 
NAME             UORD T/O O OXIT RXIT S    MAX      INUSE   PCT 
---------------- ---- --- - ---- ---- - --------- --------- --- 
9LSC             2549  15             A        50         1   0 
 KEYWORDS - TA/9LSC CRTSST  DYNTAC  HSSPDB                      
 DELTAS - OBTAIN    0  RELEASE    0 FLUSH VALUE    5            
 DR CANDIDATE - N  REPORT - N                                   
 INUSE DATE - 08.29.2016                                        
                                                                
END OF DISPLAY                                                  
```
{{< /details >}}

### Использование сессий, созданных в Sabre Red (OIATH)

Во время процесса разработки может быть полезно использование *общего состояния*, как при работе через Sabre APIs, так и при работе в терминале Sabre Red. Под *общим состоянием* подразумевается текущие несохраненные данные в бронировании, очередях и других объектах системы. Например, использование *общего состояния* позволяет добавить в бронирование сегменты при помощи сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) без его сохранения, а затем увидеть эти сегменты в терминале Sabre Red, отправив команду ```*A```.

Для этого необходимо в терминале Sabre Red отправить команду ```OIATH``` и получить в виде ответа токен сессии. Данный токен можно использовать при отправке запросов так же, как и токен созданный при помощи сервиса [SessionCreateRQ](https://developer.sabre.com/docs/soap_apis/session_management/create_session).

{{< hint warning >}}
Обратите внимание на то, что идентификатор сессии будет только та часть ответа, которая находится после ```ATH:``` в начале ответа и перед ```!X!E2E-1``` в конце ответа (```X``` — любая цифра).
{{< /hint >}}

{{< rawhtml >}}
<pre>
ATH:<b>Shared/IDL:IceSess\/SessMgr:1\\.0.IDL/Common/!ICESMS\/RESC!IC
ESMSLB\/RES.LB!-3364983643868498554!1481458!0</b>!1!E2E-1           
</pre>
{{< /rawhtml >}}

Идентификатор сессии из ответа:

```
Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESC!ICESMSLB\/RES.LB!-3364983643868498554!1481458!0
```

Для упрощения копирования идентификатора сессии из терминала Sabre Red можно использовать скрипт ```COPYSESS```. Для его установки необходимо:
1. Загрузить файл скрипта [```COPYSESS.SSC```](/sabre-apis-ru/assets/oiath/COPYSESS.SSC) и переместить его в директорию ```C:\sabre\apps\scribe\compiled```.
2. Загрузить файл с настройками вызова скрипта [```commands.properties```](/sabre-apis-ru/assets/oiath/commands.properties) и переместить его в директорию ```C:\sabre\apps\emulator\scribe```. В случае, если этот файл уже существует, необходимо скопировать содержимое загружаемого файла и вставить его в конце существующего файла на новой строке.
3. Загрузить файл с настройками функциональных клавишей (PF Keys) [```Untitled.pfkey```](/sabre-apis-ru/assets/oiath/Untitled.pfkey) и переместить его в директорию ```C:\sabre\apps\emulator```. В случае, если функциональные клавиши уже используются в терминале на этом компьютере, то вместо копирования этого файла можно указать команду ```COPYSESS^E``` для одной из свободных функциональных клавиш.
4. Перезагрузить Sabre Red.

После перезагрузки Sabre Red и аутентификации в терминале при нажатии клавиши F1 (или другой, если это было настроено в п.3 процесса установки) система скопирует идентификатор сессии в буфер обмена и выведет следующие строки на экране:

{{< details title="Пример ответа системы" open=true >}}
```
COPYSESS«                                                       
                                                                
OIATH«                                                          
ATH:Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC
!ICESMSLB\/CRT.LB!-3197236142667972213!884762!0!2!E2E-1         
                                                                
SESSION ID COPIED TO CLIPBOARD                                  
```
{{< /details >}}

## Токены доступа

### Создание токена доступа (TokenCreateRQ)

Для создания токена доступа используется сервис [TokenCreateRQ](https://developer.sabre.com/docs/read/soap_apis/session_management/create_access_token).

Ответ будет содержать токен доступа ```wsse:BinarySecurityToken```, который необходимо использовать при отправке других запросов.

{{< details title="Пример запроса" >}}
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
      <ConversationId>d8667e6f-0050-4c98-8fbe-ed8d79a008a4</ConversationId>
      <MessageData>
        <MessageId>4873775b-aa60-43bc-ae9b-7d1840bc6daa</MessageId>
        <Timestamp>2018-04-02T19:25:50</Timestamp>
      </MessageData>
      <Action>TokenCreateRQ</Action>
    </MessageHeader>
    <Security xmlns="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <UsernameToken>
        <Username>{{username}}</Username>
        <Password>{{password}}</Password>
        <Organization>{{pcc}}</Organization>
        <Domain>DEFAULT</Domain>
      </UsernameToken>
    </Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <TokenCreateRQ Version="1.0.0" xmlns="http://webservices.sabre.com"/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>d8667e6f-0050-4c98-8fbe-ed8d79a008a4</eb:ConversationId>
      <eb:Service eb:type="sabreXML">Session</eb:Service>
      <eb:Action>TokenCreateRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1648742699503030611</eb:MessageId>
        <eb:Timestamp>2018-04-02T19:25:50</eb:Timestamp>
        <eb:RefToMessageId>4873775b-aa60-43bc-ae9b-7d1840bc6daa</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">T1RLAQII6gb1blvvNycUxRL/XU6jz3TzRxBhcKDCU+SK/Lax/8XbqVALAACwy1YZr0cXtc9J6wYs/Ka+9Cxptihqez0exrjLhwuaDEW9A9HEnLpiKkxWxBpfELheq5LOt2EQZ0JMXeLcC5LGbJMZiburegseXnCcUTCSlZA8EpG6pFRBDUfKRH2tgDVrFfdlLth5yD61uve+58IHhpbdMVNkJDlUISf4Q+ZlCPek8ys3ZWZ6P0KXKQ5BCjKh6th0yNJvSWjjOkuhqBVT56Izh0raNQnEpJFbBm/j7GE*</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <sws:TokenCreateRS Version="1.0.0" xmlns:sws="http://webservices.sabre.com">
      <sws:Success/>
    </sws:TokenCreateRS>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}

В случае, если логин или пароль в запросе неверные или учетная запись заблокирована, то система вернет ответ с ошибкой ```USG_AUTHENTICATION_FAILED```. В этом случае рекомендуется [сменить пароль и при необходимости разблокировать EPR](configuration.html#смена-пароля-и-разблокировка-epr).

{{< details title="Пример ответа с ошибкой" >}}
```XML
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">Sabre</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>dcee8572-2958-47a3-bda5-13b15868325f</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>2327729667967520610</eb:MessageId>
        <eb:Timestamp>2020-01-17T18:33:16</eb:Timestamp>
        <eb:RefToMessageId>1a35d735-4582-4756-9f4c-cd627ccf1786</eb:RefToMessageId>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.AuthenticationFailed</faultcode>
      <faultstring>Authentication failed</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_AUTHENTICATION_FAILED</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
```
{{< /details >}}