CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	login varchar (50) UNIQUE NOT NULL,
	password varchar (50) NOT NULL,
	age smallint NOT NULL,
	"isDeleted" boolean DEFAULT FALSE
);
