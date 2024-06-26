
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "cron";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";

CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

ALTER TYPE "public"."pricing_type" OWNER TO "postgres";

CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);

ALTER TYPE "public"."subscription_status" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."sub_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying NOT NULL,
    "parent_id" "uuid",
    "user_id" "uuid",
    "budget_id" "uuid"
);

ALTER TABLE "public"."sub_categories" OWNER TO "postgres";

COMMENT ON TABLE "public"."sub_categories" IS 'Sub category (Woolies, Maccas, Uber Eats, ...)';

CREATE OR REPLACE FUNCTION "public"."fuzzy_search"("search_text" "text") RETURNS SETOF "public"."sub_categories"
    LANGUAGE "plpgsql"
    AS $$ begin return query select * from sub_categories where to_tsvector(sub_categories.name) @@ to_tsquery(search_text); end; $$;

ALTER FUNCTION "public"."fuzzy_search"("search_text" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  begin
    insert into public.users (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
  end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."budgets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying NOT NULL,
    "owner_id" "uuid",
    "team_id" "uuid"
);

ALTER TABLE "public"."budgets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "color" "text" DEFAULT '#000000'::"text" NOT NULL,
    "budget_id" "uuid"
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

COMMENT ON TABLE "public"."categories" IS 'Entry category (Restaurant, Take Out, ...)';

COMMENT ON COLUMN "public"."categories"."color" IS 'Category Color';

CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" NOT NULL,
    "stripe_customer_id" "text"
);

ALTER TABLE "public"."customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "udpated_at" timestamp with time zone DEFAULT "now"(),
    "amount" integer NOT NULL,
    "category_id" "uuid",
    "sub_category_id" "uuid",
    "note" character varying,
    "year" smallint,
    "month" smallint,
    "week" smallint,
    "day" smallint,
    "budget_id" "uuid" DEFAULT "gen_random_uuid"(),
    "user_id" "uuid"
);

ALTER TABLE "public"."entries" OWNER TO "postgres";

COMMENT ON TABLE "public"."entries" IS 'Budget entries';

CREATE TABLE IF NOT EXISTS "public"."members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team_id" "uuid",
    "user_id" "uuid"
);

ALTER TABLE "public"."members" OWNER TO "postgres";

COMMENT ON TABLE "public"."members" IS 'users in a team';

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "product_id" "text",
    "active" boolean,
    "description" "text",
    "unit_amount" bigint,
    "currency" "text",
    "type" "public"."pricing_type",
    "interval" "public"."pricing_plan_interval",
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" "jsonb",
    CONSTRAINT "prices_currency_check" CHECK (("char_length"("currency") = 3))
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean,
    "name" "text",
    "description" "text",
    "image" "text",
    "metadata" "jsonb"
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recurring" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "budget_id" "uuid",
    "start_at" timestamp with time zone,
    "next_at" timestamp with time zone,
    "sub_category_id" "uuid",
    "amount" integer,
    "frequency" "text",
    "active" boolean
);

ALTER TABLE "public"."recurring" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."subscription_status",
    "metadata" "jsonb",
    "price_id" "text",
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "cancel_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "canceled_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."teams" OWNER TO "postgres";

COMMENT ON TABLE "public"."teams" IS 'a team is a group of users sharing a budget';

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "billing_address" "jsonb",
    "payment_method" "jsonb",
    "email" character varying,
    "is_admin" boolean
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."budgets"
    ADD CONSTRAINT "budgets_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."budgets"
    ADD CONSTRAINT "budgets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "category_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."entries"
    ADD CONSTRAINT "entries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recurring"
    ADD CONSTRAINT "recurring_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."budgets"
    ADD CONSTRAINT "budgets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."budgets"
    ADD CONSTRAINT "budgets_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."entries"
    ADD CONSTRAINT "entries_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id");

ALTER TABLE ONLY "public"."entries"
    ADD CONSTRAINT "entries_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");

ALTER TABLE ONLY "public"."entries"
    ADD CONSTRAINT "entries_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id");

ALTER TABLE ONLY "public"."entries"
    ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");

ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");

ALTER TABLE ONLY "public"."recurring"
    ADD CONSTRAINT "recurring_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id");

ALTER TABLE ONLY "public"."recurring"
    ADD CONSTRAINT "recurring_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id");

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id");

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id");

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

CREATE POLICY "Can only view own subs data." ON "public"."subscriptions" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Can update own user data." ON "public"."users" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Can view own user data." ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Enable ALL for team members" ON "public"."categories" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM ("public"."members"
     JOIN "public"."budgets" ON (("budgets"."id" = "categories"."budget_id")))
  WHERE ("members"."team_id" = "budgets"."team_id"))));

CREATE POLICY "Enable ALL for team members" ON "public"."recurring" USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM ("public"."members"
     JOIN "public"."budgets" ON (("budgets"."id" = "recurring"."budget_id")))
  WHERE ("members"."team_id" = "budgets"."team_id"))));

CREATE POLICY "Enable ALL for team members" ON "public"."sub_categories" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM ("public"."members"
     JOIN "public"."budgets" ON (("budgets"."id" = "sub_categories"."budget_id")))
  WHERE ("members"."team_id" = "budgets"."team_id"))));

CREATE POLICY "Enable All for team members" ON "public"."entries" USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM ("public"."members"
     JOIN "public"."budgets" ON (("budgets"."id" = "entries"."budget_id")))
  WHERE ("members"."team_id" = "budgets"."team_id"))));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."entries" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all authenticated users" ON "public"."members" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for budget owner" ON "public"."budgets" FOR SELECT TO "authenticated" USING (("owner_id" = "auth"."uid"()));

CREATE POLICY "Enable read for team members" ON "public"."entries" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM ("public"."members"
     JOIN "public"."budgets" ON (("budgets"."id" = "entries"."budget_id")))
  WHERE ("members"."team_id" = "budgets"."team_id"))));

CREATE POLICY "Enable select for authenticated users" ON "public"."categories" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Policy with table joins" ON "public"."budgets" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") IN ( SELECT "members"."user_id"
   FROM "public"."members"
  WHERE ("members"."team_id" = "budgets"."team_id"))));

ALTER TABLE "public"."budgets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."entries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recurring" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sub_categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."prices";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."products";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."sub_categories" TO "anon";
GRANT ALL ON TABLE "public"."sub_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."sub_categories" TO "service_role";

GRANT ALL ON FUNCTION "public"."fuzzy_search"("search_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fuzzy_search"("search_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fuzzy_search"("search_text" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."budgets" TO "anon";
GRANT ALL ON TABLE "public"."budgets" TO "authenticated";
GRANT ALL ON TABLE "public"."budgets" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";

GRANT ALL ON TABLE "public"."entries" TO "anon";
GRANT ALL ON TABLE "public"."entries" TO "authenticated";
GRANT ALL ON TABLE "public"."entries" TO "service_role";

GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."recurring" TO "anon";
GRANT ALL ON TABLE "public"."recurring" TO "authenticated";
GRANT ALL ON TABLE "public"."recurring" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
