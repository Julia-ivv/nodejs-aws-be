create extension if not exists "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price real,
	image text 
);

create table stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into products (title, description, price, image) values
('Oranges', 'Oranges', 50, 'https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'),
('Strawberry', 'Strawberry', 60, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'),
('tangerines', 'tangerines', 45, 'https://images.unsplash.com/photo-1577041249022-26cc744ddda3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80'),
('Papaya', 'Papaya', 90, 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'),
('lemon', 'lemon', 30, 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'),
('blueberry', 'blueberry', 150, 'https://images.unsplash.com/photo-1425934398893-310a009a77f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80'),
('pineapple', 'pineapple', 120, 'https://images.unsplash.com/photo-1478005344131-44da2ded3415?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'),
('banana', 'banana', 50, 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1109&q=80'),
('raspberry', 'raspberry', 100, 'https://images.unsplash.com/photo-1577003833619-76bbd7f82948?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')

insert into stocks (product_id, count) values
('48d1c192-e84f-4a48-95e7-f023cf7be0c4', 52),
('dac64f10-3b56-4bd0-9163-b0738f56e41e', 46),
('527fdf02-4c6a-4279-b324-3d02eec77f77', 45),
('e5cf883e-5040-4a86-803d-e997fc842e62', 145),
('9aeb0c51-782b-4354-9f4c-c62d8c179373', 55),
('49acc4b7-d2a9-45a4-9534-5c4fa9af802e', 98),
('f394f71d-1cd7-498a-99e1-67f2fc0d2ec5', 84),
('57ec5d2a-c52d-4cc2-9bb6-dac147584034', 13),
('4160df6c-ef8b-4e6b-a378-6ca64b5b64ba', 89)

