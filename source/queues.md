# Обработка очередей

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

Очереди в Sabre — инструмент для контроля и учета бронирований, а также уведомления об изменении их состояния. Каждая очередь обладает уникальным номером от 0 до 511, при этом очереди с номерами от 0 до 49 являются системными, а остальные могут быть созданы пользователями самостоятельно. Бронирования попадают в системные очереди автоматически при возникновении определенных событий.

В таблице ниже представлен список основных системных очередей и причин помещения бронирований в них. Полный список системных очередей представлен в [Finder](https://central.sabre.com/s/article/queues---assigned-system-queues-0---49).

| Номер очереди | Причина помещения бронирования в очередь |
| -- | -- |
| 0  | перевозчик прислал сообщение или подтверждение услуги, вылет в течение 24 часов |
| 1  | перевозчик прислал сообщение или подтверждение услуги, вылет более чем через 24 часа |
| 2  | получен номер подтверждения от отеля, компании проката авто или от поставщика туров |
| 5  | перевозчик сообщил об изменении расписания, вылет в ближайшие 17 дней |
| 6  | перевозчик сообщил об изменении расписания, вылет более чем через 17 дней |
| 7  | статус одного или нескольких сегментов в бронировании изменился на ```HX``` |
| 9  | наступил срок оформления авиабилета, указанный через формат ```7TAW``` |
| 10 | наступил срок оформления авиабилета, указанный через формат ```7TAX``` |
| 12 | обнаружено бронирование с более чем 10 пассажирами |
| 17 | получено подтверждение листа ожидания, вылет в течение 24 часов |
| 18 | получено подтверждение листа ожидания, вылет более чем через 24 часа |
| 19 | обнаружена проблема с оформлением билета — необходимо проверить бронирование на ошибки |
| 20 | обнаружено двойное бронирование |
| 21 | возникла проблема с выпуском платежных документов или с обработкой полей ```*PAC``` |
| 22 | перевозчик изменил бронирование, содержащее данные о корп. политике организации поездок |
| 24 | получено подтверждение бронирования мест в салоне самолета |
| 25 | получено сообщение о проблеме с подтверждением мест в салоне самолета |
| 27 | получено сообщение об отказе при печати посадочных талонов |
| 28 | в бронирование с сегментами с типом доступа Answerback не был получен локатор от перевозчика |
| 29 | обнаружено бронирование, созданное через GetThere |
| 42 и 44 | получено уведомление от перевозчика о необходимости внесения паспорта через SSR DOCS |

Работа агентства предполагает регулярную обработку очередей. Обработка очередей состоит из двух процессов:
- получение списка бронирований в очередях
- обработка бронирований в очередях

## Получение списка бронирований в очередях

### Алгоритм получения списка бронирований в очередях

{% imgsec "Схема", "0", "queues-get" %}./assets/svg/queues/queues[get].svg{% endimgsec %}

### Получение списка очередей (QueueCountLLSRQ)

Для получения списка очередей используется сервис [QueueCountLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/queue/get_queue_count).

По умолчанию запрашивается список очередей для текущего PCC, однако в атрибуте ```/QueueCountRQ/QueueInfo/QueueIdentifier/@PseudoCityCode``` можно задать другой PCC (требуется наличие Branch Access).

{% xmlsec "Пример запроса", false %}
<QueueCountRQ ReturnHostCommand="true" Version="2.2.1" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <QueueInfo>
    <QueueIdentifier PseudoCityCode="2FRH"/>
  </QueueInfo>
</QueueCountRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<QueueCountRS Version="2.2.1" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-01-28T02:34:28-06:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="0D0AF4">QC/2FRH</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <QueueInfo DateTime="01-28T11:34" PseudoCityCode="2FRH">
    <QueueIdentifier Count="1" Number="S"/>
    <QueueIdentifier Count="82" Number="1"/>
    <QueueIdentifier Count="1" Number="5"/>
    <QueueIdentifier Count="17" Number="7"/>
    <QueueIdentifier Count="134" Number="9"/>
    <QueueIdentifier Count="9" Number="20"/>
    <QueueIdentifier Count="2" Number="25"/>
    <QueueIdentifier Count="134" Number="100"/>
    <QueueIdentifier Count="1" Number="101"/>
  </QueueInfo>
  <Totals Count="1" Type="MESSAGES"/>
  <Totals Count="0" Type="SPECIALS"/>
  <Totals Count="380" Type="PNRS"/>
</QueueCountRS>
{% endxmlsec %}

### Получение списка бронирований в очереди (QueueAccessLLSRQ)

Для получения списка бронирований в очереди используется сервис [QueueAccessLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/queue/Access_Queue). Получение списка бронирований в очереди — информационный запрос, после него не происходит вход в очередь, а значит бронированиями в этой очереди нельзя управлять.

В запросе должны быть указаны:
- ```/QueueAccessRQ/QueueIdentifier/@Number``` — номер очереди
- ```/QueueAccessRQ/QueueIdentifier/@PseudoCityCode``` — PCC, в котором находится очередь
- ```/QueueAccessRQ/QueueIdentifier/List/@Ind``` — индикатор получения списка бронирований в очереди (значение ```true```)
- ```/QueueAccessRQ/QueueIdentifier/List/@PrimaryPassenger``` — получение информации о первом пассажире в бронировании в списке бронирований в очереди (значения ```true``` или ```false```)

{% xmlsec "Пример запроса", false %}
<QueueAccessRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <QueueIdentifier Number="9" PseudoCityCode="2FRH">
    <List Ind="true" PrimaryPassenger="false"/>
  </QueueIdentifier>
</QueueAccessRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<QueueAccessRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-04-13T04:20:13-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="1D27F3">Q/2FRH9/L</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <Line Number="1">
    <DateTime>2020-02-25T08:53</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="MIEXLT"/>
  </Line>
  <Line Number="2">
    <DateTime>2020-02-26T02:37</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="EOBGFF"/>
  </Line>
  <Line Number="3">
    <DateTime>2020-02-26T04:38</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="EPBYAC"/>
  </Line>
  <Line Number="4">
    <DateTime>2020-02-26T09:38</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="QWQFLD"/>
  </Line>
  <Line Number="5">
    <DateTime>2020-02-26T09:39</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="FSZKDB"/>
  </Line>
  <Line Number="6">
    <DateTime>2020-02-27T06:37</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="GVMAJI"/>
  </Line>
  <Line Number="7">
    <DateTime>2020-03-06T07:13</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="MOIMER"/>
  </Line>
  <Line Number="8">
    <DateTime>2020-03-06T08:01</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="MPOCYP"/>
  </Line>
  <Line Number="9">
    <DateTime>2020-03-06T09:54</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="YNYNGC"/>
  </Line>
  <Line Number="10">
    <DateTime>2020-03-10T02:21</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="NSU"/>
    </POS>
    <UniqueID ID="RXDXMC"/>
  </Line>
  <Line Number="11">
    <DateTime>2020-03-10T03:18</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="RYRAXQ"/>
  </Line>
  <Line Number="12">
    <DateTime>2020-03-10T03:18</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="HPAJJH"/>
  </Line>
  <Line Number="13">
    <DateTime>2020-03-10T03:19</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="RYRKZT"/>
  </Line>
  <Line Number="14">
    <DateTime>2020-03-12T03:26</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="CYODCM"/>
  </Line>
  <Line Number="15">
    <DateTime>2020-03-12T03:27</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="INRYIE"/>
  </Line>
  <Line Number="16">
    <DateTime>2020-03-12T05:08</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="TCGAUB"/>
  </Line>
  <Line Number="17">
    <DateTime>2020-03-12T05:10</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="TCHWRM"/>
  </Line>
  <Line Number="18">
    <DateTime>2020-03-12T05:12</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="TCHJXY"/>
  </Line>
  <Line Number="19">
    <DateTime>2020-03-12T05:14</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="CALHAW"/>
  </Line>
  <Line Number="20">
    <DateTime>2020-03-16T08:54</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="JPSVWV"/>
  </Line>
  <Line Number="21">
    <DateTime>2020-03-16T08:55</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="DPRKNF"/>
  </Line>
  <Line Number="22">
    <DateTime>2020-03-17T08:10</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="EFFXOS"/>
  </Line>
  <Line Number="23">
    <DateTime>2020-03-17T08:10</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="VEUTPP"/>
  </Line>
  <Line Number="24">
    <DateTime>2020-03-17T09:32</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="EGHHFI"/>
  </Line>
  <Line Number="25">
    <DateTime>2020-03-17T10:51</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="VGVYMP"/>
  </Line>
  <Line Number="26">
    <DateTime>2020-03-17T12:54</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="VHDGNH"/>
  </Line>
  <Line Number="27">
    <DateTime>2020-03-17T13:20</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="EJZDPH"/>
  </Line>
  <Line Number="28">
    <DateTime>2020-03-17T13:23</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="EJAFKJ"/>
  </Line>
  <Line Number="29">
    <DateTime>2020-03-17T13:40</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="EJHVMK"/>
  </Line>
  <Line Number="30">
    <DateTime>2020-03-17T13:49</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="EJJHLM"/>
  </Line>
  <Line Number="31">
    <DateTime>2020-03-18T01:57</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FRGFYX"/>
  </Line>
  <Line Number="32">
    <DateTime>2020-03-18T02:04</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="WQUOMK"/>
  </Line>
  <Line Number="33">
    <DateTime>2020-03-18T02:17</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="WQZTYK"/>
  </Line>
  <Line Number="34">
    <DateTime>2020-03-18T02:39</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FSWHMF"/>
  </Line>
  <Line Number="35">
    <DateTime>2020-03-19T02:54</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="UDIVWR"/>
  </Line>
  <Line Number="36">
    <DateTime>2020-03-19T02:59</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="KPBUCF"/>
  </Line>
  <Line Number="37">
    <DateTime>2020-03-19T03:04</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="WCEUJL"/>
  </Line>
  <Line Number="38">
    <DateTime>2020-03-19T04:51</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FFBDML"/>
  </Line>
  <Line Number="39">
    <DateTime>2020-03-19T05:16</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="LQZHIS"/>
  </Line>
  <Line Number="40">
    <DateTime>2020-03-19T05:25</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FFLISR"/>
  </Line>
  <Line Number="41">
    <DateTime>2020-03-19T05:43</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="WEBFPQ"/>
  </Line>
  <Line Number="42">
    <DateTime>2020-03-19T05:49</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FGRFQP"/>
  </Line>
  <Line Number="43">
    <DateTime>2020-03-19T05:55</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="WEEZNP"/>
  </Line>
  <Line Number="44">
    <DateTime>2020-03-19T06:11</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="WEIXBV"/>
  </Line>
  <Line Number="45">
    <DateTime>2020-03-19T06:57</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="FGJLVB"/>
  </Line>
  <Line Number="46">
    <DateTime>2020-03-19T07:00</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="LQOPRR"/>
  </Line>
  <Line Number="47">
    <DateTime>2020-03-23T02:33</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="MSSLXE"/>
  </Line>
  <Line Number="48">
    <DateTime>2020-03-23T02:49</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="XPUXHW"/>
  </Line>
  <Line Number="49">
    <DateTime>2020-03-27T14:25</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="XRQDWA"/>
  </Line>
  <Line Number="50">
    <DateTime>2020-03-27T15:27</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="XRDZHA"/>
  </Line>
  <Line Number="51">
    <DateTime>2020-03-27T15:32</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="QAKUYR"/>
  </Line>
  <Line Number="52">
    <DateTime>2020-03-27T15:35</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="ZLFLAA"/>
  </Line>
  <Line Number="53">
    <DateTime>2020-03-28T06:46</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="ARWVPE"/>
  </Line>
  <Line Number="54">
    <DateTime>2020-03-28T08:31</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="ARYSGO"/>
  </Line>
  <Line Number="55">
    <DateTime>2020-03-28T09:07</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="ARYMCT"/>
  </Line>
  <Line Number="56">
    <DateTime>2020-03-28T10:33</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="QFEHCV"/>
  </Line>
  <Line Number="57">
    <DateTime>2020-03-28T10:37</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="JWJVSS"/>
  </Line>
  <Line Number="58">
    <DateTime>2020-03-31T09:03</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="KZARZJ"/>
  </Line>
  <Line Number="59">
    <DateTime>2020-03-31T09:52</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="KAQYSC"/>
  </Line>
  <Line Number="60">
    <DateTime>2020-03-31T10:02</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YTLIMF"/>
  </Line>
  <Line Number="61">
    <DateTime>2020-03-31T11:13</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YUSIHI"/>
  </Line>
  <Line Number="62">
    <DateTime>2020-03-31T14:48</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="REYAFP"/>
  </Line>
  <Line Number="63">
    <DateTime>2020-03-31T15:08</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="RECHUU"/>
  </Line>
  <Line Number="64">
    <DateTime>2020-03-31T15:26</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="KDDJEE"/>
  </Line>
  <Line Number="65">
    <DateTime>2020-03-31T15:38</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="BYRNYW"/>
  </Line>
  <Line Number="66">
    <DateTime>2020-03-31T15:39</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YWTPPP"/>
  </Line>
  <Line Number="67">
    <DateTime>2020-03-31T15:40</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="REFPQI"/>
  </Line>
  <Line Number="68">
    <DateTime>2020-03-31T15:53</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="KDJNTV"/>
  </Line>
  <Line Number="69">
    <DateTime>2020-03-31T15:54</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YWYMNQ"/>
  </Line>
  <Line Number="70">
    <DateTime>2020-03-31T15:55</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YWZYZX"/>
  </Line>
  <Line Number="71">
    <DateTime>2020-04-01T06:04</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="BFKGHI"/>
  </Line>
  <Line Number="72">
    <DateTime>2020-04-01T06:18</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="KMRKZW"/>
  </Line>
  <Line Number="73">
    <DateTime>2020-04-01T06:42</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="BFPNGM"/>
  </Line>
  <Line Number="74">
    <DateTime>2020-04-01T06:45</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="BGQZLV"/>
  </Line>
  <Line Number="75">
    <DateTime>2020-04-01T06:55</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="KMYJTW"/>
  </Line>
  <Line Number="76">
    <DateTime>2020-04-01T07:02</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="YCYTWF"/>
  </Line>
  <Line Number="77">
    <DateTime>2020-04-01T07:05</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="RKGPPB"/>
  </Line>
  <Line Number="78">
    <DateTime>2020-04-08T04:05</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="QWXNGH"/>
  </Line>
  <Line Number="79">
    <DateTime>2020-04-08T07:07</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="QXVBTY"/>
  </Line>
  <Line Number="80">
    <DateTime>2020-04-08T07:20</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="DMITGW"/>
  </Line>
  <Line Number="81">
    <DateTime>2020-04-08T07:21</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="AWXEKA"/>
  </Line>
  <Line Number="82">
    <DateTime>2020-04-08T07:40</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="TDMBSG"/>
  </Line>
  <Line Number="83">
    <DateTime>2020-04-08T07:41</DateTime>
    <POS>
      <Source AgentSine="AWT" PseudoCityCode="9LSC"/>
    </POS>
    <UniqueID ID="QXXJWP"/>
  </Line>
  <Line Number="84">
    <DateTime>2020-04-10T04:23</DateTime>
    <POS>
      <Source AgentSine="HPA" PseudoCityCode="LRQ"/>
    </POS>
    <UniqueID ID="AHDLIT"/>
  </Line>
  <Paragraph>
    <Text>QUEUE LIST FOR 2FRH  QUEUE 009 ON 13APR AT 1220</Text>
    <Text>NUM PNR LOCATOR    PLACED BY     DATE      TIME    GROUP</Text>
    <Text>1  MIEXLT        LRQ   HPA     25FEB20   0853</Text>
    <Text>2  EOBGFF        LRQ   HPA     26FEB20   0237</Text>
    <Text>3  EPBYAC        LRQ   HPA     26FEB20   0438</Text>
    <Text>4  QWQFLD        LRQ   HPA     26FEB20   0938</Text>
    <Text>5  FSZKDB        LRQ   HPA     26FEB20   0939</Text>
    <Text>6  GVMAJI        LRQ   HPA     27FEB20   0637</Text>
    <Text>7  MOIMER        LRQ   HPA     06MAR20   0713</Text>
    <Text>8  MPOCYP        LRQ   HPA     06MAR20   0801</Text>
    <Text>9  YNYNGC        LRQ   HPA     06MAR20   0954</Text>
    <Text>10  RXDXMC        NSU   HPA     10MAR20   0221</Text>
    <Text>11  RYRAXQ        LRQ   HPA     10MAR20   0318</Text>
    <Text>12  HPAJJH        LRQ   HPA     10MAR20   0318</Text>
    <Text>13  RYRKZT        LRQ   HPA     10MAR20   0319</Text>
    <Text>14  CYODCM        LRQ   HPA     12MAR20   0326</Text>
    <Text>15  INRYIE        LRQ   HPA     12MAR20   0327</Text>
    <Text>16  TCGAUB        9LSC  AWT     12MAR20   0508</Text>
    <Text>17  TCHWRM        9LSC  AWT     12MAR20   0510</Text>
    <Text>18  TCHJXY        9LSC  AWT     12MAR20   0512</Text>
    <Text>19  CALHAW        9LSC  AWT     12MAR20   0514</Text>
    <Text>20  JPSVWV        LRQ   HPA     16MAR20   0854</Text>
    <Text>21  DPRKNF        LRQ   HPA     16MAR20   0855</Text>
    <Text>22  EFFXOS        9LSC  AWT     17MAR20   0810</Text>
    <Text>23  VEUTPP        9LSC  AWT     17MAR20   0810</Text>
    <Text>24  EGHHFI        LRQ   HPA     17MAR20   0932</Text>
    <Text>25  VGVYMP        9LSC  AWT     17MAR20   1051</Text>
    <Text>26  VHDGNH        9LSC  AWT     17MAR20   1254</Text>
    <Text>27  EJZDPH        9LSC  AWT     17MAR20   1320</Text>
    <Text>28  EJAFKJ        9LSC  AWT     17MAR20   1323</Text>
    <Text>29  EJHVMK        9LSC  AWT     17MAR20   1340</Text>
    <Text>30  EJJHLM        9LSC  AWT     17MAR20   1349</Text>
    <Text>31  FRGFYX        9LSC  AWT     18MAR20   0157</Text>
    <Text>32  WQUOMK        9LSC  AWT     18MAR20   0204</Text>
    <Text>33  WQZTYK        9LSC  AWT     18MAR20   0217</Text>
    <Text>34  FSWHMF        9LSC  AWT     18MAR20   0239</Text>
    <Text>35  UDIVWR        LRQ   HPA     19MAR20   0254</Text>
    <Text>36  KPBUCF        LRQ   HPA     19MAR20   0259</Text>
    <Text>37  WCEUJL        LRQ   HPA     19MAR20   0304</Text>
    <Text>38  FFBDML        9LSC  AWT     19MAR20   0451</Text>
    <Text>39  LQZHIS        9LSC  AWT     19MAR20   0516</Text>
    <Text>40  FFLISR        9LSC  AWT     19MAR20   0525</Text>
    <Text>41  WEBFPQ        9LSC  AWT     19MAR20   0543</Text>
    <Text>42  FGRFQP        9LSC  AWT     19MAR20   0549</Text>
    <Text>43  WEEZNP        9LSC  AWT     19MAR20   0555</Text>
    <Text>44  WEIXBV        9LSC  AWT     19MAR20   0611</Text>
    <Text>45  FGJLVB        9LSC  AWT     19MAR20   0657</Text>
    <Text>46  LQOPRR        9LSC  AWT     19MAR20   0700</Text>
    <Text>47  MSSLXE        9LSC  AWT     23MAR20   0233</Text>
    <Text>48  XPUXHW        9LSC  AWT     23MAR20   0249</Text>
    <Text>49  XRQDWA        9LSC  AWT     27MAR20   1425</Text>
    <Text>50  XRDZHA        9LSC  AWT     27MAR20   1527</Text>
    <Text>51  QAKUYR        9LSC  AWT     27MAR20   1532</Text>
    <Text>52  ZLFLAA        9LSC  AWT     27MAR20   1535</Text>
    <Text>53  ARWVPE        LRQ   HPA     28MAR20   0646</Text>
    <Text>54  ARYSGO        9LSC  AWT     28MAR20   0831</Text>
    <Text>55  ARYMCT        9LSC  AWT     28MAR20   0907</Text>
    <Text>56  QFEHCV        9LSC  AWT     28MAR20   1033</Text>
    <Text>57  JWJVSS        9LSC  AWT     28MAR20   1037</Text>
    <Text>58  KZARZJ        LRQ   HPA     31MAR20   0903</Text>
    <Text>59  KAQYSC        9LSC  AWT     31MAR20   0952</Text>
    <Text>60  YTLIMF        9LSC  AWT     31MAR20   1002</Text>
    <Text>61  YUSIHI        9LSC  AWT     31MAR20   1113</Text>
    <Text>62  REYAFP        9LSC  AWT     31MAR20   1448</Text>
    <Text>63  RECHUU        9LSC  AWT     31MAR20   1508</Text>
    <Text>64  KDDJEE        9LSC  AWT     31MAR20   1526</Text>
    <Text>65  BYRNYW        9LSC  AWT     31MAR20   1538</Text>
    <Text>66  YWTPPP        9LSC  AWT     31MAR20   1539</Text>
    <Text>67  REFPQI        9LSC  AWT     31MAR20   1540</Text>
    <Text>68  KDJNTV        9LSC  AWT     31MAR20   1553</Text>
    <Text>69  YWYMNQ        9LSC  AWT     31MAR20   1554</Text>
    <Text>70  YWZYZX        9LSC  AWT     31MAR20   1555</Text>
    <Text>71  BFKGHI        9LSC  AWT     01APR20   0604</Text>
    <Text>72  KMRKZW        9LSC  AWT     01APR20   0618</Text>
    <Text>73  BFPNGM        9LSC  AWT     01APR20   0642</Text>
    <Text>74  BGQZLV        9LSC  AWT     01APR20   0645</Text>
    <Text>75  KMYJTW        9LSC  AWT     01APR20   0655</Text>
    <Text>76  YCYTWF        9LSC  AWT     01APR20   0702</Text>
    <Text>77  RKGPPB        9LSC  AWT     01APR20   0705</Text>
    <Text>78  QWXNGH        LRQ   HPA     08APR20   0405</Text>
    <Text>79  QXVBTY        9LSC  AWT     08APR20   0707</Text>
    <Text>80  DMITGW        9LSC  AWT     08APR20   0720</Text>
    <Text>81  AWXEKA        9LSC  AWT     08APR20   0721</Text>
    <Text>82  TDMBSG        9LSC  AWT     08APR20   0740</Text>
    <Text>83  QXXJWP        9LSC  AWT     08APR20   0741</Text>
    <Text>84  AHDLIT        LRQ   HPA     10APR20   0423</Text>
    <Text>END OF LIST</Text>
  </Paragraph>
</QueueAccessRS>
{% endxmlsec %}

## Обработка бронирований в очередях

### Алгоритм обработки бронирований в очередях

{% imgsec "Схема", "0", "queues-pnr" %}./assets/svg/queues/queues[PNR].svg{% endimgsec %}

### Чтение бронирования (TravelItineraryReadRQ)

Для чтения бронирования используется сервис [TravelItineraryReadRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/Get_Itinerary).

В качестве значения атрибута ```/TravelItineraryReadRQ/UniqueID/@ID``` в запросе указывается код бронирования (PNR Record Locator).

{% xmlsec "Пример запроса", false %}
<TravelItineraryReadRQ Version="3.10.0" xmlns="http://services.sabre.com/res/tir/v3_10">
  <MessagingDetails>
    <SubjectAreas>
      <SubjectArea>FULL</SubjectArea>
    </SubjectAreas>
  </MessagingDetails>
  <UniqueID ID="YWZYZX"/>
</TravelItineraryReadRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<tir310:TravelItineraryReadRS Version="3.10.0" xmlns:or110="http://services.sabre.com/res/or/v1_11" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:tir310="http://services.sabre.com/res/tir/v3_10">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-04-13T04:24:36.361-05:00"/>
  </stl:ApplicationResults>
  <tir310:TravelItinerary>
    <tir310:AccountingInfo Id="32">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="59990"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251316"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="100"/>
        <tir310:Payment>
          <tir310:CC_Info>
            <tir310:PaymentCard Code="AX" Number="3XXXXXXXXXX8431"/>
          </tir310:CC_Info>
          <tir310:Form>CC</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4148"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="33">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="10"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251316"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="0"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="1.1">IVANOV IVAN MR</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="0"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="34">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="59990"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251317"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="100"/>
        <tir310:Payment>
          <tir310:CC_Info>
            <tir310:PaymentCard Code="AX" Number="3XXXXXXXXXX8431"/>
          </tir310:CC_Info>
          <tir310:Form>CC</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="4148"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="35">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="10"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251317"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="0"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="2.1">IVANOVA ELENA MS</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="0"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="45">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="44990"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251318"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="100"/>
        <tir310:Payment>
          <tir310:CC_Info>
            <tir310:PaymentCard Code="AX" Number="3XXXXXXXXXX8431"/>
          </tir310:CC_Info>
          <tir310:Form>CC</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY CHD</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="3844"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:AccountingInfo Id="46">
      <tir310:Airline Code="SU"/>
      <tir310:BaseFare Amount="10"/>
      <tir310:DocumentInfo>
        <tir310:Document Number="3741251318"/>
      </tir310:DocumentInfo>
      <tir310:FareApplication>ONE</tir310:FareApplication>
      <tir310:PaymentInfo>
        <tir310:Commission Amount="0"/>
        <tir310:Payment>
          <tir310:Form>CA</tir310:Form>
        </tir310:Payment>
      </tir310:PaymentInfo>
      <tir310:PersonName NameNumber="3.1">IVANOV ANDREY CHD</tir310:PersonName>
      <tir310:Taxes>
        <tir310:GST Amount="0"/>
        <tir310:Tax Amount="0"/>
      </tir310:Taxes>
      <tir310:TicketingInfo>
        <tir310:eTicket Ind="true"/>
        <tir310:Exchange Ind="false"/>
        <tir310:TariffBasis>D</tir310:TariffBasis>
        <tir310:Ticketing ConjunctedCount="1"/>
      </tir310:TicketingInfo>
    </tir310:AccountingInfo>
    <tir310:CustomerInfo>
      <tir310:ContactNumbers>
        <tir310:ContactNumber Id="14" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
        <tir310:ContactNumber Id="15" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
      </tir310:ContactNumbers>
      <tir310:PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-2.1">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:Email Comment="TO/" Id="12" Type="TO">CUSTOMER@CUSTOMER.COM</tir310:Email>
        <tir310:GivenName>IVAN MR</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-4.2">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ELENA MS</tir310:GivenName>
        <tir310:Surname>IVANOVA</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-6.3">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>ANDREY</tir310:GivenName>
        <tir310:Surname>IVANOV</tir310:Surname>
      </tir310:PersonName>
      <tir310:PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-8.4">
        <tir310:Email Comment="BC/" Id="13" Type="BC">AGENCY@AGENCY.COM</tir310:Email>
        <tir310:GivenName>EKATERINA</tir310:GivenName>
        <tir310:Surname>IVANOVA</tir310:Surname>
      </tir310:PersonName>
    </tir310:CustomerInfo>
    <tir310:ItineraryInfo>
      <tir310:ItineraryPricing>
        <tir310:PriceQuote RPH="1">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 2355/31MAR20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="1" StatusCode="A" StoredDateTime="2020-03-31T23:55" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="60000" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="4148" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">3000YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">540YR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">608RI</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="64148" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="120000"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="8296"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="128296"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="ADT" Quantity="02"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>NON-REF/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/YCLR"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER30000SU MOW30000RUB60000END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="30000" FareBasisCode="YCLR" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="30000" FareBasisCode="YCLR" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="ADT">
              <tir310:PassengerData NameNumber="01.01">IVANOV/IVAN MR</tir310:PassengerData>
              <tir310:PassengerData NameNumber="02.01">IVANOVA/ELENA MS</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuote RPH="2">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 2355/31MAR20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="2" StatusCode="A" StoredDateTime="2020-03-31T23:55" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="45000" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="3844" TaxCode="XT"/>
                  <tir310:TaxBreakdownCode TaxPaid="false">3000YQ</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">540YR</tir310:TaxBreakdownCode>
                  <tir310:TaxBreakdownCode TaxPaid="false">304RI</tir310:TaxBreakdownCode>
                </tir310:Taxes>
                <tir310:TotalFare Amount="48844" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="45000"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="3844"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="48844"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="CNN" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH CNN REQUIRES ACCOMPANYING SAME CABIN ADT</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB2600/CHG AFT DEP UP TO RUB2600/REF BEF DEP</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>UP TO RUB2600/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>NON-REF/SEE RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/CH25/YCLR/CH25"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER22500SU MOW22500RUB45000END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/CH25"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="OK">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/CH25"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="22500" FareBasisCode="YCLR/CH25" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="CH25">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="22500" FareBasisCode="YCLR/CH25" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="CH25">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="CNN">
              <tir310:PassengerData NameNumber="03.01">IVANOV/ANDREY</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuote RPH="3">
          <tir310:MiscInformation>
            <tir310:SignatureLine ExpirationDateTime="00:00" Source="SYS" Status="ACTIVE">
              <tir310:Text>2FRH 9LSC*AWT 2355/31MAR20</tir310:Text>
            </tir310:SignatureLine>
          </tir310:MiscInformation>
          <tir310:PricedItinerary DisplayOnly="false" InputMessage="WPASU¥MP-I¥BREC¥RQ" RPH="3" StatusCode="A" StoredDateTime="2020-03-31T23:55" TaxExempt="false" ValidatingCarrier="SU">
            <tir310:AirItineraryPricingInfo>
              <tir310:ItinTotalFare>
                <tir310:BaseFare Amount="0" CurrencyCode="RUB"/>
                <tir310:Taxes>
                  <tir310:Tax Amount="0" TaxCode="TE"/>
                </tir310:Taxes>
                <tir310:TotalFare Amount="0" CurrencyCode="RUB"/>
                <tir310:Totals>
                  <tir310:BaseFare Amount="0"/>
                  <tir310:Taxes>
                    <tir310:Tax Amount="0"/>
                  </tir310:Taxes>
                  <tir310:TotalFare Amount="0"/>
                </tir310:Totals>
              </tir310:ItinTotalFare>
              <tir310:PassengerTypeQuantity Code="INF" Quantity="01"/>
              <tir310:PTC_FareBreakdown>
                <tir310:Endorsements>
                  <tir310:Endorsement type="PRICING_PARAMETER">
                    <tir310:Text>WPASU$MP-I$BREC$RQ</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>EACH INF REQUIRES ACCOMPANYING ADT PASSENGER</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>VALIDATING CARRIER SPECIFIED - SU</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>CHG BEF DEP UP TO RUB0/CHG AFT DEP UP TO RUB0/REF BEF DEP UP TO</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>RUB0/REF AFT DEP UP TO RUB5200/OTHERWISE NON-CHG NON-REF/SEE</tir310:Text>
                  </tir310:Endorsement>
                  <tir310:Endorsement type="WARNING">
                    <tir310:Text>RULES</tir310:Text>
                  </tir310:Endorsement>
                </tir310:Endorsements>
                <tir310:FareBasis Code="YCLR/IN00/YCLR/IN00"/>
                <tir310:FareCalculation>
                  <tir310:Text>MOW SU AER0SU MOW0RUB0END</tir310:Text>
                </tir310:FareCalculation>
                <tir310:FareSource>ATPC</tir310:FareSource>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-01T07:45" FlightNumber="1138" ResBookDesigCode="Y" SegmentNumber="1" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/IN00"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1138"/>
                  <tir310:OriginLocation LocationCode="SVO"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-01</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-01</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment ConnectionInd="O" DepartureDateTime="09-08T02:45" FlightNumber="1129" ResBookDesigCode="Y" SegmentNumber="2" Status="NS">
                  <tir310:BaggageAllowance Number="01P"/>
                  <tir310:FareBasis Code="YCLR/IN00"/>
                  <tir310:MarketingAirline Code="SU" FlightNumber="1129"/>
                  <tir310:OriginLocation LocationCode="AER"/>
                  <tir310:ValidityDates>
                    <tir310:NotValidAfter>2020-09-08</tir310:NotValidAfter>
                    <tir310:NotValidBefore>2020-09-08</tir310:NotValidBefore>
                  </tir310:ValidityDates>
                </tir310:FlightSegment>
                <tir310:FlightSegment>
                  <tir310:OriginLocation LocationCode="SVO"/>
                </tir310:FlightSegment>
                <tir310:FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="1" FareDirectionality="FROM" GoverningCarrier="SU" TicketDesignator="IN00">
                  <tir310:Location Destination="AER" Origin="MOW"/>
                  <tir310:Dates ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>1</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:FareComponent Amount="0" FareBasisCode="YCLR/IN00" FareComponentNumber="2" FareDirectionality="TO" GoverningCarrier="SU" TicketDesignator="IN00">
                  <tir310:Location Destination="MOW" Origin="AER"/>
                  <tir310:Dates ArrivalDateTime="09-08T05:20" DepartureDateTime="09-08T02:45"/>
                  <tir310:FlightSegmentNumbers>
                    <tir310:FlightSegmentNumber>2</tir310:FlightSegmentNumber>
                  </tir310:FlightSegmentNumbers>
                </tir310:FareComponent>
                <tir310:ResTicketingRestrictions>LAST DAY TO PURCHASE 27AUG/2359</tir310:ResTicketingRestrictions>
                <tir310:ResTicketingRestrictions>GUARANTEED FARE APPL IF PURCHASED BEFORE 27AUG</tir310:ResTicketingRestrictions>
              </tir310:PTC_FareBreakdown>
            </tir310:AirItineraryPricingInfo>
          </tir310:PricedItinerary>
          <tir310:ResponseHeader>
            <tir310:Text>FARE - PRICE RETAINED</tir310:Text>
            <tir310:Text>FARE USED TO CALCULATE DISCOUNT</tir310:Text>
            <tir310:Text>FARE NOT GUARANTEED UNTIL TICKETED</tir310:Text>
          </tir310:ResponseHeader>
          <tir310:PriceQuotePlus DiscountAmount="0" DisplayOnly="false" DomesticIntlInd="I" IT_BT_Fare="BT" ItineraryChanged="false" ManualFare="false" NUCSuppresion="false" NegotiatedFare="false" PricingStatus="S" SubjToGovtApproval="false" SystemIndicator="S" VerifyFareCalc="false">
            <tir310:PassengerInfo PassengerType="INF">
              <tir310:PassengerData NameNumber="04.01">IVANOVA/EKATERINA</tir310:PassengerData>
            </tir310:PassengerInfo>
            <tir310:TicketingInstructionsInfo/>
          </tir310:PriceQuotePlus>
        </tir310:PriceQuote>
        <tir310:PriceQuoteTotals>
          <tir310:BaseFare Amount="165000.00"/>
          <tir310:Taxes>
            <tir310:Tax Amount="12140.00"/>
          </tir310:Taxes>
          <tir310:TotalFare Amount="177140.00"/>
        </tir310:PriceQuoteTotals>
      </tir310:ItineraryPricing>
      <tir310:ReservationItems>
        <tir310:Item RPH="1">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-01T10:15" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-01T07:45" ElapsedTime="02.30" FlightNumber="1138" Id="16" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-03-31T15:55:00" SegmentNumber="0001" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="AER"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1138" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:SupplierRef ID="DCSU*KDKPXY"/>
            <tir310:UpdatedArrivalTime>09-01T10:15</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-01T07:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="2" sequence="1">
                <or110:DepartureAirport>SVO</or110:DepartureAirport>
                <or110:DepartureTerminalName>TERMINAL B - DOMESTIC</or110:DepartureTerminalName>
                <or110:DepartureTerminalCode>B</or110:DepartureTerminalCode>
                <or110:ArrivalAirport>AER</or110:ArrivalAirport>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1138</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>150</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*KDKPXY</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-01T07:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-01T10:15:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1138</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-03-31T15:55:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
        <tir310:Item RPH="2">
          <tir310:FlightSegment AirMilesFlown="0873" ArrivalDateTime="09-08T05:20" CodeShare="false" DayOfWeekInd="2" DepartureDateTime="2020-09-08T02:45" ElapsedTime="02.35" FlightNumber="1129" Id="17" IsPast="false" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2020-03-31T15:55:00" SegmentNumber="0002" SmokingAllowed="false" SpecialMeal="false" Status="HK" StopQuantity="00" eTicket="true">
            <tir310:DestinationLocation LocationCode="SVO" Terminal="TERMINAL B - DOMESTIC" TerminalCode="B"/>
            <tir310:Equipment AirEquipType="73H"/>
            <tir310:MarketingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
              <tir310:Banner>MARKETED BY AEROFLOT</tir310:Banner>
            </tir310:MarketingAirline>
            <tir310:Meal Code="S"/>
            <tir310:OperatingAirline Code="SU" FlightNumber="1129" ResBookDesigCode="Y">
              <tir310:Banner>OPERATED BY AEROFLOT</tir310:Banner>
            </tir310:OperatingAirline>
            <tir310:OperatingAirlinePricing Code="SU"/>
            <tir310:DisclosureCarrier Code="SU" DOT="false">
              <tir310:Banner>AEROFLOT</tir310:Banner>
            </tir310:DisclosureCarrier>
            <tir310:OriginLocation LocationCode="AER"/>
            <tir310:SupplierRef ID="DCSU*KDKPXY"/>
            <tir310:UpdatedArrivalTime>09-08T05:20</tir310:UpdatedArrivalTime>
            <tir310:UpdatedDepartureTime>09-08T02:45</tir310:UpdatedDepartureTime>
          </tir310:FlightSegment>
          <tir310:Product>
            <or110:ProductDetails productCategory="AIR">
              <or110:ProductName type="AIR"/>
              <or110:Air segmentAssociationId="3" sequence="2">
                <or110:DepartureAirport>AER</or110:DepartureAirport>
                <or110:ArrivalAirport>SVO</or110:ArrivalAirport>
                <or110:ArrivalTerminalName>TERMINAL B - DOMESTIC</or110:ArrivalTerminalName>
                <or110:ArrivalTerminalCode>B</or110:ArrivalTerminalCode>
                <or110:EquipmentType>73H</or110:EquipmentType>
                <or110:MarketingAirlineCode>SU</or110:MarketingAirlineCode>
                <or110:MarketingFlightNumber>1129</or110:MarketingFlightNumber>
                <or110:MarketingClassOfService>Y</or110:MarketingClassOfService>
                <or110:MealCode>S</or110:MealCode>
                <or110:ElapsedTime>155</or110:ElapsedTime>
                <or110:AirMilesFlown>873</or110:AirMilesFlown>
                <or110:FunnelFlight>false</or110:FunnelFlight>
                <or110:ChangeOfGauge>false</or110:ChangeOfGauge>
                <or110:DisclosureCarrier Code="SU" DOT="false">
                  <or110:Banner>AEROFLOT</or110:Banner>
                </or110:DisclosureCarrier>
                <or110:AirlineRefId>DCSU*KDKPXY</or110:AirlineRefId>
                <or110:Eticket>true</or110:Eticket>
                <or110:DepartureDateTime>2020-09-08T02:45:00</or110:DepartureDateTime>
                <or110:ArrivalDateTime>2020-09-08T05:20:00</or110:ArrivalDateTime>
                <or110:FlightNumber>1129</or110:FlightNumber>
                <or110:ClassOfService>Y</or110:ClassOfService>
                <or110:ActionCode>HK</or110:ActionCode>
                <or110:NumberInParty>3</or110:NumberInParty>
                <or110:inboundConnection>false</or110:inboundConnection>
                <or110:outboundConnection>false</or110:outboundConnection>
                <or110:SegmentBookedDate>2020-03-31T15:55:00</or110:SegmentBookedDate>
              </or110:Air>
            </or110:ProductDetails>
          </tir310:Product>
        </tir310:Item>
      </tir310:ReservationItems>
      <tir310:Ticketing RPH="01" TicketTimeLimit="T-31MAR-2FRH*AWT"/>
      <tir310:Ticketing RPH="02" eTicketNumber="TE 5553741251316-RU IVANO/I 2FRH*AWT 2355/31MAR D"/>
      <tir310:Ticketing RPH="03" eTicketNumber="TE 5553741251317-RU IVANO/E 2FRH*AWT 2355/31MAR D"/>
      <tir310:Ticketing RPH="04" eTicketNumber="TE 5553741251318-RU IVANO/A 2FRH*AWT 2355/31MAR D"/>
    </tir310:ItineraryInfo>
    <tir310:ItineraryRef AirExtras="false" ID="YWZYZX" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
      <tir310:Header>PRICE QUOTE RECORD EXISTS - SYSTEM</tir310:Header>
      <tir310:Source AAA_PseudoCityCode="9LSC" CreateDateTime="2020-03-31T15:55" CreationAgent="AWT" HomePseudoCityCode="9LSC" LastUpdateDateTime="2020-03-31T15:55" PseudoCityCode="2FRH" ReceivedFrom="API" SequenceNumber="4"/>
    </tir310:ItineraryRef>
    <tir310:RemarkInfo>
      <tir310:Remark Id="26" RPH="001" Type="General">
        <tir310:Text>TEXT REMARK</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="31" RPH="002" Type="General">
        <tir310:Text>XXAUTH/1234     *Z/AX8431</tir310:Text>
      </tir310:Remark>
      <tir310:Remark Id="38" RPH="003" Type="General">
        <tir310:Text>XXTAW/</tir310:Text>
      </tir310:Remark>
    </tir310:RemarkInfo>
    <tir310:SpecialServiceInfo Id="9" RPH="001" Type="AFX">
      <tir310:Service SSR_Code="OSI">
        <tir310:PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</tir310:PersonName>
        <tir310:Text>AA INF</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="29" RPH="002" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="30" RPH="003" Type="AFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="18" RPH="001" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="19" RPH="002" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="20" RPH="003" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="21" RPH="004" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="DOCS">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="22" RPH="005" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="23" RPH="006" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="INFT">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="24" RPH="007" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCM">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/79851234567/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="25" RPH="008" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="CTCE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1/CUSTOMER//CUSTOMER.COM/RU</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="40" RPH="009" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5553741251316C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="41" RPH="010" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5553741251316C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="42" RPH="011" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5553741251317C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="43" RPH="012" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5553741251317C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="49" RPH="013" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 SVOAER1138Y01SEP/5553741251318C1</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:SpecialServiceInfo Id="50" RPH="014" Type="GFX">
      <tir310:Service SSR_Code="SSR" SSR_Type="TKNE">
        <tir310:Airline Code="SU"/>
        <tir310:PersonName NameNumber="03.01">IVANOV/ANDREY</tir310:PersonName>
        <tir310:Text>HK1 AERSVO1129Y08SEP/5553741251318C2</tir310:Text>
      </tir310:Service>
    </tir310:SpecialServiceInfo>
    <tir310:OpenReservationElements>
      <or110:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or110:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or110:FreeText>INF</or110:FreeText>
          <or110:FullText>AA INF</or110:FullText>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>EKATERINA</or110:FirstName>
          <or110:ReferenceId>4</or110:ReferenceId>
          <or110:NameRefNumber>04.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19 </or110:FreeText>
          <or110:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or110:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19 </or110:FreeText>
          <or110:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-16" id="16"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-or-17" id="17"/>
      <or110:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>1234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>20NOV2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20NOV1980</or110:DateOfBirth>
            <or110:Gender>M</or110:Gender>
            <or110:LastName>IVANOV</or110:LastName>
            <or110:FirstName>IVAN</or110:FirstName>
            <or110:MiddleName>IVANOVICH</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>true</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>2234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>15AUG2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20JAN1980</or110:DateOfBirth>
            <or110:Gender>F</or110:Gender>
            <or110:LastName>IVANOVA</or110:LastName>
            <or110:FirstName>ELENA</or110:FirstName>
            <or110:MiddleName>IVANOVNA</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>3234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>20NOV2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>15JAN2012</or110:DateOfBirth>
            <or110:Gender>M</or110:Gender>
            <or110:LastName>IVANOV</or110:LastName>
            <or110:FirstName>ANDREY</or110:FirstName>
            <or110:MiddleName>IVANOVICH</or110:MiddleName>
            <or110:Infant>false</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FreeText>
          <or110:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or110:FullText>
          <or110:TravelDocument>
            <or110:Type>P</or110:Type>
            <or110:DocumentIssueCountry>RU</or110:DocumentIssueCountry>
            <or110:DocumentNumber>1234567890</or110:DocumentNumber>
            <or110:DocumentNationalityCountry>RU</or110:DocumentNationalityCountry>
            <or110:DocumentExpirationDate>15APR2025</or110:DocumentExpirationDate>
            <or110:DateOfBirth>20FEB2019</or110:DateOfBirth>
            <or110:Gender>FI</or110:Gender>
            <or110:LastName>IVANOVA</or110:LastName>
            <or110:FirstName>EKATERINA</or110:FirstName>
            <or110:MiddleName>IVANOVNA</or110:MiddleName>
            <or110:Infant>true</or110:Infant>
            <or110:PrimaryDocHolderInd>false</or110:PrimaryDocHolderInd>
            <or110:HasDocumentData>true</or110:HasDocumentData>
          </or110:TravelDocument>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or110:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/IVANOVA/EKATERINA/20FEB19</or110:FreeText>
          <or110:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/79851234567/RU</or110:FreeText>
          <or110:FullText>CTCM SU HK1/79851234567/RU</or110:FullText>
          <or110:PassengerContactMobilePhone>
            <or110:PhoneNumber>79851234567</or110:PhoneNumber>
            <or110:Language>RU</or110:Language>
          </or110:PassengerContactMobilePhone>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:Comment>COM/RU</or110:Comment>
          <or110:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or110:FreeText>
          <or110:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or110:FullText>
          <or110:PassengerContactEmail>
            <or110:Email>CUSTOMER@CUSTOMER.COM</or110:Email>
            <or110:Language>RU</or110:Language>
          </or110:PassengerContactEmail>
        </or110:ServiceRequest>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-40" id="40" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251316C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5553741251316C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-41" id="41" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251316C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5553741251316C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-42" id="42" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251317C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5553741251317C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-43" id="43" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251317C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5553741251317C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOVA</or110:LastName>
          <or110:FirstName>ELENA MS</or110:FirstName>
          <or110:ReferenceId>2</or110:ReferenceId>
          <or110:NameRefNumber>02.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-49" id="49" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251318C1</or110:FreeText>
          <or110:FullText>TKNE SU HK1 SVOAER1138Y01SEP/5553741251318C1</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1138</or110:FlightNumber>
            <or110:DepartureDate>2020-09-01</or110:DepartureDate>
            <or110:BoardPoint>SVO</or110:BoardPoint>
            <or110:OffPoint>AER</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-50" id="50" type="SRVC">
        <or110:ServiceRequest actionCode="HK" airlineCode="SU" code="TKNE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or110:FreeText>/5553741251318C2</or110:FreeText>
          <or110:FullText>TKNE SU HK1 AERSVO1129Y08SEP/5553741251318C2</or110:FullText>
        </or110:ServiceRequest>
        <or110:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or110:AirSegment>
            <or110:CarrierCode>SU</or110:CarrierCode>
            <or110:FlightNumber>1129</or110:FlightNumber>
            <or110:DepartureDate>2020-09-08</or110:DepartureDate>
            <or110:BoardPoint>AER</or110:BoardPoint>
            <or110:OffPoint>SVO</or110:OffPoint>
            <or110:ClassOfService>Y</or110:ClassOfService>
          </or110:AirSegment>
        </or110:SegmentAssociation>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>ANDREY</or110:FirstName>
          <or110:ReferenceId>3</or110:ReferenceId>
          <or110:NameRefNumber>03.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or110:Email comment="BC/" type="BC">
          <or110:Address>AGENCY@AGENCY.COM</or110:Address>
        </or110:Email>
      </or110:OpenReservationElement>
      <or110:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or110:Email comment="TO/" type="TO">
          <or110:Address>CUSTOMER@CUSTOMER.COM</or110:Address>
        </or110:Email>
        <or110:NameAssociation>
          <or110:LastName>IVANOV</or110:LastName>
          <or110:FirstName>IVAN MR</or110:FirstName>
          <or110:ReferenceId>1</or110:ReferenceId>
          <or110:NameRefNumber>01.01</or110:NameRefNumber>
        </or110:NameAssociation>
      </or110:OpenReservationElement>
    </tir310:OpenReservationElements>
    <tir310:AssociationMatrices/>
  </tir310:TravelItinerary>
</tir310:TravelItineraryReadRS>
{% endxmlsec %}

### Редактирование бронирования

Текущее открытое бронирование можно изменить. См. [Редактирование бронирований](edit-booking.md), [Оформление билетов и EMD](issue-ticket.md), [Отмена бронирований](cancel-booking.md), [Войдирование билетов и EMD](void-ticket.md), [Вынужденный обмен билетов](involuntary-exchange-ticket.md), а также подразделы ниже.

#### Обработка изменений в расписании (очереди 5 и 6)

При обработке очередей с номером 5 (перевозчик сообщил об изменении расписания, вылет в ближайшие 17 дней) и 6 (перевозчик сообщил об изменении расписания, вылет более чем через 17 дней) рекомендуется [принять изменения в расписании и выполнить вынужденный обмен билетов](involuntary-exchange-ticket.md). 

#### Обработка бронирований с прошедшим тайм-лимитом или статусами сегментов HX (очереди 7, 9 и 10)

При обработке очередей с номерами 7 (статус одного или нескольких сегментов в бронировании изменился на ```HX```), 9 (наступил срок оформления авиабилета, указанный через формат ```7TAW```) и 10 (наступил срок оформления авиабилета, указанный через формат ```7TAX```) возникает необходимость удаления сегментов (снятие мест). Для этого используется сервис [OTA_CancelLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/cancel_itinerary_segments) (см. [Отмена бронирований](cancel-booking.md)).

После удаления сегментов необходимо сохранить изменения в бронировании (см. выше).

#### Обработка бронирований с сообщениями от перевозчиков (очереди 0 и 1)

При обработке очередей 0 (перевозчик прислал сообщение или подтверждение услуги, вылет в течение 24 часов) и 1 (перевозчик прислал сообщение или подтверждение услуги, вылет более чем через 24 часа) можно получить сообщения перевозчика о тайм-лимите. См. [Тайм-лимиты бронирований](timelimit.md).

### Удаление бронирования из очереди (QueueAccessLLSRQ)

Для удаления бронирования из очереди используется сервис [QueueAccessLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/queue/Access_Queue).

В запросе необходимо указать:
- ```/QueueAccessRQ/Navigation/@Action``` — тип операции (значение ```QR```)
- ```/QueueAccessRQ/QueueIdentifier/@PseudoCityCode``` — PCC
- ```/QueueAccessRQ/QueueIdentifier/@Number``` — номер очереди

{% xmlsec "Пример запроса", false %}
<QueueAccessRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Navigation Action="QR"/>
  <QueueIdentifier Number="9" PseudoCityCode="2FRH"/>
</QueueAccessRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<QueueAccessRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2020-04-13T04:24:48-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="1D27F3">QR/2FRH9</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
</QueueAccessRS>
{% endxmlsec %}

## Сохранение бронирования (EnhancedEndTransactionRQ)

Для сохранения изменений в бронировании необходимо отправить запрос к сервису [EnhancedEndTransactionRQ](https://developer.sabre.com/docs/soap_apis/utility/reservation/enhanced_end_transaction). В результате выполнения запроса все изменения в бронировании, выполненные в текущей сессии, будут сохранены, а бронирование закрыто.

В запросе необходимо указать:
- ```/EnhancedEndTransactionRQ/EndTransaction/@Ind``` — признак сохранения бронирования (значение ```true```)
- ```/EnhancedEndTransactionRQ/Source/@ReceivedFrom``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

{% xmlsec "Пример запроса", false %}
<EnhancedEndTransactionRQ version="1.0.0" xmlns="http://services.sabre.com/sp/eet/v1">
  <EndTransaction Ind="true"/>
  <Source ReceivedFrom="API"/>
</EnhancedEndTransactionRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<EnhancedEndTransactionRS xmlns="http://services.sabre.com/sp/eet/v1">
  <ApplicationResults status="Complete" xmlns="http://services.sabre.com/STL_Payload/v02_01" xmlns:ns10="http://services.sabre.com/essm/session/v1" xmlns:ns11="http://services.sabre.com/STL_Header/v02_01" xmlns:ns12="http://webservices.sabre.com/servicesplatform/eiapi/1.0.0" xmlns:ns13="http://services.sabre.com/essm/sharedcache/v1" xmlns:ns14="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns15="http://services.sabre.com/sp/preferences/v1" xmlns:ns16="http://services.sabre.com/STL/v01" xmlns:ns17="http://services.sabre.com/ssse/trace/v01" xmlns:ns2="http://services.sabre.com/essm/diagnostic/v1" xmlns:ns3="http://services.sabre.com/essm/core/v1" xmlns:ns4="http://services.sabre.com/STL_Payload/v02_02" xmlns:ns5="http://opentravel.org/common/message/v02" xmlns:ns6="http://opentravel.org/common/v02" xmlns:ns7="http://services.sabre.com/sp/ssp/v1" xmlns:ns8="http://services.sabre.com/STL_Header/v02_02" xmlns:ns9="http://services.sabre.com/STL_Header/v120">
    <Success timeStamp="2020-04-13T04:24:56.296-05:00"/>
  </ApplicationResults>
  <ItineraryRef ID="YWZYZX">
    <Source CreateDateTime="2020-04-13T04:24"/>
  </ItineraryRef>
  <Text>OK 0424 YWZYZX</Text>
</EnhancedEndTransactionRS>
{% endxmlsec %}
