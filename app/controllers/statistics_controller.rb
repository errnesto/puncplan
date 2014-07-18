class StatisticsController < ApplicationController
    def index
    end

    def allLines
      starttime = params['starttime']
      endtime = params['endtime']

      @statistics = Statistic.select("vehicle_number,vehicle_type, avg(average_delay)").where(date: starttime..endtime).group("vehicle_number,vehicle_type")

      render json: @statistics
    end

    def oneLine
      starttime = params['starttime']
      endtime = params['endtime']
      vehicle_number = params['vehicle_number']
      vehicle_type = params['vehicle_type']

      @statistics = Statistic.select("date, avg(average_delay)").where(date: starttime..endtime, vehicle_number: vehicle_number, vehicle_type: vehicle_type).group("date")

      render json: @statistics
    end

end
