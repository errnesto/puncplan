set :output, "cron_log.log"

every 10.minutes do
  rake "delay:get"
end