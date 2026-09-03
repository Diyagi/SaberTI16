create table category (
    id              serial primary key,
    description     varchar(50) not null,
)

create table product (
    id serial primary key,
    categoryId int references category(id) not null
    description text not null,
    status varchar(20) not null,
    observation text,
    created_at timestampz DEFAULT CURRENT_TIMESTAMP ,
)