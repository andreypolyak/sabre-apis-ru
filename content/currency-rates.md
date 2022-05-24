---
title: Получение курсов валют
---

Курсы валют можно получить, используя сервис [DisplayCurrencyLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/get_currency_conversion).

В запросе необходимо указать:
- ```/DisplayCurrencyRQ/CountryCode``` — код страны, курс валюты которой необходимо получить (например, ```DE``` для евро или ```US``` для доллара)
- ```/DisplayCurrencyRQ/CurrencyCode``` — код валюты (например, ```RUB``` для рубля)

{{< details title="Пример запроса" >}}
```XML
<DisplayCurrencyRQ ReturnHostCommand="true" Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <CountryCode>DE</CountryCode>
  <CurrencyCode>RUB</CurrencyCode>
</DisplayCurrencyRQ>
```
{{< /details >}}

{{< details title="Пример ответа" >}}
```XML
<DisplayCurrencyRS Version="2.1.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-02T14:45:17-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52D10D">DC*DE/RUB</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <Country Name="RUSSIA" RPH="1">
    <CurrencyCode>RUB</CurrencyCode>
    <CurrencyName>RUBLE</CurrencyName>
    <DecimalPlaces>0</DecimalPlaces>
    <Rate Type="BSR">71</Rate>
  </Country>
</DisplayCurrencyRS>
```
{{< /details >}}
