CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	login character (50) UNIQUE NOT NULL,
	password character (50) NOT NULL,
	age smallint NOT NULL,
	"isDeleted" boolean DEFAULT FALSE
);
