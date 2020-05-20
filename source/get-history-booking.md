# История бронирований

Для получения истории бронирования используется сервис [TravelItineraryHistoryLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/itinerary/get_itinerary_history).

В запросе необходимо указать код бронирования (Record Locator) в качестве значения атрибута ```/TravelItineraryHistoryRQ/UniqueID/@ID```. Перед открытием 

Ответ будет содержать все сохраненные изменения в бронировании.

Перед отправкой запрос открытие бронирования не требуется. После выполнения запроса бронирование будет открыто в текущей сессии.

{% xmlsec "Пример запроса", false %}
<TravelItineraryHistoryRQ ReturnHostCommand="true" Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10">
  <UniqueID ID="PMJABI"/>
</TravelItineraryHistoryRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<TravelItineraryHistoryRS Version="2.3.0" xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:stl="http://services.sabre.com/STL/v01" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <stl:ApplicationResults status="Complete">
    <stl:Success timeStamp="2018-04-03T03:57:07-05:00">
      <stl:SystemSpecificResults>
        <stl:HostCommand LNIATA="52E128">JX HST*PMJABI</stl:HostCommand>
      </stl:SystemSpecificResults>
    </stl:Success>
  </stl:ApplicationResults>
  <HistoricalInfo RPH="1">
    <AccountingInfo Action="AAC">
      <Airline Code="SU"/>
      <BaseFare Amount="44175"/>
      <DocumentInfo>
        <Document Number="5301772402"/>
      </DocumentInfo>
      <PaymentInfo>
        <Commission Amount="0"/>
        <FareApplication>ONE</FareApplication>
        <Payment>
          <Form>CA</Form>
        </Payment>
      </PaymentInfo>
      <PersonName NameNumber="3.1">IVANOV ANDREY CHD</PersonName>
      <Taxes>
        <GST Amount="0"/>
        <Tax Amount="3968" TaxCode="C"/>
      </Taxes>
      <TicketingInfo>
        <Exchange Ind="false"/>
        <TarriffBasis>D</TarriffBasis>
        <Ticketing ConjunctedCount="1"/>
      </TicketingInfo>
    </AccountingInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 SVOAER1138Y01SEP/5555301772402C1</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 AERSVO1129Y08SEP/5555301772402C2</Text>
    </GeneralInfo>
    <GeneralInfo Action="X7">
      <Text>T-03APR-2FRH*HPA</Text>
    </GeneralInfo>
    <GeneralInfo Action="A7">
      <Text>T-03APR-2FRH*HPA</Text>
    </GeneralInfo>
    <GeneralInfo Action="AT">
      <Text>WPQ2FCAKP0</Text>
    </GeneralInfo>
    <ItineraryRef>
      <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2018-04-03T03:55" CreationAgent="PA" CreationAgentDutyCode="*" CreationAgentFunctionCode="H" PseudoCityCode="NSU"/>
    </ItineraryRef>
    <InvoiceInfo>
      <InvoiceNumber>0000040</InvoiceNumber>
    </InvoiceInfo>
  </HistoricalInfo>
  <HistoricalInfo RPH="2">
    <AccountingInfo Action="AAC">
      <Airline Code="SU"/>
      <BaseFare Amount="58900"/>
      <DocumentInfo>
        <Document Number="5301772400"/>
      </DocumentInfo>
      <PaymentInfo>
        <Commission Amount="0"/>
        <FareApplication>ONE</FareApplication>
        <Payment>
          <Form>CA</Form>
        </Payment>
      </PaymentInfo>
      <PersonName NameNumber="1.1">IVANOV IVAN MR</PersonName>
      <Taxes>
        <GST Amount="0"/>
        <Tax Amount="4206" TaxCode="C"/>
      </Taxes>
      <TicketingInfo>
        <Exchange Ind="false"/>
        <TarriffBasis>D</TarriffBasis>
        <Ticketing ConjunctedCount="1"/>
      </TicketingInfo>
    </AccountingInfo>
    <AccountingInfo Action="AAC">
      <Airline Code="SU"/>
      <BaseFare Amount="58900"/>
      <DocumentInfo>
        <Document Number="5301772401"/>
      </DocumentInfo>
      <PaymentInfo>
        <Commission Amount="0"/>
        <FareApplication>ONE</FareApplication>
        <Payment>
          <Form>CA</Form>
        </Payment>
      </PaymentInfo>
      <PersonName NameNumber="2.1">IVANOVA ELENA MS</PersonName>
      <Taxes>
        <GST Amount="0"/>
        <Tax Amount="4206" TaxCode="C"/>
      </Taxes>
      <TicketingInfo>
        <Exchange Ind="false"/>
        <TarriffBasis>D</TarriffBasis>
        <Ticketing ConjunctedCount="1"/>
      </TicketingInfo>
    </AccountingInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 SVOAER1138Y01SEP/5555301772400C1</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 AERSVO1129Y08SEP/5555301772400C2</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 SVOAER1138Y01SEP/5555301772401C1</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR TKNE SU HK1 AERSVO1129Y08SEP/5555301772401C2</Text>
    </GeneralInfo>
    <GeneralInfo Action="X7">
      <Text>TAW/</Text>
    </GeneralInfo>
    <GeneralInfo Action="A7">
      <Text>T-03APR-2FRH*HPA</Text>
    </GeneralInfo>
    <GeneralInfo Action="AT">
      <Text>WPQ1FCAKP0</Text>
    </GeneralInfo>
    <ItineraryRef>
      <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2018-04-03T03:55" CreationAgent="PA" CreationAgentDutyCode="*" CreationAgentFunctionCode="H" PseudoCityCode="NSU"/>
    </ItineraryRef>
    <InvoiceInfo>
      <InvoiceNumber>0000039</InvoiceNumber>
    </InvoiceInfo>
  </HistoricalInfo>
  <HistoricalInfo RPH="3">
    <GeneralInfo Action="A9">
      <Text>MOW74991234567-A</Text>
    </GeneralInfo>
    <GeneralInfo Action="A9">
      <Text>MOW79851234567-M</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT SU NN1 SVOAER1138Y01SEP/IVANOVA/EKATERINA/20FEB18</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR INFT SU NN1 AERSVO1129Y08SEP/IVANOVA/EKATERINA/20FEB18</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS SU HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2020/IVANOV/IVAN/IVANOVICH/H</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS SU HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2019/IVANOVA/ELENA/IVANOVNA</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS SU HK1/P/RU/3234567890/RU/15JAN2010/M/20NOV2020/IVANOV/ANDREY/IVANOVICH</Text>
    </GeneralInfo>
    <GeneralInfo Action="A3S">
      <Text>SSR DOCS SU HK1/P/RU/1234567890/RU/20FEB2018/FI/15APR2020/IVANOVA/EKATERINA/IVANOVNA</Text>
    </GeneralInfo>
    <GeneralInfo Action="A4O">
      <Text>OSI AA INF</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOV/IVAN MR</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOVA/ELENA MS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>1IVANOV/ANDREY</Text>
    </GeneralInfo>
    <GeneralInfo Action="AN">
      <Text>I/1IVANOVA/EKATERINA</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR SU-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="AZ">
      <Text>NAME CHG NOT ALLOWED FOR SU-Y FARECLASS</Text>
    </GeneralInfo>
    <GeneralInfo Action="A7">
      <Text>TAW/</Text>
    </GeneralInfo>
    <GeneralInfo Action="APE">
      <Text>EAGENCY@AGENCY.COMBC/</Text>
    </GeneralInfo>
    <GeneralInfo Action="APE">
      <Text>ECUSTOMER@CUSTOMER.COMTO/</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TADT</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TADT</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TCNN</Text>
    </GeneralInfo>
    <GeneralInfo Action="ADT">
      <Text>TINF</Text>
    </GeneralInfo>
    <ItineraryInfo>
      <ReservationItems>
        <Item RPH="1">
          <FlightSegment Action="AS" ArrivalDateTime="09-01T10:15" DepartureDateTime="09-01T07:50" FlightNumber="1138" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="AER"/>
            <MarketingAirline Code="SU" FlightNumber="1138"/>
            <OriginLocation LocationCode="SVO"/>
            <SupplierRef ID="DCSU"/>
          </FlightSegment>
          <FlightSegment Action="AS" ArrivalDateTime="09-08T05:50" DepartureDateTime="09-08T03:30" FlightNumber="1129" NumberInParty="03" ResBookDesigCode="Y" Status="SSNN" eTicket="true">
            <DestinationLocation LocationCode="SVO"/>
            <MarketingAirline Code="SU" FlightNumber="1129"/>
            <OriginLocation LocationCode="AER"/>
            <SupplierRef ID="DCSU"/>
          </FlightSegment>
        </Item>
      </ReservationItems>
    </ItineraryInfo>
    <ItineraryRef>
      <Source AAA_PseudoCityCode="2FRH" CreateDateTime="2018-04-03T03:54" CreationAgent="WS" CreationAgentDutyCode="*" CreationAgentFunctionCode="A" PseudoCityCode="9LSC" ReceivedFrom="API"/>
    </ItineraryRef>
  </HistoricalInfo>
</TravelItineraryHistoryRS>
{% endxmlsec %}
