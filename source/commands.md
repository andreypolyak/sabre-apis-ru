# Отправка терминальных команд

-----

**Оглавление:**
<!-- toc -->

-----

## Введение

При работе c системой Sabre через Sabre APIs можно отправлять терминальные команды и получать на них ответы в текстовом виде, так как это делается в Sabre Red Workspace. Это может быть использовано при разработке эмулятора терминала Sabre, во время отладки, а также для отправки тех команд, для которых не существует аналогичных сервисов.

## Отправка терминальных команд (SabreCommandLLSRQ)

*Для отправки терминальных команд в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Для отправки терминальных команд используется сервис [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Сервис использует контекст текущей сессии, например, после бронирования сегментов при помощи сервиса EnhancedAirBookRQ, их можно будет увидеть в ответе на терминальную команду ```*A``` (чтение открытого бронирования).

Другие терминальные команды можно увидеть в [Finder](https://central.sabre.com/s/finder) и в [справочнике форматов Sabre](http://airts.ru/upload/Manuals_and_Installers/Manuals/Practice_manuals/Format.pdf).

В запросе необходимо указать:
- ```/SabreCommandLLSRQ/Request/@Output``` — формат выдачи, всегда значение ```SCREEN```
- ```/SabreCommandLLSRQ/Request/HostCommand``` — терминальная команда

{% xmlsec "Пример запроса", false %}
<SabreCommandLLSRQ Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Request Output="SCREEN">
    <HostCommand>*S*P</HostCommand>
  </Request>
</SabreCommandLLSRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<SabreCommandLLSRS AltLangID="en-us" EchoToken="String" PrimaryLangID="en-us" SequenceNmbr="1" Target="Production" TimeStamp="2018-04-02T19:46:49" Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Response>
    <![CDATA[2FRH.9LSC*AWS.A..PNR PRESENT]]>
    <![CDATA[
ACTIVE AGENT - WS WEBSERVICES - 7971-9LSC           ]]>
    <![CDATA[
NO PRINTERS                                                   ]]>
  </Response>
</SabreCommandLLSRS>
{% endxmlsec %}

## Специальные символы

В терминальных командах и ответах Sabre используются четыре дополнительных специальных символа:

| Название | Символ | Код символа | Сочетание клавиш для вставки символа в ОС Windows | Описание |
|-|-|-|-|-|
| Change Key        | ```¤``` | ```&#164;``` | ```ALT``` + ```0164``` | Используется в командах изменения и удаления данных |
| Cross of Lorraine | ```¥``` | ```&#165;``` | ```ALT``` + ```0165``` | Используется для добавления квалификаторов к командам и в качестве знака сложения |
| End Item Key      | ```§``` | ```&#167;``` | ```ALT``` + ```0167``` | Используется для ввода нескольких команд одновременно в одну строку |

В запросе можно указать как сам символ, так и его код. Однако, необходимо учитывать, что при использовании элемента ```<![CDATA[команда]]>``` в команде можно указать только сам символ, а не его код.

## Заполнение масок

При работе с Sabre в терминальном режиме, некоторые команды в качестве ответа предлагают заполнить маску. Маска характеризуется тем, что имеет одно или несколько полей фиксированной длины, границы которых обрамлены угловыми скобками.

Для заполнения маски используется сервис SabreCommandLLSRQ. В качестве терминальной команды в режиме заполнения маски отправляется следующая последовательность символов (в одну строку без пробелов):
- первые два символа маски
- все поля маски с сохранением фиксированной длины и угловых скобок

Т.к. при заполнении терминальных масок, запрос будет содержать угловые скобки, которые могут сделать XML сообщение невалидным, необходимо обрамлять такие команды в элемент CDATA: ```<![CDATA[команда]]>```.

**Пример маски:**
```
PP                                                              
ENTER SELECTION NUMBER < >                                      
1.   SELECT/UPDATE PRINTER TYPES FOR PRINTER PROFILE            
2.   ADD NEW PRINTER PROFILE                                    
3.   UPDATE EXISTING PRINTER PROFILE                            
4.   EXIT                                                       
```

{% xmlsec "Пример заполнения маски", true %}
<SabreCommandLLSRQ Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[PP<3>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
{% endxmlsec %}

**Пример маски:**
```
PP - ENTER X TO SELECT OR SPACE TO DELETE PRINTER TYPES         
                                                                
DESIGNATION CODE         PRINTER TYPES                          
< >  PTR/                HARDCOPY                               
< >  W*<  >              TICKET                                 
< >  W*<  >              SECONDARY TICKET                       
< >  GYLN                BOARDING PASS PRINTER                  
< >  GYAB                ATB BOARDING PASS ONLY                 
< >  GYAT                ATB 2 BOARDING PASS ONLY               
< >  RP1                 REMOTE PRINTER                         
< >  RP2                 SECOND REMOTE PRINTER                  
< >  DSIV                INVOICE/ITINERARY                      
< >  DSRP                ARC/BSP REPORTS                        
< >  DSLB                LISTS/LABELS                           
< >  DSIM                MINI ITINERARY                         
 NEED PRINTER SELECTIONS                                        
< > END < > IGNORE                                              
```

{% xmlsec "Пример заполнения маски", true %}
<SabreCommandLLSRQ Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[PP<X><X><RU>< ><  >< >< >< >< >< ><X>< >< >< ><X>< >]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
{% endxmlsec %}

**Пример маски:**
```
WARNING - NO PASSPORT AND/OR DOB DATA FOR SELECTED PAX          
CONTINUE TICKETING Y OR N ><.>                                  
```

{% xmlsec "Пример заполнения маски", true %}
<SabreCommandLLSRQ Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[WA<Y>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
{% endxmlsec %}

**Пример маски:**
```
VERIFY TKT TTL  RUB     69339 - PQ TTL  RUB    138678           
TICKET?  ENTER Y OR N<.>                                        
```

{% xmlsec "Пример заполнения маски", true %}
<SabreCommandLLSRQ Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[VE<Y>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
{% endxmlsec %}
