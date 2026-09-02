create type public.app_role as enum ('owner', 'admin', 'user');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  user_role app_role not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies to let users manage their own profiles
create policy "Users can view their own profile." on public.profiles
  for select using (auth.id() = id);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);