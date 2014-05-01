class TimeTable < ActiveRecord::Base
    serialize :data, Hash
end
