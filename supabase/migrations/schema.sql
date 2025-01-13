create table users (
  id serial primary key,
  email text not null unique,
  created_at timestamp default current_timestamp
);

create table habits (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
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
