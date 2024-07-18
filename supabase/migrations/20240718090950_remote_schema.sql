create policy "Give anon users read access to images in folder avatars"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'avatars'::text) AND (lower((storage.foldername(name))[1]) = 'avatars'::text) AND (auth.role() = 'anon'::text)));


create policy "Give users authenticated access to folder avatars 1oj01fe_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = 'avatars'::text) AND (auth.role() = 'authenticated'::text)));



