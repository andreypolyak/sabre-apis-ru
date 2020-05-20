# Настройки PCC

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

У каждого PCC существует ряд настроек, которые называются [TJR (Travel Journal Record)](https://central.sabre.com/s/article/tjr-components-index). Настройки TJR определяют различные аспекты работы системы Sabre и применимы, как для работы через Sabre APIs, так и для работы через терминал. Указанные ниже обязательные и необязательные настройки рекомендуется устанавливать во всех используемых PCC (включая iPCC).

Настройки PCC могут быть изменены агентством самостоятельно в терминале (при помощи указанных ниже терминальных команд) или по заявке, направленной в [Sabre Helpdesk](http://airts.ru/contacts).

**Обратите внимание на то, что для изменения настроек через терминал, требуется переход в режим повышенных прав при помощи терминальной команды ```SI9```.**

*Список настроек PCC представлен в алфавитном порядке.*

## Проверка настроек

На этой странице можно проверить состояние указанных настроек в вашем PCC. Для этого необходимо отправить указанные ниже команды в терминале Sabre Red Workspace или отправить запрос к сервису [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command) (см. [Отправка терминальных команд](commands.md)).

<table>
  <tr>
    <td class="td-tjr">
      <p>Вставьте в поле ниже результаты выполнения команды <code>W/TA*[ваш PCC]</code>, например <code>W/TA*9LSC</code>.</p>
      <p><i>Обратите внимание на то, что в терминале Sabre Red Workspace есть ограничение на количество строк в ответе. Для того, чтобы пролистать ответ на команду до конца, необходимо последовательно отправлять команду <code>MD</code>.</i></p>
    </td>
    <td class="td-tjr">
      <p>Вставьте в поле ниже результаты выполнения команды <code>W/K*TJR</code>.</p>
      <p><i>Обратите внимание на то, что перед выполнением команды необходимо перейти в тот PCC, настройки, которого вы хотите получить. Это можно сделать при помощи терминальной команды <code>AAA[ваш PCC]</code>, например <code>AAA9LSC</code>.</i></p>
    </td>
  </tr>
  <tr>
    <td class="td-tjr">
      <textarea class="textarea-tjr form-control" id="tjr" rows="6" placeholder="Результат выполнения команды W/TA*[ваш PCC]"></textarea>
    </td>
    <td class="td-tjr">
      <textarea class="textarea-tjr form-control" id="ktjr" rows="6" placeholder="Результат выполнения команды W/K*TJR"></textarea>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <div id="tjr-alert-error" class="alert alert-danger" role="alert"></div>
      <div id="tjr-alert-ok" class="alert alert-success" role="alert"></div>
      <button class="btn btn-primary" onclick="check()">Проверить</button>
    </td>
  </tr>
</table>

<p id="tjr-results-label"><b>Результаты проверки настроек:</b></p>

<table class="table" id="tjr-results-table"></table>

<script type="text/javascript">
  function check() {
    var settings = [
    {code: 'ALDUPT', string: 'ALERT TO PREVENT DUPLICATE TICKETING - ON', name: 'Alert to Prevent Duplicate Ticketing (Предупреждение об оформлении дубликатов билетов)', default: true},
    {code: 'C35IT', string: 'TICKET CAT 35 IT/BT PQ FARE ALLOWED', name: 'Allow Ticket CAT 35 IT/BT PQ Fare (Оформление билетов по сохраненным в PQ приватным тарифам без перерасчета)', default: true},
    {code: 'AZA', string: 'AUTOMATIC SEGMENT ARRANGE - ON', name: 'Auto Segment Arrangement (Автоматическое упорядочивание сегментов в бронированиях)', default: true},
    {code: 'AUTOER', string: 'AUTO-ER  - ON', name: 'Automatically End Transaction and Redisplay the PNR at Ticketing (Автоматическое сохранение бронирований и повторное их открытие при оформлении билетов)', default: false},
    {code: 'AUTOEND', string: 'AUTO-END - ON', name: 'Automatically End Transaction at Ticketing (Автоматическое сохранение бронирований при оформлении билетов)', default: true},
    {code: 'PQPLUS', string: 'PQPLUS ACTIVE', name: 'Enhanced PQ (Улучшенные PQ)', default: true},
    {code: 'MCT', string: 'MCT', name: 'Minimum Connect Time Edit (Проверка соответствия пересадок минимальному допустимому времени)', default: true},
    {code: 'MTKTP', string: 'MULTI-TICKET SHOPPING AND PRICING ACTIVE', name: 'Multi-Ticket Shopping and Pricing (Поиск перелетов с оформлением на нескольких билетах)', default: true},
    {code: 'PNAPNR', string: 'PASSENGER NAME ASSOCIATION FOR PNR FIELDS - ON', name: 'Passenger Name Association (Привязка элементов бронирования к пассажирам)', default: true},
    {code: 'PQT', string: 'PRICE RETENTION TKTG ALERT', name: 'Price Retention Ticketing Alert (Предупреждение об изменении стоимости билетов)', default: false},
    {code: 'TKM', string: 'TICKETING ALERT PASSPORT/DOB - ACTIVE', name: 'PSPT Warning Message (Предупреждение об отсутствии паспортов в бронировании)', default: false},
    {code: 'RVCTVC', string: 'RESTRICT VAL CARRIER TO TRADITIONAL VAL CARRIER - ON', name: 'Restrict Validating Carrier to Traditional Validating Carrier (Традиционная логика выбора валидирующего перевозчика)', default: false},
    {code: 'PT', string: 'PSGR TYPE - ON', name: 'Store Passenger Type in PNR (Хранение категорий пассажиров в бронированиях)', default: true},
    {code: 'TKTPQ', string: 'TICKET USING PQ FARE ALLOWED', name: 'Ticket from Stored Fare (Оформление билетов по сохраненным PQ без перерасчета)', default: true},
    {code: 'MULTIPQ', string: 'TICKET USING MULTIPLE PQ ACTIVE', name: 'Ticket Using Multiple PQ (Оформление билетов по нескольким PQ)', default: false},
    {code: 'TFOP', string: 'TWO FORMS OF PAYMENT ALLOWED', name: 'Two Forms of Payment (Оформление билетов с двумя формами оплаты)', default: true},
    {code: 'ETU', string: 'UNUSED ETR DISPLAY ON', name: 'Unused Electronic Ticket Report (Формирование отчета о неиспользованных билетах)', default: true},
    {code: 'VITA', string: '?', name: 'Validating Carrier, Interline, and GSA (Новая логика выбора валидирующего перевозчика)', default: true}];

    var settingWithResults = [];

    var pcc = '';

    var tjr = document.getElementById('tjr').value;
    var ktjr = document.getElementById('ktjr').value;

    var errorAlert=document.getElementById('tjr-alert-error');
    var okAlert=document.getElementById('tjr-alert-ok');
    var resultsTable=document.getElementById('tjr-results-table');
    var resultsLabel=document.getElementById('tjr-results-label');

    errorAlert.style.display = 'none';
    okAlert.style.display = 'none';
    resultsTable.innerHTML = '';
    resultsTable.style.display = 'none';
    resultsLabel.style.display = 'none';

    settings.map(function(setting) {
      document.getElementById(setting.code).innerHTML = '';
    });


    function displayErrorAlert(innerHTML) {
      errorAlert.innerHTML = innerHTML;
      errorAlert.style.display = 'block';
    }

    function transformBoolean(value) {
      if (value === true) {
        return 'Да';
      } else if (value === false) {
        return 'Нет';
      } else {
        return 'Неизвестно';
      }
    }

    function returnRow(setting) {
      var className = 'success';
      if (setting.default !== setting.result) {
        className = 'danger';
      }
      return '<tr class="' + className + '"><td>' + setting.name + '</td><td>' + transformBoolean(setting.default) + '</td><td>' + transformBoolean(setting.result) + '</td></tr>';
    }

    function returnRows() {
      var innerHTML = '';
      settingWithResults.forEach(function(setting) {
        innerHTML = innerHTML + returnRow(setting);
      });
      return '<tbody>' + innerHTML + '</tbody>';
    }

    if (tjr === '' && ktjr === '') {
      displayErrorAlert('Отсутствует результат выполнения команд <code>W/TA*[ваш PCC]</code> и <code>W/K*TJR</code>.');  
    } else if (tjr === '') {
      displayErrorAlert('Отсутствует результат выполнения команды <code>W/TA*[ваш PCC]</code>.'); 
    } else if (ktjr === '') {
      displayErrorAlert('Отсутствует результат выполнения команды <code>W/K*TJR</code>.'); 
    } else if (tjr.indexOf('END LIST') === -1 && ktjr.indexOf('END OF EDIT LIST') === -1) {
      displayErrorAlert('Результат выполнения команд <code>W/TA*[ваш PCC]</code> и <code>W/K*TJR</code> вставлен не до конца или некорректно.');
    } else if (tjr.indexOf('END LIST') === -1) {
      displayErrorAlert('Результат выполнения команды <code>W/TA*[ваш PCC]</code> вставлен не до конца или некорректно.');
    } else if (ktjr.indexOf('END OF EDIT LIST') === -1) {
      displayErrorAlert('Результат выполнения команды <code>W/K*TJR</code> вставлен не до конца или некорректно.');
    } else {
      
      pcc = tjr.substr(tjr.indexOf('PCC- ') + 5, 4);

      settings.map(function(setting) {
        var source = tjr;
        if (setting.code === 'MCT') {
          source = ktjr;
        }
        if (setting.code === 'VITA') {
          setting.result = null;
          document.getElementById(setting.code).innerHTML = '<i>(в PCC ' + pcc + ' необходимо проверить состояние настройки)</i>';
        } else if(source.indexOf(setting.string) > -1) {
          document.getElementById(setting.code).innerHTML = '<i>(в PCC ' + pcc + ' настройка включена)</i>';
          setting.result = true;
        } else {
          document.getElementById(setting.code).innerHTML = '<i>(в PCC ' + pcc + ' настройка отключена)</i>';
          setting.result = false;
        }
        settingWithResults.push(setting);
      });
      
      okAlert.innerHTML = 'Проверка успешно завершена.';
      okAlert.style.display = 'block';

      resultsTable.innerHTML = '<thead><tr><th>Название настройки</th><th>Рекомендуется включить</th><th>Включена в PCC ' + pcc + '</th></tr></thead>' + returnRows();
      resultsTable.style.display = 'block';
      resultsLabel.style.display = 'block';
    }
  }
</script>

## Alert to Prevent Duplicate Ticketing (Предупреждение об оформлении дубликатов билетов)

*✓ Настройку рекомендуется включить* <span id="ALDUPT"></span>

**Описание**

Настройка Alert to Prevent Duplicate Ticketing вызывает предупреждение в случае попытки повторного оформления билета для тех пассажиров и тех сегментов, для которых в бронировании уже существует билет.

**Если настройка включена**

При попытке оформить билет для тех пассажиров и тех сегментов, для которых в бронировании уже существует билет, в ответе на запрос будет присутствовать ошибка ```DUPLICATE TICKETS FOUND```.

{% xmlsec "Пример ответа", true %}
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1">
  <ApplicationResults status="Incomplete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Error timeStamp="2019-03-06T11:53:33.717-06:00" type="Application">
      <SystemSpecificResults>
        <Message code="ERR.SP.PROVIDER_ERROR">No new tickets have been issued</Message>
      </SystemSpecificResults>
    </Error>
    <Warning timeStamp="2019-03-06T11:53:25.703-06:00" type="Application">
      <SystemSpecificResults>
        <Message code="WARN.SP.PROVIDER_WARNING">AirTicketLLS failed for /Ticketing[1] with Cause: AirTicketLLSRQ: DUPLICATE TICKETS FOUND</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2019-03-06T11:53:33.717-06:00" type="Application">
      <SystemSpecificResults>
        <Message code="WARN.SP.PROVIDER_ERROR">TicketingDocumentServicesRQ: No new tickets have been issued</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
</AirTicketRS>
{% endxmlsec %}

**Если настройка отключена**

Проверка наличия дубликата билета не производится.

**Включение и отключение**

- ```W/ALDUPT¥*``` — проверить состояние настройки
- ```W/ALDUPT¥ON``` — включить настройку
- ```W/ALDUPT¥OFF``` — отключить настройку

## Allow Ticket CAT 35 IT/BT PQ Fare (Оформление билетов по сохраненным в PQ приватным тарифам без перерасчета)

*✓ Настройку рекомендуется включить* <span id="C35IT"></span>

**Описание**

Настройка Allow Ticket CAT 35 IT/BT PQ Fare разрешает оформление билетов по приватным тарифам, содержащим 35-ю категорию правил, при включенной настройке Ticket from Stored Fare (см. ниже).

**Если настройка включена**

Оформление билетов по приватным тарифам, содержащим 35-ю категорию правил, при включенной настройке Ticket from Stored Fare разрешено.

**Если настройка отключена**

Оформление билетов по приватным тарифам, содержащим 35-ю категорию правил, при включенной настройке Ticket from Stored Fare **не разрешено**.

**Включение и отключение**

- ```W/C35IT¥*``` — проверить состояние настройки
- ```W/C35IT¥ON``` — включить настройку
- ```W/C35IT¥OFF``` — отключить настройку

## Auto Segment Arrangement (Автоматическое упорядочивание сегментов в бронированиях)

*✓ Настройку рекомендуется включить* <span id="AZA"></span>

**Описание**

Настройка Auto Segment Arrangement автоматически выстраивает сегменты по порядку (т.е. в хронологическом порядке) при добавлении сегментов в бронирование.

Обратите внимание на то, что данная настройка не отменяет необходимости добавления наземных сегментов в случае наличия пропусков в бронировании (т.е. в тех случаях, когда город отправления следующего сегмента не равен городу прибытия предыдущего сегмента). Для автоматического добавления наземных сегментов можно использовать элемент ```/EnhancedAirBookRQ/PostProcessing/ARUNK_RQ``` в запросе к сервису [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.md)) или элемент ```/CreatePassengerNameRecordRQ/PostProcessing/ARUNK``` в запросе к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md)).

