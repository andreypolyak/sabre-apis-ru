---
title: Отправка терминальных команд
---

{{< toc >}}

## Введение

При работе c системой Sabre через Sabre APIs можно отправлять терминальные команды и получать на них ответы в текстовом виде, так как это делается в Sabre Red. Это может быть использовано при разработке эмулятора терминала Sabre, во время отладки, а также для отправки тех команд, для которых не существует аналогичных сервисов.

## Отправка терминальных команд (SabreCommandLLSRQ)

{{< hint warning >}}
Для отправки терминальных команд в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.html)).
{{< /hint >}}

Для отправки терминальных команд используется сервис [SabreCommandLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/send_sabre_command).

Сервис использует контекст текущей сессии, например, после бронирования сегментов при помощи сервиса EnhancedAirBookRQ, их можно будет увидеть в ответе на терминальную команду ```*A``` (чтение открытого бронирования).

Другие терминальные команды можно увидеть в [Finder](https://central.sabre.com/s/finder) и в [справочнике форматов Sabre](http://airts.ru/upload/Manuals_and_Installers/Manuals/Practice_manuals/Format.pdf).

В запросе необходимо указать:
- ```/SabreCommandLLSRQ/@NumResponses``` — всегда значение 4
- ```/SabreCommandLLSRQ/Request/@Output``` — формат выдачи, всегда значение ```SCREEN```
- ```/SabreCommandLLSRQ/Request/HostCommand``` — терминальная команда

{{< details title="Пример запроса" >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand>*S*P</HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<SabreCommandLLSRS AltLangID="en-us" EchoToken="String" PrimaryLangID="en-us" SequenceNmbr="1" Target="Production" TimeStamp="2018-04-02T19:46:49" Version="1.8.1" xmlns="http://webservices.sabre.com/sabreXML/2003/07">
  <Response>
    <![CDATA[2FRH.9LSC*AWS.A..PNR PRESENT]]>
    <![CDATA[
ACTIVE AGENT - WS WEBSERVICES - 7971-9LSC           ]]>
    <![CDATA[
NO PRINTERS                                                   ]]>
  </Response>
</SabreCommandLLSRS>
```
{{< /details >}}

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

#### Пример №1

{{< details title="Пример маски" open=true >}}
```
PP                                                              
ENTER SELECTION NUMBER < >                                      
1.   SELECT/UPDATE PRINTER TYPES FOR PRINTER PROFILE            
2.   ADD NEW PRINTER PROFILE                                    
3.   UPDATE EXISTING PRINTER PROFILE                            
4.   EXIT                                                       
```
{{< /details >}}

{{< details title="Пример заполнения маски" open=true >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[PP<3>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

#### Пример №2

{{< details title="Пример маски" open=true >}}
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
{{< /details >}}

{{< details title="Пример заполнения маски" open=true >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[PP<X><X><RU>< ><  >< >< >< >< >< ><X>< >< >< ><X>< >]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

#### Пример №3

{{< details title="Пример маски" open=true >}}
```
WARNING - NO PASSPORT AND/OR DOB DATA FOR SELECTED PAX          
CONTINUE TICKETING Y OR N ><.>                                  
```
{{< /details >}}

{{< details title="Пример заполнения маски" open=true >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[WA<Y>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}

#### Пример №4

{{< details title="Пример маски" open=true >}}
```
VERIFY TKT TTL  RUB     69339 - PQ TTL  RUB    138678           
TICKET?  ENTER Y OR N<.>                                        
```
{{< /details >}}

{{< details title="Пример заполнения маски" open=true >}}
```XML
<SabreCommandLLSRQ NumResponses="4" Version="2.0.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <Request Output="SCREEN">
    <HostCommand><![CDATA[VE<Y>]]></HostCommand>
  </Request>
</SabreCommandLLSRQ>
```
{{< /details >}}
