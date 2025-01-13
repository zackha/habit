create extension if not exists pgcrypto;

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamp default current_timestamp
);

create table habits (
  id serial primary key,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  target_days integer default 40,
  created_at timestamp default current_timestamp
);

create table habit_records (
  id serial primary key,
  habit_id integer references habits(id) on delete cascade,
  completed_at date not null,
  created_at timestamp default current_timestamp
);

create index idx_completed_at on habit_records (completed_at);
create index idx_habit_id on habit_records (habit_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = 'public'
as $$
begin
  if not exists (select 1 from public.users where id = new.id) then
    insert into public.users (id, email, created_at)
    values (new.id, new.email, current_timestamp);
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