**Если настройка включена**

При добавлении (бронировании) сегментов они будут выстроены в бронировании в правильном порядке.

**Если настройка отключена**

При добавлении (бронировании) сегментов они будут выстроены в том порядке, котором были добавлены. При попытке сохранения бронирования с неправильным порядком следования сегментов будет получена ошибка ```SEGMENTS NOT IN DATE ORDER - VERIFY AND REENTER```.

**Включение и отключение**

- ```W/TA*[PCC]``` затем ```MD/ARRANGE``` — проверить состояние настройки
- ```W/AZA¥ON``` — включить настройку
- ```W/AZA¥OFF``` — отключить настройку

## Automatically End Transaction and Redisplay the PNR at Ticketing (Автоматическое сохранение бронирований и повторное их открытие при оформлении билетов)

*✗ Настройку рекомендуется отключить* <span id="AUTOER"></span>

**Описание**

Настройка Automatically End Transaction at Ticketing автоматически сохраняет бронирование после выполнения запроса на оформление, войдирование и возврат билетов или EMD, после чего заново читает сохраненное бронирование.

Обратите внимание на то, что все рекомендации в разделах [Оформление билетов и EMD](issue-ticket.md), [Войдирование билетов и EMD](void-ticket.md) и других составлены с тем расчетом, что данная настройка **отключена**. В случае ее включения необходимо исключить из рекомендованных процессов запрос на чтение бронирования после выполнения запроса на оформление, войдирование или возврат билетов или EMD.

