# Обработка ошибок

***Раздел находится в разработке***

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

В этом разделе представлены некоторые часто встречающиеся ошибки при работе с Sbare APIs, а также рекомендации по их обработке. Полный список ошибок доступен в [Format Finder](https://formatfinder.sabre.com/), а также на страницах сервисов на портале [Sabre Dev Studio](http://developer.sabre.com/).

### InvalidEbXmlMessage

**Описание**

Запрос содержит невалидный XML документ.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header/>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.InvalidEbXmlMessage</faultcode>
      <faultstring>Unable to create envelope from given source: Error on line 1 of document  : The prefix "SOAP-ENV" for element "SOAP-ENV:Envelope" is not bound. Nested exception: The prefix "SOAP-ENV" for element "SOAP-ENV:Envelope" is not bound.</faultstring>
      <detail>
        <StackTrace>javax.xml.soap.SOAPException: Unable to create envelope from given source: Error on line 1 of document  : The prefix "SOAP-ENV" for element "SOAP-ENV:Envelope" is not bound. Nested exception: The prefix "SOAP-ENV" for element "SOAP-ENV:Envelope" is not bound.</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте правильность составления запроса.

### USG_AUTHENTICATION_NOT_ALLOWED

**Описание**

Аутентификация через этот сервис невозможна.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>ConversationId</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1158049581147460610</eb:MessageId>
        <eb:Timestamp>2017-08-25T16:08:34</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.AuthenticationNotAllowed</faultcode>
      <faultstring>Authentication is not allowed for this service. Please use SessionCreateRQ</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_AUTHENTICATION_NOT_ALLOWED</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Укажите в запросе идентификатор сессии или токена вместо имени пользователя, пароля и iPCC.

### USG_INVALID_SECURITY_TOKEN

**Описание**

Используется некорректный идентификатор сессии или токена.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>ConversationId</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1219788579579240150</eb:MessageId>
        <eb:Timestamp>2017-08-25T16:05:57</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3239673953977074035!1555234!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.InvalidSecurityToken</faultcode>
      <faultstring>Invalid or Expired binary security token: Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3239673953977074035!1555234!0</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.session.SessionException: errors.session.USG_INVALID_SECURITY_TOKEN</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Создайте новую сессию или токен и используйте их для отправки запроса (см. [Аутентификация](authentication.md)).

### USG_AUTHORIZATION_FAILED

**Описание**

Отсутствует доступ к данному сервису.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>6565898664233289748</eb:MessageId>
        <eb:Timestamp>2017-08-24T14:53:56</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.AuthorizationFailed</faultcode>
      <faultstring>Authorization failed</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthorizationException: errors.authorization.USG_AUTHORIZATION_FAILED</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

1. Не пытайтесь повторить запрос.
2. Проверьте, что у данного пользователя должен быть доступ к выбранному сервису.
3. Напишите в службу поддержки Sabre.

### USG_INVALID_SESSION

**Описание**

Сессия недоступна.

**Рекомендации по обработке**

1. Закройте сессию и повторите запросы в новой сессии.
2. Проверьте, что вы не отправляете запросы в одной и той же сессии параллельно.

### USG_INVALID_ACTION

**Описание**

Указано некорректное название сервиса или оно отсутсвует.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>ConversationId</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>1157073582503230151</eb:MessageId>
        <eb:Timestamp>2017-08-25T16:10:50</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTC!ICESMSLB\/CRT.LB!-3239673953977074035!1555234!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.InvalidAction</faultcode>
      <faultstring>Action specified in EbxmlMessage does not exist.</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.exception.ApplicationException: errors.xml.USG_INVALID_ACTION</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте название сервиса на странице сервиса в [Sabre Dev Studio](http://developer.sabre.com/) и укажите его в запросе (см. [Начало работы](introduction.md#protokol_soap)).

### INVALID_VERSION

**Описание**

Указана несуществующая версия сервиса или версия сервиса не указана.

{% xmlsec "Пример ответа с ошибкой", false %}
<OTA_AirAvailRS xmlns="http://webservices.sabre.com/sabreXML/2003/07" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <TPA_Extensions>
    <HostCommand>INVALID_VERSION</HostCommand>
  </TPA_Extensions>
  <Errors>
    <Error ErrorCode="SessionFailure-103" ErrorMessage="TPFAE:tpfc_liberty_lbthlc105.sabre.com_12400:129 2017-08-25 10:31:03" Severity="High">
      <ErrorInfo>
        <Message>errors.INVALID_VERSION</Message>
      </ErrorInfo>
    </Error>
  </Errors>
</OTA_AirAvailRS>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте версию сервиса на странице сервиса в [Sabre Dev Studio](http://developer.sabre.com/) и укажите ее в запросе.

### Другие внутренние ошибки

Ответы с такими ошибками могут содержать:

- ```/soap-env:Envelope/soap-env:Header/eb:MessageHeader/eb:Action``` — значение ```ErrorRS```
- ```/soap-env:Envelope/soap-env:Body/soap-env:Fault/faultcode``` — код ошибки
- ```/soap-env:Envelope/soap-env:Body/soap-env:Fault/faultstring``` — описание ошибки
- ```/soap-env:Envelope/soap-env:Body/soap-env:Fault/detail/StackTrace``` — подробное описание ошибки

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>3250057607544280191</eb:MessageId>
        <eb:Timestamp>2017-08-29T16:52:34</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext">
      <wsse:BinarySecurityToken EncodingType="wsse:Base64Binary" valueType="String">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/RESG!ICESMSLB\/RES.LB!-3238237315760501105!878710!0</wsse:BinarySecurityToken>
    </wsse:Security>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Server.SystemFailure</faultcode>
      <faultstring>Service provider invocation failed. (Possibly service provider server down)</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.exception.ApplicationException: errors.http.USG_SVC_PROVIDER_FAILURE</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

1. Повторите запрос через 500 миллисекунд.
2. В случае повторных ошибок повторите запрос еще несколько раз: серез 1, 2, 4, 8, 16, 32 секунды.
3. В случае, если ошибка не исчезает, напишите в службу поддержки Sabre.

## SessionCreateRQ и TokenCreateRQ

### USG_AUTHENTICATION_FAILED

**Описание**

Ошибка аутентификации в Sabre.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>4938411465114090882</eb:MessageId>
        <eb:Timestamp>2017-08-24T12:55:11</eb:Timestamp>
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
{% endxmlsec %}

**Рекомендации по обработке**

1. Проверьте правильность заполнения имени пользователя (EPR), пароля и iPCC. А также убедитесь, что в запросе в качестве домена (Domain) указано значение ```DEFAULT```.
2. Убедитесь, что пользователь, под которым вы пытаетесь создать сессию или токен, имеет постоянный пароль, а также активен. Обратите внимание на то, что Sabre после нескольких неудачных попыток аутентифицироваться блокирует пользователя.
3. Разблокируйте и поменяйте пароль для пользователя. Это можно сделать самостоятельно в терминале или обратившись в Sabre.

### USG_SECURITY_ICE_ERROR

**Описание**

Отсутствуют права на создание сессии или токена.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>4951345466143100861</eb:MessageId>
        <eb:Timestamp>2017-08-24T12:56:54</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Server.SystemFailure</faultcode>
      <faultstring>Unable to connect to ICE security system : 606</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.exception.ApplicationICEException: errors.authentication.USG_SECURITY_ICE_ERROR</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

1. Не пытайтесь повторить запрос.
2. Проверьте, что вы пытаетесь создать сессиию или токен в iPCC. В Sabre создание сессий или токенов возможно только в них. iPCC можно определить по наличию строки ```WEB SITE SUBSCRIBER``` в [TJR](tjr-settings.md).
4. Проверьте, что вы пытаетесь создать сессиию или токен под пользователем, предназначенным для этого. Такого пользователя можно определить, среди прочего, по наличию ключевого слова ```ROBAP1``` в [EPR](configuration.md#uchetnie_zapisi_polzovatelei_epr).

### USG_PASSWORD_NOTFOUND

**Описание**

В запросе не указан пароль.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>5459729506078250192</eb:MessageId>
        <eb:Timestamp>2017-08-24T14:03:27</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.PasswordNodeNotFound</faultcode>
      <faultstring>wsse:Password node not found</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_PASSWORD_NOTFOUND</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте, что в запросе указан пароль.

### USG_ORG_NOTFOUND

**Описание**

В запросе не указан iPCC.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>5551837513173120550</eb:MessageId>
        <eb:Timestamp>2017-08-24T14:15:17</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.OrganizationNodeNotFound</faultcode>
      <faultstring>wsse:Organization node not found</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_ORG_NOTFOUND</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте, что в запросе указан iPCC.

### USG_USERNAME_NOTFOUND

**Описание**

В запросе не указано имя пользователя.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>5569103514429300201</eb:MessageId>
        <eb:Timestamp>2017-08-24T14:17:22</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.UserNameNodeNotFound</faultcode>
      <faultstring>wsse:Username node not found</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.security.AuthenticationException: errors.authentication.USG_USERNAME_NOTFOUND</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

Проверьте, что в запросе указано имя пользователя.

### USG_RESOURCE_UNAVAILABLE

**Описание**

Достигнут предел доступных сессий.

{% xmlsec "Пример ответа с ошибкой", false %}
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
  <soap-env:Header>
    <eb:MessageHeader eb:version="1.0" soap-env:mustUnderstand="1" xmlns:eb="http://www.ebxml.org/namespaces/messageHeader">
      <eb:From>
        <eb:PartyId eb:type="URI">SWS</eb:PartyId>
      </eb:From>
      <eb:To>
        <eb:PartyId eb:type="URI">Agency</eb:PartyId>
      </eb:To>
      <eb:ConversationId>MyConvID</eb:ConversationId>
      <eb:Action>ErrorRS</eb:Action>
      <eb:MessageData>
        <eb:MessageId>6293824569546900872</eb:MessageId>
        <eb:Timestamp>2017-08-24T15:49:14</eb:Timestamp>
      </eb:MessageData>
    </eb:MessageHeader>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/12/secext"/>
  </soap-env:Header>
  <soap-env:Body>
    <soap-env:Fault>
      <faultcode>soap-env:Client.ReachedTALimit</faultcode>
      <faultstring>You have reached the limit of Host TAs allocated to you</faultstring>
      <detail>
        <StackTrace>com.sabre.universalservices.base.exception.ApplicationICEException: errors.authentication.USG_RESOURCE_UNAVAILABLE</StackTrace>
      </detail>
    </soap-env:Fault>
  </soap-env:Body>
</soap-env:Envelope>
{% endxmlsec %}

**Рекомендации по обработке**

1. По возможности попробуйте закрыть доступные сессии через сервис [SessionCloseRQ](authentication.md#zakritie_sessii_sessioncloserq).
2. Повторите запрос через 10 секунд.
3. Проверьте [максимальное количество доступных сессий](authentication.md#poluchenie_informatsii_ob_ispolzuemih_sessiyah_oltmc_user_disp_name) и при необходимости обратитесь к вашему куратору в Sabre для увеличения.

## ContextChangeLLSRQ

### NOT ALLOWED THIS CITY

**Описание**

Переход в другой PCC не разрешен.

{% xmlsec "Пример ответа с ошибкой", false %}
<ContextChangeRS Version="2.0.3" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-08-24T11:45:01-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="60ED31">AAAABCD*SWS-OVER*</stl:HostCommand>
        <stl:Message>NOT ALLOWED THIS CITY</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
</ContextChangeRS>
{% endxmlsec %}

**Рекомендации по обработке**

1. Не пытайтесь повторить запрос.
2. Проверьте наличие [Branch Access](configuration.md#dostup_v_drugoi_pcc_branch_access) уровня C между iPCC, в котором создана сессия, и PCC, в который необходимо перейти.

### PLEASE FINISH OR IGNORE THE CURRENT TRANSACTION

**Описание**

Переход в другой PCC невозможен до того, как текущее бронирование будет сохранено или игнорировано.

{% xmlsec "Пример ответа с ошибкой", false %}
<ContextChangeRS Version="2.0.3" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-08-24T11:51:28-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="59A1F6">AAAABCD*SWS-OVER*</stl:HostCommand>
        <stl:Message>PLEASE FINISH OR IGNORE THE CURRENT TRANSACTION</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
  <SecurityToken Updated="false">Shared/IDL:IceSess\/SessMgr:1\.0.IDL/Common/!ICESMS\/ACPCRTD!ICESMSLB\/CRT.LB!-3240007418570077554!914587!0</SecurityToken>
</ContextChangeRS>
{% endxmlsec %}

**Рекомендации по обработке**

1. [Сохраните](edit-booking.md#sohranenie_bronirovaniya_endtransactionllsrq) или [игнорируйте](edit-booking.md#ignorirovanie_bronirovaniya_ignoretransactionllsrq) текущее бронирование.
2. Повторите запрос.

## OTA_AirPriceLLSRQ

### NO FARE FOR CLASS USED

**Описание**

Для выбранных классов бронирования отсутствуют тарифы. 

Подробнее см. [Format Finder](https://formatfinder.sabre.com/Content/Pricing/PricingErrors/NOFAREFORCLASSUSED11Online.aspx?ItemID=e027d4d3d90d46c7a8a70356b4c5408e&tabtype=troubleshoot&documentId=e027d4d3d90d46c7a8a70356b4c5408e_troubleshoot).

{% xmlsec "Пример ответа с ошибкой", false %}
<OTA_AirPriceRS Version="2.16.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-08-26T03:47:00-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WP</stl:HostCommand>
        <stl:Message>NO FARE FOR CLASS USED11</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
</OTA_AirPriceRS>
{% endxmlsec %}

### NO COMBINABLE FARES FOR CLASS USED

**Описание**

Отсутствуют комбинируемые тарифы для выбранных классов бронирования.

Подробнее см. [Format Finder](https://formatfinder.sabre.com/Content/Pricing/PricingErrors/NOCOMBINABLEFARESFORCLASSUSED53Online.aspx?ItemID=3755c0cd988742c0987ffefeccdb9460&tabtype=troubleshoot&documentId=3755c0cd988742c0987ffefeccdb9460_troubleshoot).

{% xmlsec "Пример ответа с ошибкой", false %}
<OTA_AirPriceRS Version="2.16.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-08-26T03:49:36-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WP</stl:HostCommand>
        <stl:Message>NO COMBINABLE FARES FOR CLASS USED53</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
</OTA_AirPriceRS>
{% endxmlsec %}

### CODE - {статус} SEG STATUS NOT ALLOWED

**Описание**

Расчет стоимости не может быть произведен для сегментов с указанным статусом.

Подробнее см. [Format Finder](https://formatfinder.sabre.com/Content/Pricing/PricingErrors/CODENOSEGSTATUSNOTALLOWED.aspx?ItemID=e6663a71f2e84d6dafad03e74b84b4b0).

{% xmlsec "Пример ответа с ошибкой", false %}
<OTA_AirPriceRS Version="2.16.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-08-26T03:48:49-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="222222">WP</stl:HostCommand>
        <stl:Message>CODE - UC SEG STATUS NOT ALLOWED-0003</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
</OTA_AirPriceRS>
{% endxmlsec %}

### Другие ошибки

Другие ошибки см. на [Format Finder](https://formatfinder.sabre.com/Content/Pricing/PricingErrors.aspx?ItemID=D1B1CA5A4C3B4933B649BC8BC2EC1F94).
-->
