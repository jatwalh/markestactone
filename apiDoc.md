   <== for accurate result use correct name of the CITY and COUNTRY
    give best result in india as coutry with any city because almost all airports of 
    india are in Database and data of the coutries are limited ==>

< == How to run this project on LOCAL MODE ==>

Step 1. download the zip file and unzip it , navigate to the root folder
Step 2. open the project's root folder in terminal,
Step 3. install node modules by ruuing the command "npm install" in terminal
Step 4. now run the project by run the command "npm run dev"  in terminal
step 5. and the loacl address is this http://localhost:3000 

1. Search nearest airport by entring city and country

    url :- http://localhost:3000/airports/nearby?city={cityname}&country={country}

    example url :   http://localhost:3000/airports/nearby?city=delhi&country=india
                    http://localhost:3000/airports/nearby?city=kurukshetra&country=india


2 . get all airport of any country 

    url :- http://localhost:3000/airports/findairport/countryname 

    example url :     http://localhost:3000/airports/findairport/india
                      http://localhost:3000/airports/findairport/nepal 
                      http://localhost:3000/airports/findairport/australia

3. find the list of the all airport of the our database  

    url :- http://localhost:3000/airports/findall

    

< ========= How to run this project on LIVE MODE ===========>

** i have deployed this project on Free instances of render with speed of  only 0.1 cpu
    so if reloading gose on , it will take minimun 50 sec or more to restart the peoject so plz wait
    if not wokring then check the project on local mode ***

Root Address :  https://markestactone.onrender.com/

1. Search nearest airport by entring city and country

    url :- https://markestactone.onrender.com/airports/nearby?city={cityname}&country={country}

    example url :   https://markestactone.onrender.com/airports/nearby?city=delhi&country=india
                    https://markestactone.onrender.com/nearby?city=kurukshetra&country=india


2 . get all airport of any country 

    url :- https://markestactone.onrender.com//airports/findairport/countryname 

    example url :     https://markestactone.onrender.com/airports/findairport/india
                      https://markestactone.onrender.com/airports/findairport/nepal 
                      https://markestactone.onrender.com/airports/findairport/australia

3. find the list of the all airport of the our database  

    url :- https://markestactone.onrender.com/airports/findall