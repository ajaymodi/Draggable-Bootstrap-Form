class Query
  def find_bookings(latitude,longitude,distance,status,startDate,endDate)
    res = nil
    sql = %Q{SELECT booking_id, lat, lng,status,
          ( 6371 * acos( cos( radians(#{latitude}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(#{longitude}) ) + sin( radians(#{latitude}) ) * sin( radians( lat ) ) ) ) AS distance 
          FROM ola_citytaxi_status_update 
          WHERE status in ('#{status}') AND lat BETWEEN #{latitude-1} AND #{latitude+1}
                AND lng BETWEEN #{longitude-1} AND #{longitude+1} 
                AND created_at between '#{startDate}' and '#{endDate} 23:59:59'
          HAVING distance <= #{distance} limit 10000;
        }
        # p sql
    begin  
      $client.with do |conn|
       res =  conn.query(sql)
      end
    rescue Exception => e
      p e
    end
    res
  end

  def get_booking_details(booking_id,timeday,lead_source)
    res = nil
    if(timeday=='all')
      sql_str = ''
    else
      if(timeday=='morning')
        sql_str = "AND (hour(pickup_date + Interval 330 minute)) between 6 and 11" 
      elsif(timeday=='afternoon')
        sql_str = "AND (hour(pickup_date + Interval 330 minute)) between 12 and 17" 
      elsif(timeday=='evening')
        sql_str = "AND (hour(pickup_date + Interval 330 minute)) between 18 and 23" 
      elsif(timeday=='night')
        sql_str = "AND (hour(pickup_date + Interval 330 minute)) between 0 and 5" 
      end
    end

    if(lead_source=='all')
      lead_str = ''
    else
      if(lead_source=='incoming_direct_calls')
        lead_str = "AND lead_source = 'incoming_direct_calls'" 
      elsif(lead_source=='online_sources')
        lead_str = "AND lead_source in ('sulekha', 'askme', 'quickr', 'desktop_website', 'email', 'justdial', 'mobile_website')" 
      elsif(lead_source=='apps')
        lead_str = "AND lead_source in ('android_app', 'mobile_app', 'iphone_app', 'blackberry_app')" 
      elsif(lead_source=='corporate')
        lead_str = "AND lead_source in ('affiliates', 'makemytrip', 'b2b')" 
      elsif(lead_source=='other_sources')
        lead_str = "AND (lead_source in ('ola_share', 'outgoing_calls', 'other_sources') or lead_source is null)" 
      end
    end

    sql = %Q{select id,crn,pickup_date+Interval 330 minute pickup_date,pickup_location,phone_mobile, customer_email
          from ola_bookings 
          where id in ('#{booking_id}') #{sql_str} #{lead_str} ;}
    begin  
      $client.with do |conn|
       res =  conn.query(sql)
      end
    rescue Exception => e
      p e
    end
    res
  end
end
