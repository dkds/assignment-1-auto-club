create table car_make (
  id serial primary key,
  name text not null
);

create table car_model (
  id serial primary key,
  name text not null,
  car_make_id integer not null references car_make
);

create table member (
  id serial primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  car_model_id integer not null references car_model,
  vin text not null,
  manufactured_date timestamptz not null,
  age_of_vehicle smallint not null default 0,
  created_at timestamptz NOT NULL DEFAULT now()
);