**Если настройка включена**

После выполнения запроса на оформление, войдирование или возврат билетов или EMD будет произведено сохранение бронирование и его повторное чтение. После выполнения запроса в текущей сессии или вкладке в Sabre Red Workspace бронирование будет открыто.

**Если настройка отключена**

После выполнения запроса на оформление, войдирование или возврат билетов или EMD запрошенная транзакция будет выполнена (т.е., например, билет оформлен или возвращен), однако информация об этой транзакции не будет присутствовать в бронировании до тех пор, пока оно не будет сохранено.

**Включение и отключение**

- ```W/AUTOER¥*``` — проверить состояние настройки
- ```W/AUTOER¥ON``` — включить настройку
- ```W/AUTOER¥OFF``` — отключить настройку

## Automatically End Transaction at Ticketing (Автоматическое сохранение бронирований при оформлении билетов)

*✓ Настройку рекомендуется включить* <span id="AUTOEND"></span>

**Описание**

Настройка Automatically End Transaction at Ticketing автоматически сохраняет бронирование после выполнения запроса на оформление, войдирование и возврат билетов или EMD. Данная настройка повышает надежность оформления билетов.

Обратите внимание на то, что все рекомендации в разделах [Оформление билетов и EMD](issue-ticket.md), [Войдирование билетов и EMD](void-ticket.md) и других составлены с тем расчетом, что данная настройка включена.

**Если настройка включена**

После выполнения запроса на оформление, войдирование или возврат билетов или EMD будет произведено сохранение бронирование. После выполнения запроса в текущей сессии или вкладке в Sabre Red Workspace бронирование **не будет** открыто.

**Если настройка отключена**

После выполнения запроса на оформление, войдирование или возврат билетов или EMD запрошенная транзакция будет выполнена (т.е., например, билет оформлен или возвращен), однако информация об этой транзакции не будет присутствовать в бронировании до тех пор, пока оно не будет сохранено.

**Включение и отключение**

- ```W/AUTOEND¥*``` — проверить состояние настройки
- ```W/AUTOEND¥ON``` — включить настройку
- ```W/AUTOEND¥OFF``` — отключить настройку

## Enhanced PQ (Улучшенные PQ)

*✓ Настройку рекомендуется включить* <span id="PQPLUS"></span>

**Описание**

Настройка Enhanced PQ улучшает многие возможности PQ, такие как:
- использование PQ при автоматическом и ручном ценообразовании
- хранение истории изменений всех PQ
- возможность редактирования PQ
- возможность подключения настройки Ticket from Stored PQ Fare (см. ниже)
- и другие

**Если настройка включена**

Создаются улучшенные PQ (см. возможности выше).

**Если настройка отключена**

Улучшенные PQ не создаются.

**Включение и отключение**

- ```W/PQPLUS¥*``` — проверить состояние настройки
- ```W/PQPLUS¥ON``` — включить настройку
- ```W/PQPLUS¥OFF``` — отключить настройку

## Minimum Connect Time Edit (Проверка соответствия пересадок минимальному допустимому времени)

*✓ Настройку рекомендуется включить* <span id="MCT"></span>

**Описание**

Настройка Minimum Connect Time Edit включает проверку на соответствие всех пересадок в бронировании минимальному допустимому времени пересадки.

**Если настройка включена**

При попытке сохранения бронирования, в котором длительность одной или нескольких пересадок меньше допустимого минимального времени пересадки будет возвращена ошибка:

{% xmlsec "Пример ответа", true %}
<EndTransactionRS Version="2.0.9" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="NotProcessed">
    <stl:Error timeStamp="2017-10-20T04:32:24-05:00" type="BusinessLogic">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="36B277">E</stl:HostCommand>
        <stl:Message>MIN CONNX TIME SEG 01 AT VKO 6.00</stl:Message>
        <stl:ShortText>ERR.SWS.HOST.ERROR_IN_RESPONSE</stl:ShortText>
      </stl:SystemSpecificResults>
    </stl:Error>
  </stl:ApplicationResults>
</EndTransactionRS>
{% endxmlsec %}

