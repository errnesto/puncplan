set :output, "cron_log.log"

every 10.minutes do
  rake "delay:get"
end

every 2.minutes do
  rake "test:test"
end