import { createClient } from "supabase-js";
import dayjs from "https://esm.sh/dayjs";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// brisbane timezone
const TIMEZONE = "Australia/Brisbane";

Deno.serve(async (req: Request) => {
  try {
    console.log("^======= recurring service =======^");
    const body = await req.json();

    console.log("BODY", JSON.stringify(body, null, 2));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data, error } = await supabase.from("recurring").select("*");

    const today = new Date();
    console.log(data);
    console.log(`today: ${today.toISOString()}`);
    const todayBrisbaneTime = dayjs(today).tz(TIMEZONE);
    console.log(`todayBrisbaneTime: ${todayBrisbaneTime.format()}`);

    if (error) {
      console.log(error);
      throw error;
    }

    return new Response(JSON.stringify({ data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

// curl --request POST 'https://jgewlgweozgpouputpjs.supabase.co/functions/v1/recurring-service' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZXdsZ3dlb3pncG91cHV0cGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyMjIyMjgsImV4cCI6MjAzMDc5ODIyOH0.gO6C0YljWX7m1XLwjzbPMQRsv7Dwbw0tRuIXyp84RB0' \
//   --header 'Content-Type: application/json'