Для того чтобы сохранить такое бронирование, невзирая на предупреждение, необходимо отправить повторный запрос на сохранение бронирования (сервис [EndTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/end_transaction)). В противном случае бронирование нужно игнорировать ([IgnoreTransactionLLSRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/ignore_transaction)).

Сервисы [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) и [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) имеют встроенный обработчик таких предупреждений при сохранении бронирования. Они сохраняют бронирование, но показывают предупреждение о недопустимом времени пересадки.

{% xmlsec "Пример ответа", true %}
<PassengerDetailsRS xmlns="http://services.sabre.com/sp/pd/v3_3">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Success timeStamp="2017-10-20T04:35:41.087-05:00"/>
    <Warning timeStamp="2017-10-20T04:35:40.653-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">EndTransactionLLSRQ: MIN CONNX TIME SEG 01 AT VKO 6.00</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2017-10-20T04:35:41.084-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.WARNING_RESPONSE">EndTransactionLLSRQ: TTY REQ PEND</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
  <ItineraryRef ID="UWZJVS"/>
</PassengerDetailsRS>
{% endxmlsec %}

**Если настройка отключена**

Проверка соответствия пересадок в бронировании минимальному допустимому времени пересадок не производится.

**Включение и отключение**

- ```W/K*TJR```, в ответе должна быть строка ```MCT``` — проверить состояние настройки
- ```W/KMCT¥ON``` — включить настройку
- ```W/KMCT¥OFF``` — отключить настройку

## Multi-Ticket Shopping and Pricing (Поиск перелетов с оформлением на нескольких билетах)

*✓ Настройку рекомендуется включить* <span id="MTKTP"></span>

**Описание**

