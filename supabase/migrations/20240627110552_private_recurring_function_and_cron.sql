create schema if not exists "private";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.calculate_recurrings()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  declare
    number_of_results int := 0;
    now text;
    time_zone text := 'Australia/Brisbane';
    uuser_id uuid := '74dffe01-1824-4118-a205-87bace940e3a'; -- chad gmail
    nnext_at text;
    r record;
  begin
    -- get now()
    SET TIMEZONE = 'Australia/Brisbane';
    SELECT NOW() into now;
    -- get all recurring with next_at same day as now Autralia/Brisbane
    -- for each recurring
    FOR r in SELECT id, frequency, next_at, amount, sub_category_id, category_id, budget_id, EXTRACT('year' FROM next_at) AS year, EXTRACT('month' FROM next_at) AS month, EXTRACT('week' FROM next_at) AS week, EXTRACT('day' FROM next_at) AS day  from recurring
      WHERE 
        DATE_TRUNC('day', recurring.next_at AT TIME ZONE 'UTC' AT TIME ZONE time_zone) = DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC' AT TIME ZONE time_zone) and active = TRUE
    LOOP
      -- create an entry with all the good stuff
      INSERT INTO entries(user_id, amount, sub_category_id, category_id, budget_id, year, month, week, day)
      VALUES(uuser_id, r.amount, r.sub_category_id, r.category_id, r.budget_id, r.year, r.month, r.week, r.day);
      
      -- calculate next_at
      case r.frequency
		    when 'daily' then
          nnext_at = '1 day';
        when 'weekly' then
          nnext_at = '1 week';
        when 'fortnightly' then
          nnext_at = '2 weeks';
        when 'monthly' then
          nnext_at = '1 month';
        when 'quarterly' then
          nnext_at = '3 months';
        when 'biannually' then
          nnext_at = '6 months';
        when 'yearly' then
          nnext_at = '1 year';
        end case;

      -- update next_at with new next_at  
      UPDATE recurring
      SET next_at = r.next_at + (nnext_at)::INTERVAL
      WHERE id = r.id;
    
      number_of_results := number_of_results + 1;


    END LOOP;

  
    return number_of_results;
  end;
$function$
;



