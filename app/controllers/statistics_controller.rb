class StatisticsController < ApplicationController
    def index
    end

    def showStat
      starttime = params['starttime']
      endtime = params['endtime']

      @statistics = Statistic.select("vehicle_number,vehicle_type, avg(average_delay)").where(date: starttime..endtime).group("vehicle_number,vehicle_type")

      render json: @statistics
      puts "____________________"
      puts params
      puts @statistics
    end

end
