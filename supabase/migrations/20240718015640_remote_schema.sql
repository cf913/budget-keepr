alter table "public"."users" add column "updated_at" timestamp with time zone;

alter table "public"."users" add column "username" text;

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

create policy "Allow ALL for team members"
on "public"."teams"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT members.user_id
   FROM members
  WHERE (members.team_id = teams.id))));


create policy "Enable READ for authenticated users only"
on "public"."users"
as permissive
for select
to authenticated
using (true);



