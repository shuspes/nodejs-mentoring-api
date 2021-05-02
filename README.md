# nodejs-mentoring-api

## npm scripts:

* **npm run dev** to run app locally

* **npm run eslint** to run eslint audit

## Database:

* **database/users.createTable.sql** to create **users** table
* **database/users.insertInitialData.sql** to add initial contend to **users** table
* **database/users.deleteTableContent.sql** to clean **users** table
* **database/users.dropTable.sql** to delete **users** table

---

* **database/groups.createTable.sql** to create **groups** table
* **database/groups.insertInitialData.sql** to add initial contend to **groups** table
* **database/groups.deleteTableContent.sql** to clean **groups** table
* **database/groups.dropTable.sql** to delete **groups** table

---

* **database/userGroup.createTable.sql** to create **user_group** table
* **database/userGroup.insertInitialData.sql** to add initial contend to **user_group** table
* **database/userGroup.deleteTableContent.sql** to clean **user_group** table
* **database/userGroup.dropTable.sql** to delete **user_group** table

## .env file template:
PORT=  
DATABASE_DIALECT=  
DATABASE_HOST=  
DATABASE_PORT=  
DATABASE_DB_NAME=  
DATABASE_USER=  
DATABASE_PASSWORD=  
DATABASE_USERS_TABLE_NAME=  
DATABASE_GROUPS_TABLE_NAME=  

## CURL API calls examples:

### Users route:

#### Notes:

* User id is generated by application and cannot be changed or created by requests

#### Methods:

* **GET** get all users - curl -i http://localhost:3000/users | npx json

* **GET** get user by id - curl -i http://localhost:3000/users/ac34d1e0-8ffe-11eb-a8b3-0242ac130001 | npx json

* **POST** create user - curl -i -X POST -H "Content-Type: application/json" -d "{\"login\": \"user-5-new\", \"password\": \"P@ssw0rd\", \"age\": 56}" http://localhost:3000/users | npx json

* **PUT** update user - curl -i -X PUT -H "Content-Type: application/json" -d "{\"login\": \"user-2-updated\", \"password\": \"U$er@1\", \"age\": 56}" http://localhost:3000/users/ac34d83e-8ffe-11eb-a8b3-0242ac130002 | npx json

* **GET** get auto suggest users - curl -i http://localhost:3000/users/use/10 | npx json

* **DELETE** remove user - curl -i -X DELETE http://localhost:3000/users/ac34d1e0-8ffe-11eb-a8b3-0242ac130001 | npx json

#### Testing of unexpected usage:

* **POST** create user with extra argument and boolean login - curl -i -X POST -H "Content-Type: application/json" -d "{\"test-param\": \"some test param\", \"login\": true, \"password\": \"P@ssw0rd\", \"age\": 67}" http://localhost:3000/users | npx json

* **PUT** update user with extra argument, without age and not valid password - curl -i -X PUT -H "Content-Type: application/json" -d "{\"test-param\": \"some test param\", \"login\": \"user-2-updated\", \"password\": \"u$eR@\"}" http://localhost:3000/users/ac34d83e-8ffe-11eb-a8b3-0242ac130002 | npx json

### Groups route:

#### Methods:

* **GET** get all groups - curl -i http://localhost:3000/groups | npx json

* **GET** get group by id - curl -i http://localhost:3000/groups/d29e2030-a9e3-11eb-bcbc-0242ac130002 | npx json

* **POST** create group - curl -i -X POST -H "Content-Type: application/json" -d "{\"name\": \"group-5-new\", \"permissions\": [\"READ\", \"SHARE\", \"UPLOAD_FILES\"]}" http://localhost:3000/groups | npx json

* **PUT** update group - curl -i -X PUT -H "Content-Type: application/json" -d "{\"permissions\": [\"UPLOAD_FILES\"]}" http://localhost:3000/groups/d29e2030-a9e3-11eb-bcbc-0242ac130001 | npx json

* **DELETE** remove group - curl -i -X DELETE http://localhost:3000/groups/d29e2030-a9e3-11eb-bcbc-0242ac130004 | npx json

* **POST** add users to group - curl -i -X POST -H "Content-Type: application/json" -d "[\"ac34d1e0-8ffe-11eb-a8b3-0242ac130004\", \"ac34d83e-8ffe-11eb-a8b3-0242ac130002\"]" http://localhost:3000/groups/d29e2030-a9e3-11eb-bcbc-0242ac130003/users | npx json