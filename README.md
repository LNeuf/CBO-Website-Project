# CBO-Web-Project
 Project done for CMPT 353
 
 A Full Stack website developed for CMPT 353. Contains 2 Parts: partA and partD.
 Only difference between the two is the database used. partA uses MySQL and partD uses MongoDB.
 
 The architecture is MySQL/MongoDB database <-> nodejs server <-> HTML client.

The targetted purpose of the website is to be a staff and customer management system for a Community Based Organization (CBO).
This would include organizations like charities and non-profits so the customer in this case would be the benefactors of this organization's charity.

Primary Responsibilities: Front-end programmer

Main Page:
![image](https://user-images.githubusercontent.com/61331076/156946221-b8e79f05-5da0-4de6-96f2-8d617845f566.png)

Customer Page:
![image](https://user-images.githubusercontent.com/61331076/156946278-cfe0c32e-b5a9-4e26-b2fb-39544dcfcb75.png)
![image](https://user-images.githubusercontent.com/61331076/156946316-aa41dc75-c164-476d-9209-d91ba324db94.png)
![image](https://user-images.githubusercontent.com/61331076/156946330-567d1d89-c25d-42cf-9e8c-d3991c08f484.png)

Staff Page:
![image](https://user-images.githubusercontent.com/61331076/156946301-3327fd7e-c29f-4c95-aef4-d5e88e783ae0.png)



partA:
To run, requires Docker
 1. Navigate to partA directory
 2. Paste command: docker-compose up -d 
 3. Paste command: docker exec -it db1 bash
 4. Paste command: mysql -uroot -padmin
 5. Paste contents of sql_table_initialize.txt into shell
 6. Check localhost/main_page.html to see if successful