Настройка Multi-Ticket Shopping and Pricing позволяет производить [поиск перелетов с оформлением на нескольких билетах](shop.md#oformlenie_na_neskolkih_biletah) в сервисе Bargain Finder Max.

**Если настройка включена**

В результатах поиска в сервисе Bargain Finder Max могут присутствовать варианты перелетов с оформлением на нескольких билетах.

**Если настройка отключена**

В результатах поиска в сервисе Bargain Finder Max могут присутствовать варианты перелетов только с оформлением на одном билете.

**Включение и отключение**

- ```W/MTKTP¥*``` — проверить состояние настройки
- ```W/MTKTP¥ON``` — включить настройку
- ```W/MTKTP¥OFF``` — отключить настройку

## Passenger Name Association (Привязка элементов бронирования к пассажирам)

*✓ Настройку рекомендуется включить* <span id="PNAPNR"></span>

**Описание**

Настройка Passenger Name Association позволяет привязывать телефонные номера, ремарки и формы оплаты к пассажирам в бронировании, а также получать при чтении бронирования информацию о привязке оформленных билетов и EMD к пассажирам.

**Если настройка включена**

При создании и изменении бронирования разрешается привязывать телефонные номера, ремарки и формы оплаты к пассажирам в бронировании. В ответ на запрос чтения бронирования приходит информация о привязке оформленных билетов и EMD к пассажирам.

**Если настройка отключена**

При создании и изменении бронирования не разрешается привязывать телефонные номера, ремарки и формы оплаты к пассажирам в бронировании. В ответ на запрос чтения бронирования не приходит информация о привязке оформленных билетов и EMD к пассажирам.

**Включение и отключение**

- ```W/PNAPNR¥*``` — проверить состояние настройки
- ```W/PNAPNR¥ON``` — включить настройку

## Price Retention Ticketing Alert (Предупреждение об изменении стоимости билетов)

*✗ Настройку рекомендуется отключить* <span id="PQT"></span>

**Описание**

В Sabre по умолчанию (в случае, если не включена настройка [Ticket from Stored Fare](tjr-settings.md#ticket_from_stored_fare_oformlenie_biletov_po_sohranennim_pq_bez_pererascheta)) каждый раз при попытке оформления билетов производится перерасчет стоимости билетов. Настройка [Price Retention Ticketing Alert](tjr-settings.md#price_retention_ticketing_alert_preduprezhdenie_ob_izmenenii_stoimosti_biletov) вызывает проверку соответствия между стоимостью билета (или билетов), сохраненной в PQ (Price Quote) и стоимостью билета (или билетов), который будет оформлен в результате выполнения запроса. В случае, если стоимость билетов различается, будет вызвано предупреждение.

Обратите внимание на то, что по умолчанию в бронировании сохраняется 1 PQ на всех пассажиров одной категории, и, при попытке оформить билет по данному PQ для меньшего числа пассажиров, будет вызвано предупреждение. Например, в случае наличия в бронировании 3 взрослых пассажиров и 2 детей, в бронировании будет по умолчанию создано 2 PQ: 1 для взрослых пассажиров и 1 для детей. При оформлении билетов для каждого пассажира по-отдельности, а не для всех пассажиров в PQ, будет вызвано предупреждение.

**Если настройка включена**

При попытке оформить билет, стоимость которого отличается от стоимости сохраненной в PQ, будет вызвано предупреждение. Сервис для оформления билетов AirTicketRQ  позволяет обрабатывать такие предупреждения, см. [Оформление билетов и EMD](issue-ticket.md#post-obrabotka).

**Если настройка отключена**

Сравнение соответствия стоимости оформляемых билетов не производится.

**Включение и отключение**

- ```W/PQT¥*``` — проверить состояние настройки
- ```W/PQT¥ON``` — включить настройку
- ```W/PQT¥OFF``` — отключить настройку

## PSPT Warning Message (Предупреждение об отсутствии паспортов в бронировании)

*✗ Настройку рекомендуется отключить* <span id="TKM"></span>

**Описание**

Настройка PSPT Warning Message вызывает предупреждение об отсутствии паспорта при попытке оформить билет.

Обратите внимание на то, что предупреждение будет показано в том случае, если в бронировании присутствует младенец без места, т.к. документ (паспорт) будет "привязан" к сопровождающему взрослому пассажиру.

Для того, чтобы избежать появления предупреждения в этом случае, необходимо добавить в бронирование OSI сообщение следующего формата:

```
PSPT[номер документа младенца]/DOB[дата рождения в формате DDMMMYY]
```

Пример:

```
PSPT1234567889/DOB20SEP17
```

OSI сообщение должно быть отправлено тому перевозчику, чей билет должен быть оформлен, и привязано к младенцу.

Для отправки OSI сообщения при создании бронирования необходимо в запросе к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md)) добавить элемент ```/CreatePassengerNameRecordRQ/SpecialReqDetails/SpecialService/SpecialServiceInfo/Service``` или в запросе к сервису [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details) (см. [Создание бронирований в 2 шага](create-booking-2steps.md)) добавить элемент ```/PassengerDetailsRQ/SpecialReqDetails/SpecialServiceRQ/SpecialServiceInfo/Service``` следующего вида:

{% xmlsec "Пример", true %}
<Service SSR_Code="OSI">
  <PersonName NameNumber="2.1"/>
  <Text>PSPT123456/DOB14JAN18</Text>
  <VendorPrefs>
    <Airline Code="SU"/>
  </VendorPrefs>
</Service>
{% endxmlsec %}

**Если настройка включена**

При попытке оформить билет для пассажира, у которого в бронировании отсутствует паспорт, будет выдано предупреждение:

{% xmlsec "Пример ответа", true %}
<AirTicketRS xmlns="http://services.sabre.com/sp/air/ticket/v1">
  <ApplicationResults status="Incomplete" xmlns="http://services.sabre.com/STL_Payload/v02_01">
    <Error timeStamp="2019-03-27T14:21:56.948-05:00" type="Application">
      <SystemSpecificResults>
        <Message code="ERR.SP.PROVIDER_ERROR">No new tickets have been issued</Message>
      </SystemSpecificResults>
    </Error>
    <Warning timeStamp="2019-03-27T14:21:52.332-05:00" type="Application">
      <SystemSpecificResults>
        <Message code="WARN.SP.PROVIDER_WARNING">AirTicketLLS failed for /Ticketing[1] with Cause: AirTicketLLSRQ: WARNING - NO PASSPORT AND/OR DOB DATA FOR SELECTED PAX</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2019-03-27T14:21:56.947-05:00" type="Application">
      <SystemSpecificResults>
        <Message code="WARN.SP.PROVIDER_ERROR">TicketingDocumentServicesRQ: No new tickets have been issued</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2019-03-27T14:21:57.034-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">DesignatePrinterLLSRQ: CONTINUE TICKETING Y OR N &gt;»&lt;.&gt;</Message>
      </SystemSpecificResults>
    </Warning>
    <Warning timeStamp="2019-03-27T14:21:57.159-05:00" type="BusinessLogic">
      <SystemSpecificResults>
        <Message code="WARN.SWS.HOST.ERROR_IN_RESPONSE">DesignatePrinterLLSRQ: CONTINUE TICKETING Y OR N &gt;»&lt;.&gt;</Message>
      </SystemSpecificResults>
    </Warning>
  </ApplicationResults>
</AirTicketRS>
{% endxmlsec %}

**Если настройка отключена**

Проверка наличия в бронировании паспорта не производится.

**Включение и отключение**

- ```W/TKM¥*``` — проверить состояние настройки
- ```W/TKM¥ON``` — включить настройку
- ```W/TKM¥OFF``` — отключить настройку

## Restrict Validating Carrier to Traditional Validating Carrier (Традиционная логика выбора валидирующего перевозчика)

*✗ Настройку рекомендуется отключить* <span id="RVCTVC"></span>

**Описание**

Настройка Restrict Validating Carrier to Traditional Validating Carrier возвращает традиционную логику выбора валидирующего перевозчика после включения настройки [Validating Carrier, Interline, and GSA](tjr-settings.md#validating_carrier_interline_and_gsa_novaya_logika_vibora_validiruyuschego_perevozchika).

**Если настройка включена**

Сервисы и форматы поиска перелетов и расчета стоимости используют традиционную логику выбора валидирующего перевозчика (первый маркетинговый перевозчик на маршруте или первый маркетинговый перевозчик, осуществляющий международный перелет, или первый маркетинговый перевозчик, осуществляющий пересечению зон IATA), при этом остаются все остальные возможности, которые предлагает настройка [Validating Carrier, Interline, and GSA](tjr-settings.md#validating_carrier_interline_and_gsa_novaya_logika_vibora_validiruyuschego_perevozchika).

**Если настройка отключена**

Сервисы и форматы поиска перелетов и расчета стоимости предлагают автоматический выбор самого дешевого валидирующего перевозчика из имеющихся в перелете маркетинговых перевозчиков с учетом ограничений, указанных в 15 категории правил тарифов в структурированном виде, а также с учетом возможности оформления билетов выбранного перевозчика на выбранном стоке (по умолчанию BSP).

**Включение и отключение**

*Обратите внимание на то, что данная настройка может быть включена только после включения настройки [Validating Carrier, Interline, and GSA](tjr-settings.md#validating_carrier_interline_and_gsa_novaya_logika_vibora_validiruyuschego_perevozchika).*

- ```W/RVCTVC¥*``` — проверить состояние настройки
- ```W/RVCTVC¥ON``` — включить настройку
- ```W/RVCTVC¥OFF``` — отключить настройку

## Store Passenger Type in PNR (Хранение категорий пассажиров в бронированиях)

*✓ Настройку рекомендуется включить* <span id="PT"></span>

**Описание**

Настройка Store Passenger Type in PNR позволяет включить сохранение категорий пассажиров в бронировании (категории пассажира указываются в качестве значения атрибута ```/PassengerDetailsRQ/TravelItineraryAddInfoRQ/CustomerInfo/PersonName/@PassengerType``` в запросе к сервису для добавления информации о пассажирах [PassengerDetailsRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Passenger_Details)).

**Если настройка включена**

При расчете стоимости для всех пассажиров будут применены те категории пассажиров, что указаны в бронировании.

**Если настройка отключена**

При расчете стоимости по умолчанию для всех пассажиров будет применена категория пассажира ```ADT``` (взрослый). В запросе на расчет стоимости можно указать другие категории пассажиров.

**Включение и отключение**

- ```W/PT¥*``` — проверить состояние настройки
- ```W/PT¥ON``` — включить настройку
- ```W/PT¥OFF``` — отключить настройку

## Ticket from Stored Fare (Оформление билетов по сохраненным PQ без перерасчета)

*✓ Настройку рекомендуется включить* <span id="TKTPQ"></span>

**Описание**

В Sabre по умолчанию каждый раз при попытке оформить билеты производится перерасчет стоимости оформляемых билетов. Настройка Ticket from Stored Fare отключает перерасчет стоимости бронирования в случае, если PQ был создан в течение текущего дня (используется локальное время PCC). Гарантия Sabre при этом сохраняется.

Обратите внимание на то, что данная настройка позволит оформить билет даже с нарушением условий [тайм-лимита](timelimit.md). Чтобы избежать проблем, перед оформление билета необходимо проверить время тайм-лимита.

При включении данной настройки также рекомендуется включить настройку [Allow Ticket CAT 35 IT/BT PQ Fare](tjr-settings.md#allow_ticket_cat_35_itbt_pq_fare_oformlenie_biletov_po_sohranennim_v_pq_privatnim_tarifam_bez_pererascheta) для того, чтобы иметь возможность оформлять билеты по приватным тарифам.

**Если настройка включена**

При оформлении билетов не производится перерасчет стоимости PQ. В случае, если при оформлении билетов, использовался PQ, созданный не в текущий день, а ранее, будет вызвано предупреждение. Сервис для оформления билетов AirTicketRQ  позволяет обрабатывать такие предупреждения, см. [Оформление билетов и EMD](issue-ticket.md#post-obrabotka).

**Если настройка отключена**

При оформлении билетов будет выполнен перерасчет стоимости.

**Включение и отключение**

- ```W/TKTPQ¥*``` — проверить состояние настройки
- для включения или отключения настройки необходимо обратиться к вашему куратору в Sabre

## Ticket Using Multiple PQ (Оформление билетов по нескольким PQ)

*✗ Настройку рекомендуется отключить* <span id="MULTIPQ"></span>

**Описание**

Настройка Ticket Using Multiple PQ разрешает оформление билетов по нескольким PQ с разными параметрами в одном запросе.

**Если настройка включена**

Оформление билетов по нескольким PQ с разными параметрами разрешено.

**Если настройка отключена**

Оформление билетов по нескольким PQ с разными параметрами **не разрешено**.

**Включение и отключение**

- ```W/MULTIPQ¥*``` — проверить состояние настройки
- ```W/MULTIPQ¥ON``` — включить настройку
- ```W/MULTIPQ¥OFF``` — отключить настройку

## Two Forms of Payment (Оформление билетов с двумя формами оплаты)

*✓ Настройку рекомендуется включить* <span id="TFOP"></span>

**Описание**

Настройка Two Forms of Payment разрешает использование двойной формы оплаты для оформления билетов (см. [Оформление билетов и EMD](issue-ticket.md)).

**Если настройка включена**

Оформление билетов с двойной формой оплаты разрешено.

**Если настройка отключена**

Оформление билетов с двойной формой оплаты **не разрешено**.

**Включение и отключение**

- ```W/TFOP¥*``` — проверить состояние настройки
- ```W/TFOP¥ON``` — включить настройку
- ```W/TFOP¥OFF``` — отключить настройку

## Unused Electronic Ticket Report (Формирование отчета о неиспользованных билетах)

*✓ Настройку рекомендуется включить* <span id="ETU"></span>

**Описание**

Настройка Unused Electronic Ticket Report активирует автоматическую проверку оформленных билетов на предмет наличия неиспользованных купонов. Результаты проверки билетов доступны в виде отчетов (см. [Формирование отчетов](report-ticket.md)).

*Обратите внимание на то, что:*
- *формирование отчетов начнется через 5 дней после включения настройки*
- *каждый оформленный билет проверяется на 5-й день после последней даты вылета*
- *настройка будет автоматически отключена в случае, если отчет ни разу не формировался в течение 30 дней*

**Если настройка включена**

Проверка оформленных билетов на предмет наличия неиспользованных купонов включена.

**Если настройка отключена**

Проверка оформленных билетов на предмет наличия неиспользованных купонов отключена.

**Включение и отключение**

- ```W/ETU¥*``` — проверить состояние настройки
- ```W/ETU¥ON``` — включить настройку
- ```W/ETU¥OFF``` — отключить настройку

## Validating Carrier, Interline, and GSA (Новая логика выбора валидирующего перевозчика)

*✓ Настройку рекомендуется включить* <span id="VITA"></span>

**Описание**

[Документация](http://webservices.sabre.com/drc/providerdoc/shopping/BargainFinderMax_Help/Content/Features/ValidatingCarrier/Validating%20Carrier%20Interline%20and%20GSA_DAG.pdf).

Настройка Validating Carrier, Interline, and GSA меняет логику выбора валидирующего перевозчика для всех сервисов и форматов поиска перелетов и расчета стоимости.

**Если настройка включена**

Сервисы и форматы поиска перелетов и расчета стоимости предлагают:
- автоматический выбор самого дешевого валидирующего перевозчика из имеющихся в перелете маркетинговых перевозчиков с учетом ограничений, указаннных в 15 категории правил тарифов в структурированном виде, а также с учетом возможности оформления билетов выбранного перевозчика на выбранном стоке (по умолчанию BSP)
- предложение альтернативных валидирующих перевозчиков в случае, если несколько валидирующих перевозчиков позволяют оформить билет по одинаковой стоимости
- предупреждение о наличии дополнительных ограничений в 15 категории правил тарифов в неструктурированном (текстовом) виде
- выбор GSA (General Sales Agent) в качестве валидирующего перевозчика в случае невозможности оформления билетов другими перевозчиками на выбранном стоке (по умолчанию BSP)
- выбор нейтрального валидирующего перевозчика в качестве валидирующего перевозчика в случае невозможности оформления билетов другими перевозчиками на выбранном стоке (по умолчанию BSP)
- возможность управлять выбором валидирующего перевозчика в запросе к сервису BargainFinderMaxRQ (см. [Поиск перелетов по заданным датам](shop.md)).

По умолчанию настройка поддерживает работу только на стоке BSP. Для того, чтобы добавить поддержку других стоков, необходимо активировать возможность работы со множественными стоками во всех iPCC и PCC, в которых будет производиться поиск перелетов, расчет стоимости и оформление билетов. Для этого для каждого стока (включая BSP) необходимо последовательно отправить в каждом PCC команду ```W/VMSM¥A[код стока]```. Для деактивации стока необходимо отправить команду ```W/VMSM¥D[код стока]```. Для просмотра всех активированных стоков необходимо отправить команду ```W/VMSM¥*```.

Доступные коды стоков:

| Сток | Код стока |
| -- | -- |
| Сток BSP | ```BSP``` |
| Прямой сток Аэрофлота | ```RUT``` |
| Прямой сток других авиакомпаний | ```GEN``` |
| Сток ТКП | ```TCH``` |

При расчете стоимости перелета, который необходимо оформить на стоке отличном от BSP, необходимо указать это в запросе (см. [Создание бронирований в 1 шаг](create-booking-1step.md) и [Создание бронирований в 2 шага](create-booking-2steps.md)) или в команде расчета стоимости при помощи квалификатора ```VM[код стока]```, например ```WPVMGEN```.

Для просмотра доступных в определенной стране валидирующих перевозчиков можно использовать терминальную команду ```WB*[код страны]```, например ```WB*RU``` или сервис [PO_ValidatingCarrierTableDisplayRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/table_display).

{% xmlsec "Пример запроса", false %}
<TicketingCxrDisplayRQ version="1.0.0" xmlns="http://stl.sabre.com/AirPricing/validating_cxr/v0">
  <POS multiHost="1S">
    <Actual country="RU"/>
    <Pcc>9LSC</Pcc>
  </POS>
  <DisplayValidatingCxr country="RU"/>
</TicketingCxrDisplayRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<TicketingCxrDisplayRS version="1.0.0" xmlns="http://stl.sabre.com/AirPricing/validating_cxr/v0">
  <Country code="RU"/>
  <PrimeHost code="1S"/>
  <ValidatingCxrDisplay settlementPlanCode="BSP" settlementPlanName="BILLING AND SETTLEMENT PLAN">
    <ValidatingCxrs ticketType="ETKTREQ">
      <Carrier code="3U"/>
      <Carrier code="5F"/>
      <Carrier code="5N"/>
      <Carrier code="6H"/>
      <Carrier code="7C"/>
      <Carrier code="7R"/>
      <Carrier code="8Q"/>
      <Carrier code="9U"/>
      <Carrier code="9W"/>
      <Carrier code="A3"/>
      <Carrier code="A9"/>
      <Carrier code="AA"/>
      <Carrier code="AC"/>
      <Carrier code="AD"/>
      <Carrier code="AF"/>
      <Carrier code="AH"/>
      <Carrier code="AI"/>
      <Carrier code="AM"/>
      <Carrier code="AR"/>
      <Carrier code="AT"/>
      <Carrier code="AY"/>
      <Carrier code="AZ"/>
      <Carrier code="B2"/>
      <Carrier code="BA"/>
      <Carrier code="BE"/>
      <Carrier code="BI"/>
      <Carrier code="BJ"/>
      <Carrier code="BT"/>
      <Carrier code="BV"/>
      <Carrier code="CA"/>
      <Carrier code="CI"/>
      <Carrier code="CM"/>
      <Carrier code="CX"/>
      <Carrier code="CZ"/>
      <Carrier code="DE"/>
      <Carrier code="DL"/>
      <Carrier code="DT"/>
      <Carrier code="EB"/>
      <Carrier code="EK"/>
      <Carrier code="EL"/>
      <Carrier code="EN"/>
      <Carrier code="ET"/>
      <Carrier code="EY"/>
      <Carrier code="FB"/>
      <Carrier code="FI"/>
      <Carrier code="FJ"/>
      <Carrier code="FZ"/>
      <Carrier code="G3"/>
      <Carrier code="GA"/>
      <Carrier code="GF"/>
      <Carrier code="GP"/>
      <Carrier code="GQ"/>
      <Carrier code="HA"/>
      <Carrier code="HM"/>
      <Carrier code="HO"/>
      <Carrier code="HR"/>
      <Carrier code="HU"/>
      <Carrier code="HX"/>
      <Carrier code="HY"/>
      <Carrier code="IB"/>
      <Carrier code="IG"/>
      <Carrier code="IZ"/>
      <Carrier code="J2"/>
      <Carrier code="JD"/>
      <Carrier code="JJ"/>
      <Carrier code="JL"/>
      <Carrier code="JP"/>
      <Carrier code="JU"/>
      <Carrier code="K6"/>
      <Carrier code="KC"/>
      <Carrier code="KE"/>
      <Carrier code="KK"/>
      <Carrier code="KL"/>
      <Carrier code="KM"/>
      <Carrier code="KQ"/>
      <Carrier code="LA"/>
      <Carrier code="LH"/>
      <Carrier code="LO"/>
      <Carrier code="LX"/>
      <Carrier code="LY"/>
      <Carrier code="MD"/>
      <Carrier code="MF"/>
      <Carrier code="MH"/>
      <Carrier code="MK"/>
      <Carrier code="MS"/>
      <Carrier code="MU"/>
      <Carrier code="NT"/>
      <Carrier code="NX"/>
      <Carrier code="NZ"/>
      <Carrier code="O6"/>
      <Carrier code="OK"/>
      <Carrier code="OM"/>
      <Carrier code="OS"/>
      <Carrier code="OU"/>
      <Carrier code="OY"/>
      <Carrier code="OZ"/>
      <Carrier code="PC"/>
      <Carrier code="PG"/>
      <Carrier code="PR"/>
      <Carrier code="PS"/>
      <Carrier code="QF"/>
      <Carrier code="QR"/>
      <Carrier code="R3"/>
      <Carrier code="RJ"/>
      <Carrier code="RO"/>
      <Carrier code="S7"/>
      <Carrier code="SA"/>
      <Carrier code="SB"/>
      <Carrier code="SC"/>
      <Carrier code="SK"/>
      <Carrier code="SN"/>
      <Carrier code="SQ"/>
      <Carrier code="ST"/>
      <Carrier code="SU"/>
      <Carrier code="SV"/>
      <Carrier code="SW"/>
      <Carrier code="TG"/>
      <Carrier code="TK"/>
      <Carrier code="TN"/>
      <Carrier code="TP"/>
      <Carrier code="TU"/>
      <Carrier code="TX"/>
      <Carrier code="U6"/>
      <Carrier code="UA"/>
      <Carrier code="UL"/>
      <Carrier code="UT"/>
      <Carrier code="UX"/>
      <Carrier code="VN"/>
      <Carrier code="VS"/>
      <Carrier code="VT"/>
      <Carrier code="W2"/>
      <Carrier code="WY"/>
      <Carrier code="YE"/>
      <Carrier code="YM"/>
      <Carrier code="ZI"/>
    </ValidatingCxrs>
    <GeneralSalesAgents carrierName="2I">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="2J">
      <Carrier code="GP"/>
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="3K">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="3M">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="4M">
      <Carrier code="LA"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="4U">
      <Carrier code="LH"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="5Q">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="5U">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="5W">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="7F">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="7I">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="8M">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="8U">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="9B">
      <Carrier code="LH"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="9K">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="A1">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="A5">
      <Carrier code="AF"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="AE">
      <Carrier code="CI"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="AS">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="B7">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BG">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BH">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BL">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BP">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BR">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="BW">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="CN">
      <Carrier code="HU"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="CY">
      <Carrier code="S7"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="D6">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="DN">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="DV">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="EI">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="EQ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="EW">
      <Carrier code="LH"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="FM">
      <Carrier code="MU"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="FS">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="GK">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="H1">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="H2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="H9">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="HQ">
      <Carrier code="DE"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="HZ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="ID">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="IE">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="J8">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="JC">
      <Carrier code="JL"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="JQ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="K2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="K5">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="KA">
      <Carrier code="CX"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="KP">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="KU">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="KX">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="LG">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="LI">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="LM">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="LQ">
      <Carrier code="HR"/>
      <Carrier code="W2"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="ME">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="MI">
      <Carrier code="SQ"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="ML">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="MT">
      <Carrier code="DE"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="NF">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="NU">
      <Carrier code="JL"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="O2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="OD">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="OR">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="P0">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="PU">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="PW">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="PX">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="PY">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="PZ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="QS">
      <Carrier code="OK"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="QV">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="R2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="RA">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="RQ">
      <Carrier code="GP"/>
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="S2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="S4">
      <Carrier code="GP"/>
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="SE">
      <Carrier code="GP"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="SS">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="SY">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TA">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TB">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TF">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TJ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TM">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="TZ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="U7">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="UM">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="UP">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="UU">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="V2">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="V3">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="V7">
      <Carrier code="GP"/>
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="VA">
      <Carrier code="SQ"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="VR">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="VW">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="VX">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="VY">
      <Carrier code="BA"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="W5">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WB">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WF">
      <Carrier code="SK"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WG">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WM">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WS">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="WW">
      <Carrier code="W2"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="XG">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="XK">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="XL">
      <Carrier code="JJ"/>
      <Carrier code="LA"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="XQ">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="XY">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="YV">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="Z8">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <GeneralSalesAgents carrierName="ZH">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
    <NeutralValidatingCxrs>
      <Carrier code="GP"/>
      <Carrier code="HR"/>
    </NeutralValidatingCxrs>
  </ValidatingCxrDisplay>
  <ValidatingCxrDisplay settlementPlanCode="TCH" settlementPlanName="TRANSPORT CLEARING HOUSE">
    <ValidatingCxrs ticketType="ETKTREQ">
      <Carrier code="7R"/>
      <Carrier code="A9"/>
      <Carrier code="DV"/>
      <Carrier code="GH"/>
      <Carrier code="HR"/>
      <Carrier code="UT"/>
      <Carrier code="Z9"/>
    </ValidatingCxrs>
    <ValidatingCxrs ticketType="ETKTPREF">
      <Carrier code="5N"/>
      <Carrier code="8Q"/>
      <Carrier code="B2"/>
      <Carrier code="BT"/>
      <Carrier code="EK"/>
      <Carrier code="EY"/>
      <Carrier code="FZ"/>
      <Carrier code="HY"/>
      <Carrier code="HZ"/>
      <Carrier code="J2"/>
      <Carrier code="KC"/>
      <Carrier code="KK"/>
      <Carrier code="LY"/>
      <Carrier code="NN"/>
      <Carrier code="OS"/>
      <Carrier code="PC"/>
      <Carrier code="PS"/>
      <Carrier code="R3"/>
      <Carrier code="U6"/>
      <Carrier code="Z6"/>
    </ValidatingCxrs>
    <GeneralSalesAgents carrierName="XK">
      <Carrier code="HR"/>
    </GeneralSalesAgents>
  </ValidatingCxrDisplay>
  <ValidatingCxrDisplay settlementPlanCode="GEN" settlementPlanName="GENERIC TRANSITIONAL AIRLINE TICKET">
    <ValidatingCxrs ticketType="ETKTREQ">
      <Carrier code="AF"/>
      <Carrier code="BG"/>
      <Carrier code="DV"/>
      <Carrier code="G3"/>
      <Carrier code="GF"/>
      <Carrier code="JJ"/>
      <Carrier code="S7"/>
      <Carrier code="U6"/>
      <Carrier code="UT"/>
      <Carrier code="VA"/>
      <Carrier code="VN"/>
    </ValidatingCxrs>
    <ValidatingCxrs ticketType="PTKTPREF">
      <Carrier code="LY"/>
    </ValidatingCxrs>
  </ValidatingCxrDisplay>
  <ValidatingCxrDisplay settlementPlanCode="RUT" settlementPlanName="RUSSIAN TRANSITIONAL AIRLINE TICKET">
    <ValidatingCxrs ticketType="PTKTPREF">
      <Carrier code="SU"/>
    </ValidatingCxrs>
  </ValidatingCxrDisplay>
  <ValidatingCxrDisplay settlementPlanCode="GTC" settlementPlanName="GUARANTEED TICKETING CARRIERS">
    <ValidatingCxrs ticketType="ETKTREQ">
      <Carrier code="3K"/>
      <Carrier code="4N"/>
      <Carrier code="7M"/>
      <Carrier code="BH"/>
      <Carrier code="BL"/>
      <Carrier code="E0"/>
      <Carrier code="F9"/>
      <Carrier code="GK"/>
      <Carrier code="JF"/>
      <Carrier code="JQ"/>
      <Carrier code="MO"/>
      <Carrier code="NK"/>
      <Carrier code="O1"/>
      <Carrier code="Q0"/>
      <Carrier code="R0"/>
      <Carrier code="WG"/>
      <Carrier code="WJ"/>
    </ValidatingCxrs>
  </ValidatingCxrDisplay>
  <ValidatingCxrDisplay settlementPlanCode="IPC" settlementPlanName="INSTANT PURCHASE CARRIERS">
    <ValidatingCxrs ticketType="ETKTREQ">
      <Carrier code="FR"/>
      <Carrier code="HV"/>
      <Carrier code="TO"/>
      <Carrier code="U2"/>
    </ValidatingCxrs>
  </ValidatingCxrDisplay>
</TicketingCxrDisplayRS>
{% endxmlsec %}

**Если настройка отключена**

Сервисы и форматы поиска перелетов и расчета стоимости используют традиционную логику выбора валидирующего перевозчика (первый маркетинговый перевозчик на маршруте или первый маркетинговый перевозчик, осуществляющий международный перелет, или первый маркетинговый перевозчик, осуществляющий пересечению зон IATA) без учета ограничений, указанных в 15 категории правил тарифов, а также без учета возможности оформления билетов выбранного перевозчика на выбранном стоке.

**Включение и отключение**

- проверка состояния настройки для iPCC:
    - отправить поисковый запрос к сервису [BargainFinderMaxRQ](https://developer.sabre.com/docs/soap_apis/air/search/bargain_finder_max) (см. [Поиск перелетов по заданным датам](shop.md)
    - наличие в ответе атрибута ```/OTA_AirLowFareSearchRS/PricedItineraries/PricedItinerary/AirItineraryPricingInfo/TPA_Extensions/ValidatingCarrier/@NewVcxProcess``` со значением ```true``` означает то, что настройка **включена**
- проверка состояния настройки для PCC:
    - забронировать любой сегмент в терминале
    - отправить команду расчета стоимости с диагностикой ```WPQ/*191```
    - ответ ```GSA DISABLED BASED ON TJR FOR PCC``` означает то, что настройка **отключена**
- для включения или отключения настройки необходимо обратиться к вашему куратору в Sabre
