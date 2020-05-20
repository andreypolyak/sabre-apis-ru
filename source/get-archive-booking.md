# Чтение бронирований из архива

*Для чтения бронирований из архива в других PCC предварительно требуется отправить запрос к сервису [ContextChangeLLSRQ](https://developer.sabre.com/docs/read/soap_apis/management/utility/change_aaa) (см. [Переход в другие PCC](change-pcc.md)).*

Через некоторое время после того, как проходит время вылета для всех сегментов в бронировании, оно попадает в архив. Бронирования, находящиеся в архиве, можно читать, но нельзя изменять.

Для чтения бронирований из архива используется сервис [Trip_SearchRQ](https://developer.sabre.com/docs/soap_apis/management/itinerary/search_for_itineraries).

В запросе необходимо указать:
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/LocatorCriteria/Locator/@Id``` — код бронирования (PNR Record Locator)
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/PosCriteria/@AnyBranch``` — признак поиска бронирования во всех PCC, с которыми у текущего PCC есть [Branch Access](configuration.md#dostup_v_drugoi_pcc_branch_access). Рекомендуется всегда указывать значение ```true```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@MaxItemsReturned``` — максимальное количество найденных бронирований. Рекомендуется всегда указывать значение ```1```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@ResponseFormat``` — формат ответа. Всегда значение ```TVL```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@SearchType``` — тип поиска. Всегда значение ```INACTIVE```
- ```/Trip_SearchRQ/ReadRequests/ReservationReadRequest/ReturnOptions/@ViewName``` — вид ответа. Всегда значение ```PastDate-TN```

{% xmlsec "Пример запроса", false %}
<Trip_SearchRQ Version="4.3.0" xmlns="http://webservices.sabre.com/triprecord">
  <ReadRequests>
    <ReservationReadRequest>
      <LocatorCriteria>
        <Locator Id="QQCUQS"/>
      </LocatorCriteria>
      <PosCriteria AnyBranch="true"/>
      <ReturnOptions MaxItemsReturned="1" ResponseFormat="TVL" SearchType="INACTIVE" ViewName="PastDate-TN"/>
    </ReservationReadRequest>
  </ReadRequests>
</Trip_SearchRQ>
{% endxmlsec %}

{% xmlsec "Пример ответа", false %}
<Trip_SearchRS Target="Production" TimeStamp="2018-04-02T14:43:30" Version="4.3.0" xmlns="http://webservices.sabre.com/triprecord" xmlns:ns10="http://services.sabre.com/STL_Header/v02_00" xmlns:ns11="http://www.OpenTravel.org/ns/OTA2/AppInfo_v01_00" xmlns:ns12="http://opentravel.org/common/v02" xmlns:ns13="http://www.sabre.com/eps/schemas" xmlns:ns14="http://tds.sabre.com/distribution" xmlns:ns15="http://webservices.sabre.com/servicesplatform/orr/rules/1.0.0" xmlns:ns2="http://services.sabre.com/STL/v01" xmlns:ns3="http://webservices.sabre.com/pnrbuilder" xmlns:ns4="http://webservices.sabre.com/sabreXML/2003/07" xmlns:ns5="http://tds.sabre.com/rules" xmlns:ns6="http://tds.sabre.com/itinerary" xmlns:ns7="http://services.sabre.com/res/orr/v0" xmlns:ns8="http://services.sabre.com/STL/v02" xmlns:ns9="http://www.sabre.com/ssg/des/v1" xmlns:or111="http://services.sabre.com/res/or/v1_11" xmlns:or16="http://services.sabre.com/res/or/v1_6" xmlns:or17="http://services.sabre.com/res/or/v1_7" xmlns:or18="http://services.sabre.com/res/or/v1_8" xmlns:or19="http://services.sabre.com/res/or/v1_9" xmlns:stl114="http://webservices.sabre.com/pnrbuilder/v1_14" xmlns:stl115="http://webservices.sabre.com/pnrbuilder/v1_15" xmlns:stl117="http://webservices.sabre.com/pnrbuilder/v1_17" xmlns:tir37="http://services.sabre.com/res/tir/v3_7" xmlns:tir39="http://services.sabre.com/res/tir/v3_9">
  <Success>Success</Success>
  <ReservationsList NumberPages="1" NumberResults="1" TotalResults="1">
    <Reservations>
      <Reservation Locator="QQCUQS" PastDate="true">
        <tir39:TravelItineraryReadRS Version="3.9.0">
          <ns2:ApplicationResults status="Complete">
            <ns2:Success timeStamp="2018-04-02T14:43:31.375-05:00"/>
          </ns2:ApplicationResults>
          <tir39:TravelItinerary>
            <tir39:CustomerInfo>
              <tir39:ContactNumbers>
                <tir39:ContactNumber Id="17" LocationCode="MOW" Phone="74991234567-A" RPH="001"/>
                <tir39:ContactNumber Id="18" LocationCode="MOW" Phone="79851234567-M" RPH="002"/>
              </tir39:ContactNumbers>
              <tir39:PersonName NameNumber="01.01" PassengerType="ADT" RPH="1" WithInfant="false" elementId="pnr-5.1">
                <tir39:Email Comment="BC/" Id="16" Type="BC">AGENCY@AGENCY.COM</tir39:Email>
                <tir39:Email Comment="TO/" Id="15" Type="TO">CUSTOMER@CUSTOMER.COM</tir39:Email>
                <tir39:GivenName>IVAN MR</tir39:GivenName>
                <tir39:Surname>IVANOV</tir39:Surname>
              </tir39:PersonName>
              <tir39:PersonName NameNumber="02.01" PassengerType="ADT" RPH="2" WithInfant="false" elementId="pnr-7.2">
                <tir39:Email Comment="BC/" Id="16" Type="BC">AGENCY@AGENCY.COM</tir39:Email>
                <tir39:GivenName>ELENA MS</tir39:GivenName>
                <tir39:Surname>IVANOVA</tir39:Surname>
              </tir39:PersonName>
              <tir39:PersonName NameNumber="03.01" PassengerType="CNN" RPH="3" WithInfant="false" elementId="pnr-9.3">
                <tir39:Email Comment="BC/" Id="16" Type="BC">AGENCY@AGENCY.COM</tir39:Email>
                <tir39:GivenName>ANDREY</tir39:GivenName>
                <tir39:Surname>IVANOV</tir39:Surname>
              </tir39:PersonName>
              <tir39:PersonName NameNumber="04.01" PassengerType="INF" RPH="4" WithInfant="true" elementId="pnr-11.4">
                <tir39:Email Comment="BC/" Id="16" Type="BC">AGENCY@AGENCY.COM</tir39:Email>
                <tir39:GivenName>EKATERINA</tir39:GivenName>
                <tir39:Surname>IVANOVA</tir39:Surname>
              </tir39:PersonName>
            </tir39:CustomerInfo>
            <tir39:ItineraryInfo>
              <tir39:ReservationItems>
                <tir39:Item RPH="1">
                  <tir39:FlightSegment AirMilesFlown="0872" ArrivalDateTime="02-15T09:10" DayOfWeekInd="4" DepartureDateTime="2018-02-15T06:40" FlightNumber="1138" Id="3" IsPast="true" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2017-12-22T06:18:00" SegmentNumber="0001" SpecialMeal="false" Status="HK" eTicket="true">
                    <tir39:DestinationLocation LocationCode="AER"/>
                    <tir39:Equipment AirEquipType="73H"/>
                    <tir39:MarketingAirline Code="SU" FlightNumber="1138">
                      <tir39:Banner>MARKETED BY AEROFLOT</tir39:Banner>
                    </tir39:MarketingAirline>
                    <tir39:OperatingAirline FlightNumber="1138" ResBookDesigCode="Y"/>
                    <tir39:OperatingAirlinePricing/>
                    <tir39:OriginLocation LocationCode="SVO"/>
                    <tir39:SupplierRef ID="DCSU*HWCAMY"/>
                    <tir39:UpdatedArrivalTime>02-15T09:10</tir39:UpdatedArrivalTime>
                    <tir39:UpdatedDepartureTime>02-15T06:40</tir39:UpdatedDepartureTime>
                  </tir39:FlightSegment>
                </tir39:Item>
                <tir39:Item RPH="2">
                  <tir39:FlightSegment AirMilesFlown="0872" ArrivalDateTime="02-20T09:10" DayOfWeekInd="2" DepartureDateTime="2018-02-20T06:45" FlightNumber="1129" Id="4" IsPast="true" NumberInParty="03" ResBookDesigCode="Y" SegmentBookedDate="2017-12-22T06:18:00" SegmentNumber="0002" SpecialMeal="false" Status="HK" eTicket="true">
                    <tir39:DestinationLocation LocationCode="SVO"/>
                    <tir39:Equipment AirEquipType="321"/>
                    <tir39:MarketingAirline Code="SU" FlightNumber="1129">
                      <tir39:Banner>MARKETED BY AEROFLOT</tir39:Banner>
                    </tir39:MarketingAirline>
                    <tir39:OperatingAirline FlightNumber="1129" ResBookDesigCode="Y"/>
                    <tir39:OperatingAirlinePricing/>
                    <tir39:OriginLocation LocationCode="AER"/>
                    <tir39:SupplierRef ID="DCSU*HWCAMY"/>
                    <tir39:UpdatedArrivalTime>02-20T09:10</tir39:UpdatedArrivalTime>
                    <tir39:UpdatedDepartureTime>02-20T06:45</tir39:UpdatedDepartureTime>
                  </tir39:FlightSegment>
                </tir39:Item>
              </tir39:ReservationItems>
              <tir39:Ticketing RPH="01" TicketTimeLimit="TAW2FRH25DEC009/1100P/"/>
            </tir39:ItineraryInfo>
            <tir39:ItineraryRef AirExtras="false" ID="QQCUQS" InhibitCode="U" PartitionID="AA" PrimeHostID="1S">
              <tir39:Header>**PAST DATE PNR - NO UPDATES ALLOWED**</tir39:Header>
              <tir39:Source AAA_PseudoCityCode="2FRH" CreateDateTime="2017-12-22T06:18" CreationAgent="AWS" HomePseudoCityCode="9LSC" LastUpdateDateTime="2018-01-10T21:05" PseudoCityCode="2FRH" ReceivedFrom="SWS" SequenceNumber="8"/>
            </tir39:ItineraryRef>
            <tir39:RemarkInfo>
              <tir39:Remark Id="30" RPH="001" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS RRCKLX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="31" RPH="002" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR RSUZFL RSUECZ RSZHGS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="32" RPH="003" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR SCJSRE XMOWWW YXRLCB</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="33" RPH="004" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR YXXMWK ZFJXWE ADGSNC</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="34" RPH="005" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR AEZFRB DFYQCD GBNWLN</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="35" RPH="006" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR GNDLBW HWBCMI LLUZGZ</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="36" RPH="007" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR NZCBEX PPLPXE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="37" RPH="008" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS RSZHGS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="38" RPH="009" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR SCJSRE XMOWWW YXRLCB</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="39" RPH="010" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR ZFJXWE ADGSNC AEZFRB</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="40" RPH="011" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR ALINHL ALPRWC DFYQCD</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="41" RPH="012" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR GBNWLN GNDLBW HWBCMI</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="42" RPH="013" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR NZCBEX PPLPXE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="43" RPH="014" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS RRCKLX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="44" RPH="015" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR RSUZFL RSUECZ RSZHGS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="45" RPH="016" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR SCJSRE XMOWWW YXRLCB</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="46" RPH="017" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR YXXMWK ZFJXWE ADGSNC</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="47" RPH="018" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR AEZFRB ALINHL ALPRWC</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="48" RPH="019" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR DFYQCD GBNWLN GNDLBW</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="49" RPH="020" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR HWBCMI HGXRDN LLUZGZ</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="50" RPH="021" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR NZCBEX PPLPXE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="51" RPH="022" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS QEIFUE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="52" RPH="023" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QEKQQH QEKZRH QEMVQO</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="53" RPH="024" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFTMOT QFXKKA QFXOFK</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="54" RPH="025" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFJBNO QFLDKL RRCKLX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="55" RPH="026" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR RSUZFL RSUECZ RSZHGS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="56" RPH="027" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR SCJSRE VARVXX XMOWWW</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="57" RPH="028" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR YXRLCB YXXMWK ZFJXWE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="58" RPH="029" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR ADGSNC AEZFRB BSLOFS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="59" RPH="030" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR DFYQCD GBNWLN GNDLBW</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="60" RPH="031" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR HWBCMI HGXRDN HIZNDF</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="61" RPH="032" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR HIJMUV HJUMFN LLUZGZ</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="62" RPH="033" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR NZCBEX PPLPXE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="63" RPH="034" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS QEIFUE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="64" RPH="035" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QEKQQH QEKZRH QEMVQO</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="65" RPH="036" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFTMOT QFXKKA QFXOFK</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="66" RPH="037" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFJBNO QFLDKL RRCKLX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="67" RPH="038" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR RSUZFL</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="68" RPH="039" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QQCIFG QQMOVS QEIFUE</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="69" RPH="040" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QEKQQH QEKZRH QEMVQO</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="70" RPH="041" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFTMOT QFXKKA QFXOFK</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="71" RPH="042" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR QFJBNO QFLDKL RRCKLX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="72" RPH="043" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR RSUZFL RSUECZ RSZHGS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="73" RPH="044" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR SCJSRE VSPOPV VARVXX</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="74" RPH="045" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR XMOWWW YXRLCB YXXMWK</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="75" RPH="046" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR ZFJXWE ADGSNC AEZFRB</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="76" RPH="047" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR ALINHL ALPRWC BSLOFS</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="77" RPH="048" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR BVOXUW DFYQCD GBNWLN</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="78" RPH="049" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR GNDLBW HWBCMI HGXRDN</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="79" RPH="050" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR HIZNDF HIJMUV HJUMFN</tir39:Text>
              </tir39:Remark>
              <tir39:Remark Id="80" RPH="051" Type="Historical">
                <tir39:Text>POSSIBLE DUPE BOOKING. SEE PNR LLUZGZ NZCBEX PPLPXE</tir39:Text>
              </tir39:Remark>
            </tir39:RemarkInfo>
            <tir39:SpecialServiceInfo Id="12" RPH="001" Type="AFX">
              <tir39:Service SSR_Code="OSI">
                <tir39:PersonName NameNumber="04.01">I/IVANOVA/EKATERINA</tir39:PersonName>
                <tir39:Text>AA INF</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="28" RPH="002" Type="AFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="INFT">
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>SU KK1 SVOAER1138Y15FEB/IVANOVA/EKATERINA/20FEB17</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="29" RPH="003" Type="AFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="INFT">
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>SU KK1 AERSVO1129Y20FEB/IVANOVA/EKATERINA/20FEB17</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="19" RPH="001" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="INFT">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>NN1 SVOAER1138Y15FEB/IVANOVA/EKATERINA/20FEB17</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="20" RPH="002" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="INFT">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>NN1 AERSVO1129Y20FEB/IVANOVA/EKATERINA/20FEB17</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="21" RPH="003" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="CHLD">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="03.01">IVANOV/ANDREY</tir39:PersonName>
                <tir39:Text>HK1/15JAN10</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="22" RPH="004" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="DOCS">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>HK1/P/RU/1234567890/RU/20NOV1980/M/20NOV2020/IVANOV/IVAN/IVANOVICH/H</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="23" RPH="005" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="DOCS">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="02.01">IVANOVA/ELENA MS</tir39:PersonName>
                <tir39:Text>HK1/P/RU/2234567890/RU/20JAN1980/F/15AUG2019/IVANOVA/ELENA/IVANOVNA</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="24" RPH="006" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="DOCS">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="03.01">IVANOV/ANDREY</tir39:PersonName>
                <tir39:Text>HK1/P/RU/3234567890/RU/15JAN2010/M/20NOV2020/IVANOV/ANDREY/IVANOVICH</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
            <tir39:SpecialServiceInfo Id="25" RPH="007" Type="GFX">
              <tir39:Service SSR_Code="SSR" SSR_Type="DOCS">
                <tir39:Airline Code="SU"/>
                <tir39:PersonName NameNumber="01.01">IVANOV/IVAN MR</tir39:PersonName>
                <tir39:Text>HK1/P/RU/1234567890/RU/20FEB2017/FI/15APR2020/IVANOVA/EKATERINA/IVANOVNA</tir39:Text>
              </tir39:Service>
            </tir39:SpecialServiceInfo>
          </tir39:TravelItinerary>
        </tir39:TravelItineraryReadRS>
      </Reservation>
    </Reservations>
  </ReservationsList>
</Trip_SearchRS>
{% endxmlsec %}
