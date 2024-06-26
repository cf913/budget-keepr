-- 3am or 4am Brisbane time every day
-- UTC+10 or UTC+11 depending on daylight savings
select cron.schedule('recurring-service', '0 17 * * *', 'SELECT calculate_recurrings()');
