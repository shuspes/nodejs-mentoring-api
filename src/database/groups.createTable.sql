CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS groups (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name varchar (50) NOT NULL,
	permissions varchar[]
);

-- possible permissions: READ, WRITE, DELETE, SHARE, UPLOAD_FILES
