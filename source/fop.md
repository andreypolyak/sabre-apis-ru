# Выбор форм оплаты

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

В Sabre существует три основных формы оплаты для билетов и EMD:
- наличный расчет (cash)
- безналичный расчет (check)
- банковская карта (credit card)

Также существует возможность использовать одновременно две формы оплаты для одного документа.

При использовании наличного и безналичного расчета агентство самостоятельно получает денежные средства от клиента и передает их перевозчикам при помощи системы взаиморасчетов (BSP или ТКП) или напрямую (в случае наличия прямых договоров с перевозчиками). При использовании формы оплаты банковской картой агентство передает номер карты и другие данные карты через систему бронирования, а авиакомпания списывает средства с карты самостоятельно.

Для успешного оформления билетов или EMD требуется обязательно указать одну или две (см. [Двойная форма оплаты](fop.md#dvoinaya_forma_oplati) ниже) формы оплаты. В Sabre форма оплаты может быть указана в разных местах:
1. в запросе к [сервису оформления билетов и EMD](issue-ticket.md#oformlenie_biletov_i_emd_airticketrq) (указана может быть как форма оплаты, так и ссылка на сохраненную в бронировании форму оплаты)
2. в сохраненном PQ (указана может быть как форма оплаты, так и ссылка на сохраненную в бронировании форму оплаты) — только при оформлении билетов
3. в бронировании (если настройка [Passenger Name Association](tjr-settings.md#passenger_name_association_privyazka_elementov_bronirovaniya_k_passazhiram) **включена**)
4. в виде специальных ремарок в бронировании (если настройка [Passenger Name Association](tjr-settings.md#passenger_name_association_privyazka_elementov_bronirovaniya_k_passazhiram) **выключена**)

Настройка [Passenger Name Association](tjr-settings.md#passenger_name_association_privyazka_elementov_bronirovaniya_k_passazhiram) рекомендуется ко включению, поэтому в данных рекомендациях все примеры приведены с ней.

При [оформлении билетов](issue-ticket.md) система использует следующий алгоритм выбора формы оплаты:
1. если в запросе к сервису оформления билетов указана форма оплаты или ссылка на нее в бронировании, то используется она
2. если в PQ, по которому оформляются билеты, указана форма оплаты или ссылка на нее в бронировании, то используется она
3. банковская карта, указанная первой в списке форм оплаты в бронировании (среди первых четырех форм оплаты)
4. первая форма оплаты в списке форм оплаты в бронировании

Рекомендуется всегда указывать форму оплаты или ссылку на нее в запросе к сервису оформления билетов или в PQ (пп. 1-2 алгоритма).

При [обмене билетов](exchange-ticket.md) форма оплаты обязательно должна быть указана при [сохранении PQR](exchange-ticket.md#sohranenie_maski_rascheta_stoimosti_obmena).

## Оплата банковскими картами

Не все перевозчики разрешают указывать в качестве формы оплаты банковские карты.

Для получения информации о поддержке перевозчиками банковских карт необходимо отправить терминальную команду (в терминале или при помощи сервиса [SabreCommandLLSRQ](commands.md)) вида ```CD*VCL-[код платежной системы]/[код перевозчика]/[код страны]```, где:
- код платежной системы — двухсимвольный код платежной системы или значение ```ALL``` для получения информации о всех платежных системах (не может сочетаться со значением ```ALL``` вместо кода перевозчика). Коды платежных систем доступны в ответе на терминальную команду ```DU*/CCD```. Основные значения:
    - ```BA``` — Visa
    - ```IK``` — Master Card
    - ```AX``` — American Express
- код платежной системы — двухсимвольный код перевозчика или значение ```ALL``` для получения информации о всех перевозчиках (не может сочетаться со значением ```ALL``` вместо кода платежной системы)
- код страны — двухсимвольный код страны, в которой будет производиться оформление билетов

{% xmlsec "Пример команды. Список перевозчиков, которые принимают Visa в России", true %}
CD*VCL-BA/ALL/RU
{% endxmlsec %}

{% xmlsec "Пример ответа. Список перевозчиков, которые принимают Visa в России", false %}
VDR   AIRLINE   COUNTRY                                         
BA    AA         RU                                             
      AB                                                        
      AD                                                        
      AE                                                        
      AF                                                        
      AH                                                        
      AM                                                        
      AO                                                        
      AS                                                        
      AU                                                        
      AV                                                        
      AX                                                        
      AY                                                        
      AZ                                                        
      A3                                                        
      A5                                                        
      BA                                                        
      BE                                                        
      BF                                                        
      BK                                                        
      BP                                                        
      BQ                                                        
      BR                                                        
      BW                                                        
      B7                                                        
      B8                                                        
      B9                                                        
      CA                                                        
      CC                                                        
      CH                                                        
      CL                                                        
      CM                                                        
      CN                                                        
      CP                                                        
      CQ                                                        
      CT                                                        
      CW                                                        
      CX                                                        
      C7                                                        
      C8                                                        
      DA                                                        
      DB                                                        
      DC                                                        
      DD                                                        
      DF                                                        
      DL                                                        
      DM                                                        
      DO                                                        
      DT                                                        
      D6                                                        
      D7                                                        
      D9                                                        
      EH                                                        
      EI                                                        
      EK                                                        
      EM                                                        
      EO                                                        
      ES                                                        
      ET                                                        
      EU                                                        
      EY                                                        
      E0                                                        
      E5                                                        
      FD                                                        
      FE                                                        
      FF                                                        
      FH                                                        
      FI                                                        
      FJ                                                        
      FM                                                        
      FP                                                        
      FR                                                        
      FY                                                        
      FZ                                                        
      F8                                                        
      F9                                                        
      GB                                                        
      GD                                                        
      GF                                                        
      GH                                                        
      GM                                                        
      GN                                                        
      GP                                                        
      GU                                                        
      HB                                                        
      HD                                                        
      HE                                                        
      HH                                                        
      HK                                                        
      HM                                                        
      HP                                                        
      HU                                                        
      HV                                                        
      HX                                                        
      H3                                                        
      H7                                                        
      IB                                                        
      ID                                                        
      IE                                                        
      IG                                                        
      II                                                        
      IJ                                                        
      IK                                                        
      IM                                                        
      IO                                                        
      IP                                                        
      IQ                                                        
      IU                                                        
      IW                                                        
      IY                                                        
      I0                                                        
      I7                                                        
      I9                                                        
      JD                                                        
      JF                                                        
      JI                                                        
      JL                                                        
      JM                                                        
      JR                                                        
      JT                                                        
      JU                                                        
      JV                                                        
      J2                                                        
      J5                                                        
      KA                                                        
      KC                                                        
      KE                                                        
      KF                                                        
      KK                                                        
      KL                                                        
      KM                                                        
      KN                                                        
      KP                                                        
      KQ                                                        
      KS                                                        
      KU                                                        
      KW                                                        
      KX                                                        
      K0                                                        
      K9                                                        
      LB                                                        
      LG                                                        
      LH                                                        
      LI                                                        
      LK                                                        
      LO                                                        
      LP                                                        
      LR                                                        
      LU                                                        
      LX                                                        
      LZ                                                        
      L3                                                        
      L6                                                        
      ME                                                        
      MG                                                        
      MH                                                        
      MI                                                        
      MK                                                        
      MM                                                        
      MN                                                        
      MP                                                        
      MQ                                                        
      MS                                                        
      MU                                                        
      MX                                                        
      MY                                                        
      M3                                                        
      M5                                                        
      NA                                                        
      NF                                                        
      NK                                                        
      NL                                                        
      NN                                                        
      NO                                                        
      NR                                                        
      NS                                                        
      NV                                                        
      NW                                                        
      N0                                                        
      N1                                                        
      N7                                                        
      OA                                                        
      OD                                                        
      OE                                                        
      OH                                                        
      OI                                                        
      OJ                                                        
      OK                                                        
      OQ                                                        
      OS                                                        
      OT                                                        
      OV                                                        
      O0                                                        
      O7                                                        
      PB                                                        
      PC                                                        
      PE                                                        
      PG                                                        
      PK                                                        
      PL                                                        
      PQ                                                        
      PS                                                        
      PW                                                        
      PZ                                                        
      P5                                                        
      QQ                                                        
      QR                                                        
      QZ                                                        
      Q0                                                        
      Q7                                                        
      RH                                                        
      RL                                                        
      RU                                                        
      R0                                                        
      R6                                                        
      R7                                                        
      SA                                                        
      SG                                                        
      SH                                                        
      SI                                                        
      SK                                                        
      SL                                                        
      SN                                                        
      SO                                                        
      SQ                                                        
      SR                                                        
      SS                                                        
      ST                                                        
      SV                                                        
      SY                                                        
      TA                                                        
      TB                                                        
      TF                                                        
      TG                                                        
      TI                                                        
      TJ                                                        
      TK                                                        
      TL                                                        
      TP                                                        
      TQ                                                        
      TS                                                        
      TU                                                        
      TV                                                        
      TW                                                        
      TX                                                        
      TY                                                        
      T8                                                        
      UA                                                        
      UC                                                        
      UE                                                        
      UF                                                        
      UI                                                        
      UM                                                        
      UN                                                        
      UP                                                        
      UV                                                        
      UW                                                        
      UX                                                        
      UY                                                        
      UZ                                                        
      U0                                                        
      U4                                                        
      U6                                                        
      VC                                                        
      VD                                                        
      VF                                                        
      VH                                                        
      VJ                                                        
      VM                                                        
      VN                                                        
      VO                                                        
      VP                                                        
      VV                                                        
      VW                                                        
      VX                                                        
      VZ                                                        
      V8                                                        
      WA                                                        
      WD                                                        
      WF                                                        
      WG                                                        
      WH                                                        
      WI                                                        
      WJ                                                        
      WK                                                        
      WN                                                        
      WO                                                        
      WQ                                                        
      WS                                                        
      WY                                                        
      W0                                                        
      W2                                                        
      W7                                                        
      XE                                                        
      XF                                                        
      XL                                                        
      XM                                                        
      XN                                                        
      X5                                                        
      X6                                                        
      YC                                                        
      YE                                                        
      YH                                                        
      YK                                                        
      YN                                                        
      YR                                                        
      YS                                                        
      YW                                                        
      Y4                                                        
      Y8                                                        
      ZI                                                        
      ZL                                                        
      ZN                                                        
      ZO                                                        
      ZQ                                                        
      ZV                                                        
      ZW                                                        
      0G                                                        
      0J                                                        
      0L                                                        
      0X                                                        
      0Y                                                        
      1I                                                        
      2E                                                        
      2J                                                        
      2P                                                        
      2R                                                        
      2S                                                        
      2T                                                        
      2V                                                        
      3C                                                        
      3D                                                        
      3H                                                        
      3M                                                        
      4C                                                        
      4K                                                        
      4M                                                        
      4R                                                        
      4S                                                        
      4W                                                        
      4X                                                        
      5C                                                        
      5F                                                        
      5T                                                        
      5V                                                        
      5W                                                        
      6A                                                        
      6F                                                        
      6J                                                        
      6M                                                        
      6R                                                        
      6S                                                        
      6U                                                        
      6W                                                        
      6Y                                                        
      7F                                                        
      7H                                                        
      7L                                                        
      7O                                                        
      7P                                                        
      7Q                                                        
      7S                                                        
      7V                                                        
      7W                                                        
      8B                                                        
      8D                                                        
      8E                                                        
      8G                                                        
      8K                                                        
      8O                                                        
      8P                                                        
      8Q                                                        
      8V                                                        
      8Z                                                        
      80                                                        
      9K                                                        
      9M                                                        
      9N                                                        
      9P                                                        
      9U                                                        
      9W                                                        
{% endxmlsec %}

{% xmlsec "Пример команды. Список платежных систем, которые принимает Etihad в России", true %}
CD*VCL-ALL/EY/RU
{% endxmlsec %}

{% xmlsec "Пример ответа. Список платежных систем, которые принимает Etihad в России", false %}
VDR   AIRLINE   COUNTRY                                         
AX    EY         RU                                             
BA                                                              
CB                                                              
DC                                                              
DS                                                              
IK                                                              
JB                                                              
L1                                                              
L2                                                              
PP                                                              
TP                                                              
{% endxmlsec %}

В Sabre существует два способа указать банковскую карту:
- передать данные карты и код авторизации, полученный агентство самостоятельно (на собственном сайте или через платежный шлюз)
- передать данные карты без кода авторизации и получить его автоматически в момент оформления билета или EMD

## Двойная форма оплаты

При оформлении билетов в Sabre можно указать две форма оплаты при соблюдении следующих ограничений:
- оформляется билет, а не EMD
- билет оформляется не в обмен
- включена настройка [Two Forms of Payment](tjr-settings.md#two_forms_of_payment_oformlenie_biletov_s_dvumya_formami_oplati)
- общая сумма такс не превышает величину тарифа
- величина второй формы оплаты не может превышать величину тарифа

## Выбор формы оплаты при оформлении билетов и EMD (AirTicketRQ)

См. раздел [Оформление билетов и EMD](issue-ticket.md#vibor_form_oplati).

## Выбор формы оплаты при создании бронирования (CreatePassengerNameRecordRQ, EnhancedAirBookRQ)

См. раздел [Создание бронирований в 1 шаг](create-booking-1step.md#vibor_form_oplati) для сервиса [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record).

См. раздел [Создание бронирований в 2 шага](create-booking-2steps.md#vibor_form_oplati) для сервиса [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking).

## Выбор формы оплаты при расчете стоимости (OTA_AirPriceLLSRQ)

При использовании сервиса [OTA_AirPriceLLSRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/price_air_itinerary) форма оплаты указывается в элементе ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers``` по аналогии с заполнением элемента ```/CreatePassengerNameRecordRQ/AirPrice/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers``` в запросе к сервису [CreatePassengerNameRecordRQ](https://developer.sabre.com/docs/read/soap_apis/air/book/create_passenger_name_record) (см. [Создание бронирований в 1 шаг](create-booking-1step.md#vibor_form_oplati)) и элемента ```/EnhancedAirBookRQ/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers``` в запросе к сервису [EnhancedAirBookRQ](https://developer.sabre.com/docs/soap_apis/air/book/orchestrated_air_booking) (см. [Создание бронирований в 2 шага](create-booking-2steps.md#raschet_stoimosti)).

Также в запросе можно указать ссылки на сохраненные в бронировании формы оплаты:
- для одной формы оплаты указывается ее порядковый номер в качестве значения атрибута ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BasicFOP/@Reference```
- для двух форм оплаты указывается:
    - порядковый номер первой формы оплаты в качестве значения атрибута ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_One/@Reference```
    - порядковый номер второй формы оплаты в качестве значения атрибута ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/FOP_Two/@Reference```
    - сумма, которая будет списана со второй формы оплаты в качестве значения атрибута ```/OTA_AirPriceRQ/PriceRequestInformation/OptionalQualifiers/FOP_Qualifiers/BSP_Ticketing/MultipleFOP/Fare/@Amount```

## Добавление форм оплаты в бронирования (UpdateReservationRQ)

*Для добавления форм оплаты в бронированиях в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для добавления формы оплаты в бронирование используется сервис [UpdateReservationRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/update_itinerary).

В запросе необходимо указать:
- ```/UpdateReservationRQ/RequestType``` — тип запроса. Всегда значение ```Stateless```
- ```/UpdateReservationRQ/ReturnOptions/@IncludeUpdateDetails``` — признак получения деталей изменения бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReturnOptions/@RetrievePNR``` — признак получения состояния бронирования в ответе. Всегда значение ```true```
- ```/UpdateReservationRQ/ReservationUpdateList/Locator``` — код бронирования
- ```/UpdateReservationRQ/ReservationUpdateList/ReceivedFrom/AgentName``` — значения поля Received From. Используется для идентификации инициатора изменений в истории бронирования

Каждая добавляемая форма оплаты должна быть указана в отдельном элементе ```/UpdateReservationRQ/ReservationUpdateList/ReservationUpdateItem```.

Ниже указаны требования к заполнению запроса для каждой из форм оплаты:

#### Наличный расчет

- ```ReservationUpdateItem/OpenReservationElementUpdate/@op``` — код типа операции. Всегда значение ```C``` (Create, создание)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement``` — код добавляемого элемента. Всегда значение ```FP``` (Form of Payment, форма оплаты)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement/or:FormOfPayment/or:Cash/or:Text``` — значение ```CA```

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:or="http://services.sabre.com/res/or/v1_14">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>BOMALP</Locator>
    <ReservationUpdateItem>
      <OpenReservationElementUpdate op="C">
        <OpenReservationElement type="FP">
          <or:FormOfPayment>
            <or:Cash>
              <or:Custom>CASH</or:Custom>
            </or:Cash>
          </or:FormOfPayment>
        </OpenReservationElement>
      </OpenReservationElementUpdate>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>BOMALP</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-04-16T07:05:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-04-16T07:05:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-04-16T07:05:39</stl19:UpdateTimestamp>
      <stl19:PNRSequence>3</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T05:20:00" Start="2020-09-01T07:45:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-09-08T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-14a6d420a8e47cde731ac0df54cd5e3259bf05b78960d930</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="24" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCM SU HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="25" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="18" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="21" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="19" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="20" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>SVO</stl19:Airport>
          <stl19:Departure>2020-09-01T07:45:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AER</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1138</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1138</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*VVTPVA</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T07:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T10:15:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1138</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:05:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AER</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>SVO</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1129</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1129</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*VVTPVA</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T05:20:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1129</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:05:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:FutureTicketing elementId="pnr-11" id="11" index="1">
          <stl19:Code>TAW</stl19:Code>
        </stl19:FutureTicketing>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-26" id="26" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>TEXT REMARK</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
      <stl19:Remark elementId="pnr-32" id="32" index="2" type="FOP">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>CASH</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement displayIndex="1" elementId="pnr-or-5" id="5" type="FP">
        <or114:FormOfPayment migrated="false">
          <or114:Cash>
            <or114:Custom>CASH</or114:Custom>
          </or114:Cash>
        </or114:FormOfPayment>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM SU HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="32" op="C"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}

#### Безналичный расчет

- ```ReservationUpdateItem/OpenReservationElementUpdate/@op``` — код типа операции. Всегда значение ```C``` (Create, создание)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement``` — код добавляемого элемента. Всегда значение ```FP``` (Form of Payment, форма оплаты)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement/or:FormOfPayment/or:Check/or:Text``` — значение ```CK```

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:or="http://services.sabre.com/res/or/v1_14">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>VVURXG</Locator>
    <ReservationUpdateItem>
      <OpenReservationElementUpdate op="C">
        <OpenReservationElement type="FP">
          <or:FormOfPayment>
            <or:Check>
              <or:Custom>CHECK</or:Custom>
            </or:Check>
          </or:FormOfPayment>
        </OpenReservationElement>
      </OpenReservationElementUpdate>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>VVURXG</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-04-16T07:06:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-04-16T07:06:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-04-16T07:06:28</stl19:UpdateTimestamp>
      <stl19:PNRSequence>3</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T05:20:00" Start="2020-09-01T07:45:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-09-08T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-14a6d420a8e47cdec946c33208fb92110308233916981ae7</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="24" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCM SU HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="25" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="18" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="21" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="19" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="20" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>SVO</stl19:Airport>
          <stl19:Departure>2020-09-01T07:45:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AER</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1138</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1138</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNUBJL</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T07:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T10:15:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1138</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:06:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AER</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>SVO</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1129</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1129</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNUBJL</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T05:20:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1129</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:06:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:FutureTicketing elementId="pnr-11" id="11" index="1">
          <stl19:Code>TAW</stl19:Code>
        </stl19:FutureTicketing>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-26" id="26" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>TEXT REMARK</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
      <stl19:Remark elementId="pnr-32" id="32" index="2" type="FOP">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>CHECK</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement displayIndex="1" elementId="pnr-or-5" id="5" type="FP">
        <or114:FormOfPayment migrated="false">
          <or114:Check>
            <or114:Custom>CHECK</or114:Custom>
          </or114:Check>
        </or114:FormOfPayment>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM SU HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="32" op="C"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}

#### Банковская карта

- ```ReservationUpdateItem/OpenReservationElementUpdate/@op``` — код типа операции. Всегда значение ```C``` (Create, создание)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement``` — код добавляемого элемента. Всегда значение ```FP``` (Form of Payment, форма оплаты)
- ```ReservationUpdateItem/OpenReservationElementUpdate/OpenReservationElement/or:FormOfPayment/or:PaymentCard``` — данные банковской карты:
    - ```or:PaymentCard/or:PaymentType``` — значение ```CC```
    - ```or:PaymentCard/or:CardCode``` — код платежной системы
    - ```or:PaymentCard/or:CardNumber``` — номер карты
    - ```or:PaymentCard/or:ExpiryMonth``` — месяц срока истечения действия карты (формат ```--MM```)
    - ```or:PaymentCard/or:ExpiryYear``` — год срока истечения действия карты (формат ```YY```)

Список кодов основных платежных систем:
- ```VI``` — Visa
- ```CA``` — Master Card
- ```AX``` — American Express

Если необходимо передать уже полученный код авторизации, то в запросе дополнительно нужно указать элемент ```or:PaymentCard/or:ApprovalList/or:Approval```:
- ```or:Approval/or:ManualApproval``` — индикатор использования переданного кода авторизации (значение ```true```)
- ```or:Approval/or:ResponseCode``` — код ответа при получении кода авторизации
- ```or:Approval/or:ApprovalCode``` — код авторизации
- ```or:Approval/or:RequestTime``` — дата и время получения кода авторизации
- ```or:Approval/or:ExpiryTime``` — дата и время окончания срока действия кода авторизации
- ```or:Approval/or:AirlineCode``` — код валидирующего перевозчика, которому будет передан код авторизации
- ```or:Approval/or:Amount/@currencyCode``` — трехбуквенный код валюты
- ```or:Approval/or:Amount``` — сумма, для которой был получен код авторизации

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:or="http://services.sabre.com/res/or/v1_14">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>BOMFID</Locator>
    <ReservationUpdateItem>
      <OpenReservationElementUpdate op="C">
        <OpenReservationElement type="FP">
          <or:FormOfPayment>
            <or:PaymentCard>
              <or:PaymentType>CC</or:PaymentType>
              <or:CardCode>AX</or:CardCode>
              <or:CardNumber>371449635398431</or:CardNumber>
              <or:ExpiryMonth>--12</or:ExpiryMonth>
              <or:ExpiryYear>2020</or:ExpiryYear>
              <or:ApprovalList>
                <or:Approval>
                  <or:ManualApproval>true</or:ManualApproval>
                  <or:ResponseCode>0</or:ResponseCode>
                  <or:ApprovalCode>123456</or:ApprovalCode>
                  <or:RequestTime>2020-04-16T12:00:00</or:RequestTime>
                  <or:ExpiryTime>2020-04-17T12:00:00</or:ExpiryTime>
                  <or:AirlineCode>SU</or:AirlineCode>
                  <or:Amount>500000</or:Amount>
                </or:Approval>
              </or:ApprovalList>
            </or:PaymentCard>
          </or:FormOfPayment>
        </OpenReservationElement>
      </OpenReservationElementUpdate>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>BOMFID</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-04-16T07:06:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-04-16T07:06:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-04-16T07:07:02</stl19:UpdateTimestamp>
      <stl19:PNRSequence>3</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T05:20:00" Start="2020-09-01T07:45:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-09-08T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-14a6d420a8e47cdea44c58d6288131ebb5926402a22a13e1</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="24" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCM SU HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="25" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="18" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="21" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="19" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="20" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>SVO</stl19:Airport>
          <stl19:Departure>2020-09-01T07:45:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AER</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1138</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1138</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*BOMGRE</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T07:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T10:15:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1138</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:06:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AER</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>SVO</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1129</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1129</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*BOMGRE</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T05:20:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1129</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:06:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:FutureTicketing elementId="pnr-11" id="11" index="1">
          <stl19:Code>TAW</stl19:Code>
        </stl19:FutureTicketing>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-26" id="26" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>TEXT REMARK</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
      <stl19:Remark elementId="pnr-32" id="32" index="2" type="FOP">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>AX3XXXXXXXXXX8431¥12/20</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement displayIndex="1" elementId="pnr-or-5" id="5" type="FP">
        <or114:FormOfPayment migrated="false">
          <or114:PaymentCard>
            <or114:PaymentType>CC</or114:PaymentType>
            <or114:CardCode>AX</or114:CardCode>
            <or114:CardNumber masked="true" tokenized="true">3XXXXXXXXXX8431</or114:CardNumber>
            <or114:ExpiryMonth>--12</or114:ExpiryMonth>
            <or114:ExpiryYear>2020</or114:ExpiryYear>
            <or114:ApprovalList>
              <or114:Approval id="1">
                <or114:ManualApproval>true</or114:ManualApproval>
                <or114:ResponseCode>0</or114:ResponseCode>
                <or114:ApprovalCode>123456</or114:ApprovalCode>
                <or114:RequestTime>2020-04-16T12:00:00</or114:RequestTime>
                <or114:ExpiryTime>2020-04-17T12:00:00</or114:ExpiryTime>
                <or114:AirlineCode>SU</or114:AirlineCode>
                <or114:Amount>500000</or114:Amount>
                <or114:Acquirer>Unknown</or114:Acquirer>
              </or114:Approval>
            </or114:ApprovalList>
          </or114:PaymentCard>
        </or114:FormOfPayment>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM SU HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="32" op="C"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}

Если код авторизации необходимо получить в момент оформления билетов или EMD, то в запросе дополнительно нужно указать элемент ```or:PaymentCard/or:GenerateApprovalAtTicketing``` со значением ```true```.

{% xmlsec "Пример запроса", false %}
<UpdateReservationRQ Version="1.19.0" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" xmlns:or="http://services.sabre.com/res/or/v1_14">
  <RequestType commitTransaction="true" initialIgnore="true">Stateless</RequestType>
  <ReturnOptions IncludeUpdateDetails="true" RetrievePNR="true"/>
  <ReservationUpdateList>
    <Locator>FNUEET</Locator>
    <ReservationUpdateItem>
      <OpenReservationElementUpdate op="C">
        <OpenReservationElement type="FP">
          <or:FormOfPayment>
            <or:PaymentCard>
              <or:PaymentType>CC</or:PaymentType>
              <or:CardCode>AX</or:CardCode>
              <or:CardNumber>371449635398431</or:CardNumber>
              <or:ExpiryMonth>--12</or:ExpiryMonth>
              <or:ExpiryYear>2020</or:ExpiryYear>
              <or:GenerateApprovalAtTicketing>true</or:GenerateApprovalAtTicketing>
            </or:PaymentCard>
          </or:FormOfPayment>
        </OpenReservationElement>
      </OpenReservationElementUpdate>
    </ReservationUpdateItem>
    <ReceivedFrom>
      <AgentName>API</AgentName>
    </ReceivedFrom>
  </ReservationUpdateList>
</UpdateReservationRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<stl19:UpdateReservationRS Version="1.19.0" xmlns:ns4="http://webservices.sabre.com/pnrconn/ReaccSearch" xmlns:ns6="http://services.sabre.com/res/orr/v0" xmlns:or114="http://services.sabre.com/res/or/v1_14" xmlns:raw="http://tds.sabre.com/itinerary" xmlns:stl19="http://webservices.sabre.com/pnrbuilder/v1_19">
  <stl19:Success>OK</stl19:Success>
  <stl19:Reservation NumberInSegment="3" numberInParty="4" numberOfInfants="1">
    <stl19:BookingDetails>
      <stl19:RecordLocator>FNUEET</stl19:RecordLocator>
      <stl19:CreationTimestamp>2020-04-16T07:07:00</stl19:CreationTimestamp>
      <stl19:SystemCreationTimestamp>2020-04-16T07:07:00</stl19:SystemCreationTimestamp>
      <stl19:CreationAgentID>AWT</stl19:CreationAgentID>
      <stl19:UpdateTimestamp>2020-04-16T07:07:40</stl19:UpdateTimestamp>
      <stl19:PNRSequence>3</stl19:PNRSequence>
      <stl19:FlightsRange End="2020-09-08T05:20:00" Start="2020-09-01T07:45:00"/>
      <stl19:DivideSplitDetails/>
      <stl19:EstimatedPurgeTimestamp>2020-09-08T00:00:00</stl19:EstimatedPurgeTimestamp>
      <stl19:UpdateToken>-14a6d420a8e47cdecf8089a110ac163502a92621a87e63c5</stl19:UpdateToken>
    </stl19:BookingDetails>
    <stl19:POS AirExtras="false" InhibitCode="U">
      <stl19:Source AgentDutyCode="*" AgentSine="AWT" AirlineVendorID="AA" BookingSource="2FRH" HomePseudoCityCode="9LSC" ISOCountry="RU" PrimeHostID="1S" PseudoCityCode="2FRH"/>
    </stl19:POS>
    <stl19:PassengerReservation>
      <stl19:Passengers>
        <stl19:Passenger elementId="pnr-2.1" id="2" nameAssocId="1" nameId="01.01" nameType="S" passengerType="ADT" withInfant="true">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>IVAN MR</stl19:FirstName>
          <stl19:EmailAddress id="12">
            <stl19:Address>CUSTOMER@CUSTOMER.COM</stl19:Address>
            <stl19:Comment>TO/</stl19:Comment>
          </stl19:EmailAddress>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>NN</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="24" msgType="S" type="G">
              <stl19:Code>CTCM</stl19:Code>
              <stl19:FreeText>/79851234567/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCM SU HK1/79851234567/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="25" msgType="S" type="G">
              <stl19:Code>CTCE</stl19:Code>
              <stl19:FreeText>/CUSTOMER//CUSTOMER.COM/RU</stl19:FreeText>
              <stl19:ActionCode>HK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
              <stl19:Code>INFT</stl19:Code>
              <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
              <stl19:ActionCode>KK</stl19:ActionCode>
              <stl19:NumberInParty>1</stl19:NumberInParty>
              <stl19:AirlineCode>SU</stl19:AirlineCode>
              <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
            </stl19:GenericSpecialRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="18" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-11-20</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>IVAN</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>true</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="21" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>1234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2019-02-20</stl19:DateOfBirth>
                <stl19:Gender>FI</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-04-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>EKATERINA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-4.2" id="4" nameAssocId="2" nameId="02.01" nameType="S" passengerType="ADT">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>ELENA MS</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="19" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>2234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>1980-01-20</stl19:DateOfBirth>
                <stl19:Gender>F</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-08-15</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOVA</stl19:Surname>
                <stl19:Forename>ELENA</stl19:Forename>
                <stl19:MiddleName>IVANOVNA</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-6.3" id="6" nameAssocId="3" nameId="03.01" nameType="S" passengerType="CNN">
          <stl19:LastName>IVANOV</stl19:LastName>
          <stl19:FirstName>ANDREY</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:APISRequest>
              <stl19:DOCSEntry id="20" type="G">
                <stl19:DocumentType>P</stl19:DocumentType>
                <stl19:CountryOfIssue>RU</stl19:CountryOfIssue>
                <stl19:DocumentNumber>3234567890</stl19:DocumentNumber>
                <stl19:DocumentNationalityCountry>RU</stl19:DocumentNationalityCountry>
                <stl19:DateOfBirth>2012-01-15</stl19:DateOfBirth>
                <stl19:Gender>M</stl19:Gender>
                <stl19:DocumentExpirationDate>2025-11-20</stl19:DocumentExpirationDate>
                <stl19:Surname>IVANOV</stl19:Surname>
                <stl19:Forename>ANDREY</stl19:Forename>
                <stl19:MiddleName>IVANOVICH</stl19:MiddleName>
                <stl19:PrimaryHolder>false</stl19:PrimaryHolder>
                <stl19:FreeText/>
                <stl19:ActionCode>HK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:VendorCode>SU</stl19:VendorCode>
              </stl19:DOCSEntry>
            </stl19:APISRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
        <stl19:Passenger elementId="pnr-8.4" id="8" nameAssocId="4" nameId="04.01" nameType="I" passengerType="INF">
          <stl19:LastName>IVANOVA</stl19:LastName>
          <stl19:FirstName>EKATERINA</stl19:FirstName>
          <stl19:SpecialRequests>
            <stl19:GenericSpecialRequest id="9" msgType="O" type="A">
              <stl19:FreeText>INF</stl19:FreeText>
              <stl19:AirlineCode>AA</stl19:AirlineCode>
              <stl19:FullText>AA INF</stl19:FullText>
            </stl19:GenericSpecialRequest>
          </stl19:SpecialRequests>
          <stl19:Seats/>
        </stl19:Passenger>
      </stl19:Passengers>
      <stl19:Segments>
        <stl19:Poc>
          <stl19:Airport>SVO</stl19:Airport>
          <stl19:Departure>2020-09-01T07:45:00</stl19:Departure>
        </stl19:Poc>
        <stl19:Segment id="16" sequence="1">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="16" isPast="false" segmentAssociationId="2" sequence="1">
            <stl19:DepartureAirport>SVO</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>AER</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1138</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1138</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNUENU</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-01T07:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-01T10:15:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1138</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="22" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="29" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:07:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
        <stl19:Segment id="17" sequence="2">
          <stl19:Air CodeShare="false" DayOfWeekInd="2" ResBookDesigCode="Y" SmokingAllowed="false" SpecialMeal="false" id="17" isPast="false" segmentAssociationId="3" sequence="2">
            <stl19:DepartureAirport>AER</stl19:DepartureAirport>
            <stl19:DepartureAirportCodeContext>IATA</stl19:DepartureAirportCodeContext>
            <stl19:ArrivalAirport>SVO</stl19:ArrivalAirport>
            <stl19:ArrivalAirportCodeContext>IATA</stl19:ArrivalAirportCodeContext>
            <stl19:OperatingAirlineCode>SU</stl19:OperatingAirlineCode>
            <stl19:OperatingAirlineShortName>AEROFLOT</stl19:OperatingAirlineShortName>
            <stl19:OperatingFlightNumber>1129</stl19:OperatingFlightNumber>
            <stl19:EquipmentType>73H</stl19:EquipmentType>
            <stl19:MarketingAirlineCode>SU</stl19:MarketingAirlineCode>
            <stl19:MarketingFlightNumber>1129</stl19:MarketingFlightNumber>
            <stl19:OperatingClassOfService>Y</stl19:OperatingClassOfService>
            <stl19:MarketingClassOfService>Y</stl19:MarketingClassOfService>
            <stl19:MarriageGrp>
              <stl19:Ind>0</stl19:Ind>
              <stl19:Group>0</stl19:Group>
              <stl19:Sequence>0</stl19:Sequence>
            </stl19:MarriageGrp>
            <stl19:Seats/>
            <stl19:AirlineRefId>DCSU*FNUENU</stl19:AirlineRefId>
            <stl19:Eticket>true</stl19:Eticket>
            <stl19:DepartureDateTime>2020-09-08T02:45:00</stl19:DepartureDateTime>
            <stl19:ArrivalDateTime>2020-09-08T05:20:00</stl19:ArrivalDateTime>
            <stl19:FlightNumber>1129</stl19:FlightNumber>
            <stl19:ClassOfService>Y</stl19:ClassOfService>
            <stl19:ActionCode>HK</stl19:ActionCode>
            <stl19:NumberInParty>3</stl19:NumberInParty>
            <stl19:SegmentSpecialRequests>
              <stl19:GenericSpecialRequest id="23" msgType="S" type="G">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>NN</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
              <stl19:GenericSpecialRequest id="30" msgType="S" type="A">
                <stl19:Code>INFT</stl19:Code>
                <stl19:FreeText>/IVANOVA/EKATERINA/20FEB19</stl19:FreeText>
                <stl19:ActionCode>KK</stl19:ActionCode>
                <stl19:NumberInParty>1</stl19:NumberInParty>
                <stl19:AirlineCode>SU</stl19:AirlineCode>
                <stl19:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</stl19:FullText>
              </stl19:GenericSpecialRequest>
            </stl19:SegmentSpecialRequests>
            <stl19:inboundConnection>false</stl19:inboundConnection>
            <stl19:outboundConnection>false</stl19:outboundConnection>
            <stl19:ScheduleChangeIndicator>false</stl19:ScheduleChangeIndicator>
            <stl19:SegmentBookedDate>2020-04-16T07:07:00</stl19:SegmentBookedDate>
            <stl19:Banner>MARKETED BY AEROFLOT</stl19:Banner>
            <stl19:Informational>false</stl19:Informational>
          </stl19:Air>
        </stl19:Segment>
      </stl19:Segments>
      <stl19:TicketingInfo>
        <stl19:FutureTicketing elementId="pnr-11" id="11" index="1">
          <stl19:Code>TAW</stl19:Code>
        </stl19:FutureTicketing>
      </stl19:TicketingInfo>
      <stl19:ItineraryPricing/>
    </stl19:PassengerReservation>
    <stl19:ReceivedFrom>
      <stl19:Name>API</stl19:Name>
    </stl19:ReceivedFrom>
    <stl19:PhoneNumbers>
      <stl19:PhoneNumber elementId="pnr-14" id="14" index="1">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>74991234567-A</stl19:Number>
      </stl19:PhoneNumber>
      <stl19:PhoneNumber elementId="pnr-15" id="15" index="2">
        <stl19:CityCode>MOW</stl19:CityCode>
        <stl19:Number>79851234567-M</stl19:Number>
      </stl19:PhoneNumber>
    </stl19:PhoneNumbers>
    <stl19:Remarks>
      <stl19:Remark elementId="pnr-26" id="26" index="1" type="REG">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>TEXT REMARK</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
      <stl19:Remark elementId="pnr-32" id="32" index="2" type="FOP">
        <stl19:RemarkLines>
          <stl19:RemarkLine>
            <stl19:Text>*AX3XXXXXXXXXX8431¥12/20</stl19:Text>
          </stl19:RemarkLine>
        </stl19:RemarkLines>
      </stl19:Remark>
    </stl19:Remarks>
    <stl19:EmailAddresses>
      <stl19:EmailAddress id="13">
        <stl19:Address>AGENCY@AGENCY.COM</stl19:Address>
        <stl19:Comment>BC/</stl19:Comment>
      </stl19:EmailAddress>
    </stl19:EmailAddresses>
    <stl19:OpenReservationElements>
      <or114:OpenReservationElement displayIndex="1" elementId="pnr-or-5" id="5" type="FP">
        <or114:FormOfPayment migrated="false">
          <or114:PaymentCard>
            <or114:PaymentType>CC</or114:PaymentType>
            <or114:CardCode>AX</or114:CardCode>
            <or114:CardNumber masked="true" tokenized="true">3XXXXXXXXXX8431</or114:CardNumber>
            <or114:ExpiryMonth>--12</or114:ExpiryMonth>
            <or114:ExpiryYear>2020</or114:ExpiryYear>
            <or114:GenerateApprovalAtTicketing>true</or114:GenerateApprovalAtTicketing>
          </or114:PaymentCard>
        </or114:FormOfPayment>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-9" id="9" type="SRVC">
        <or114:ServiceRequest airlineCode="AA" serviceType="OSI" ssrType="AFX">
          <or114:FreeText>INF</or114:FreeText>
          <or114:FullText>AA INF</or114:FullText>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>EKATERINA</or114:FirstName>
          <or114:ReferenceId>4</or114:ReferenceId>
          <or114:NameRefNumber>04.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-29" id="29" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-30" id="30" type="SRVC">
        <or114:ServiceRequest actionCode="KK" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="AFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19 </or114:FreeText>
          <or114:FullText>INFT SU KK1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19 </or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-18" id="18" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2025/IVANOV/IVAN/IVANOVICH/H</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20NOV1980</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>IVAN</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>true</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-19" id="19" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2025/IVANOVA/ELENA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>2234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15AUG2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20JAN1980</or114:DateOfBirth>
            <or114:Gender>F</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>ELENA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOVA</or114:LastName>
          <or114:FirstName>ELENA MS</or114:FirstName>
          <or114:ReferenceId>2</or114:ReferenceId>
          <or114:NameRefNumber>02.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-20" id="20" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/3234567890/RU/15JAN2012/M/20NOV2025/IVANOV/ANDREY/IVANOVICH</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>3234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>20NOV2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>15JAN2012</or114:DateOfBirth>
            <or114:Gender>M</or114:Gender>
            <or114:LastName>IVANOV</or114:LastName>
            <or114:FirstName>ANDREY</or114:FirstName>
            <or114:MiddleName>IVANOVICH</or114:MiddleName>
            <or114:Infant>false</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>ANDREY</or114:FirstName>
          <or114:ReferenceId>3</or114:ReferenceId>
          <or114:NameRefNumber>03.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-21" id="21" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="DOCS" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FreeText>
          <or114:FullText>DOCS SU HK1/P/RU/1234567890/RU/20FEB2019/FI/15APR2025/IVANOVA/EKATERINA/IVANOVNA</or114:FullText>
          <or114:TravelDocument>
            <or114:Type>P</or114:Type>
            <or114:DocumentIssueCountry>RU</or114:DocumentIssueCountry>
            <or114:DocumentNumber>1234567890</or114:DocumentNumber>
            <or114:DocumentNationalityCountry>RU</or114:DocumentNationalityCountry>
            <or114:DocumentExpirationDate>15APR2025</or114:DocumentExpirationDate>
            <or114:DateOfBirth>20FEB2019</or114:DateOfBirth>
            <or114:Gender>FI</or114:Gender>
            <or114:LastName>IVANOVA</or114:LastName>
            <or114:FirstName>EKATERINA</or114:FirstName>
            <or114:MiddleName>IVANOVNA</or114:MiddleName>
            <or114:Infant>true</or114:Infant>
            <or114:PrimaryDocHolderInd>false</or114:PrimaryDocHolderInd>
            <or114:HasDocumentData>true</or114:HasDocumentData>
          </or114:TravelDocument>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-22" id="22" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="16" SegmentAssociationId="2">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1138</or114:FlightNumber>
            <or114:DepartureDate>2020-09-01</or114:DepartureDate>
            <or114:BoardPoint>SVO</or114:BoardPoint>
            <or114:OffPoint>AER</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-23" id="23" type="SRVC">
        <or114:ServiceRequest actionCode="NN" airlineCode="SU" code="INFT" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/IVANOVA/EKATERINA/20FEB19</or114:FreeText>
          <or114:FullText>INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB19</or114:FullText>
        </or114:ServiceRequest>
        <or114:SegmentAssociation Id="17" SegmentAssociationId="3">
          <or114:AirSegment>
            <or114:CarrierCode>SU</or114:CarrierCode>
            <or114:FlightNumber>1129</or114:FlightNumber>
            <or114:DepartureDate>2020-09-08</or114:DepartureDate>
            <or114:BoardPoint>AER</or114:BoardPoint>
            <or114:OffPoint>SVO</or114:OffPoint>
            <or114:ClassOfService>Y</or114:ClassOfService>
          </or114:AirSegment>
        </or114:SegmentAssociation>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-24" id="24" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCM" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:FreeText>/79851234567/RU</or114:FreeText>
          <or114:FullText>CTCM SU HK1/79851234567/RU</or114:FullText>
          <or114:PassengerContactMobilePhone>
            <or114:PhoneNumber>79851234567</or114:PhoneNumber>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactMobilePhone>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-25" id="25" type="SRVC">
        <or114:ServiceRequest actionCode="HK" airlineCode="SU" code="CTCE" serviceCount="1" serviceType="SSR" ssrType="GFX">
          <or114:Comment>COM/RU</or114:Comment>
          <or114:FreeText>/CUSTOMER//CUSTOMER.COM/RU</or114:FreeText>
          <or114:FullText>CTCE SU HK1/CUSTOMER//CUSTOMER.COM/RU</or114:FullText>
          <or114:PassengerContactEmail>
            <or114:Email>CUSTOMER@CUSTOMER.COM</or114:Email>
            <or114:Language>RU</or114:Language>
          </or114:PassengerContactEmail>
        </or114:ServiceRequest>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-13" id="13" type="PSG_DETAILS_MAIL">
        <or114:Email comment="BC/" type="BC">
          <or114:Address>AGENCY@AGENCY.COM</or114:Address>
        </or114:Email>
      </or114:OpenReservationElement>
      <or114:OpenReservationElement elementId="pnr-12" id="12" type="PSG_DETAILS_MAIL">
        <or114:Email comment="TO/" type="TO">
          <or114:Address>CUSTOMER@CUSTOMER.COM</or114:Address>
        </or114:Email>
        <or114:NameAssociation>
          <or114:LastName>IVANOV</or114:LastName>
          <or114:FirstName>IVAN MR</or114:FirstName>
          <or114:ReferenceId>1</or114:ReferenceId>
          <or114:NameRefNumber>01.01</or114:NameRefNumber>
        </or114:NameAssociation>
      </or114:OpenReservationElement>
    </stl19:OpenReservationElements>
  </stl19:Reservation>
  <stl19:Results>
    <stl19:UpdateResult Status="SUCCESS" UpdateId="">
      <stl19:Item id="32" op="C"/>
    </stl19:UpdateResult>
  </stl19:Results>
</stl19:UpdateReservationRS>
{% endxmlsec %}
