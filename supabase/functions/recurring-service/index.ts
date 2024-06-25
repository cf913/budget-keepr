import { createClient } from "https://esm.sh/@supabase/supabase-js";

Deno.serve(async (req: Request) => {
  try {
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
    console.log("^======= recurring service =======^");
    console.log(data);
    console.log(`today: ${today.toISOString()}`);

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
