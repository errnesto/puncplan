# # encoding: UTF-8
# require 'uri'
# require 'json'
# namespace :generateStatistic do
#     desc ''
#     task :generateData => :environment do

    
#     wochentag = Woche.getTag
#     yesterday = Time.now.yesterday
#         each d.route do |r|

#            Verspatung_Tagdurchschnitt = 0
#            trip_id = r.trip_id

#            each trip where(id=trip_id) do |t|
#                 Verspatung_Tripdurchschnitt = 0
                
#                 service_id = t.service_id
                
#                 #service this weekday
#                 cal = Calendar.find(service_id)
#                 cal if wochentag = true ? 0||1

#                 #service this date
#                 calDates = CalendarDates.find(service_id,yesterday)
#                 calDates has no exceptiontype = 2


#                 then 
#                     each Stop_Times |st|

#                         st.where(st.trip_id = trip_id)


#                         then 
#                             ttlist = TimeTable.where(yesterday<-departure_time>= st.departureTime - 10min && departure_time<= st.departureTime + 10min && st.id = st.id && direction = trip.trip_headsign && route.shortdescription = TimeTable.type)
#                             temp = ttList geringster Abstand zu st.departureTime
#                             temp2 = ttList zweitgeringster Abstand zu st.departureTime
#                             if temp.createTime = temp2.createTime
#                                 temp3 = temp
#                             else
#                                 temp3 = temp2
#                             Verspatung= |st.departureTime - temp3|

#                             Verspatung_Tripdurchschnitt + Verspatung
#                     end
#                     Verspatung_Tripdurchschnitt = Verspatung_Tripdurchschnitt / Stop_Times.length
#                     Verspatung_Tagdurchschnitt += Verspatung_Tripdurchschnitt
#                 end
#             end
#             Verspatung_Tagdurchschnitt = Verspatung_Tagdurchschnitt / trips.length

#         end
#         write Verspatung_durchschnitt route day to database

#     end
# end




