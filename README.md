   <== for accurate result use correct name of the CITY and COUNTRY
    give best result in india as coutry with any city because almost all airports of 
    india are in Database and data of the coutries are limited ==>

    ** i have deployed this project on Free instances of render with speed of  only 0.1 cpu
    so if reloading gose on , it will take minimun 50 sec or more to restart the peoject so plz wait
    if not wokring then check the project on local mode ***

< == How to run this project on LOCAL MODE ==>

Step 1. download the zip file and unzip it , navigate to the root folder
Step 2. open the project's root folder in terminal,
Step 3. install node modules by ruuing the command "npm install" in terminal
Step 4. now run the project by run the command "npm run dev"  in terminal
step 5. and the loacl address is this http://localhost:3000 

< == UI routes by using EJS template ==>

    <*** for local mode ***>
    Home URL : http://localhost:3000/     

    where you can serach the airport by city and respective country 
    got airports with 300 kms of area with limt of 5

    <*** for Live mode ***>

    https://markestactone.onrender.com/ 

    it takes time to laod the app as it is live on free instances with  with speed of  only 0.1 cpu so plz wait to open it 
    if not opeinf then check on local mode



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


<<<<***************** if root address takes more time then hit this link first ***************>>>>

    https://markestactone.onrender.com/airports/nearby?city=delhi&country=india

    as it just a light weigth data request link once it opens , hit the Root Address

1. Search nearest airport by entring city and country

    url :- https://markestactone.onrender.com/airports/nearby?city={cityname}&country={country}

    example url :   https://markestactone.onrender.com/airports/nearby?city=delhi&country=india
                    https://markestactone.onrender.com/airports/nearby?city=kurukshetra&country=india


2 . get all airport of any country 

    url :- https://markestactone.onrender.com//airports/findairport/countryname 

    example url :     https://markestactone.onrender.com/airports/findairport/india
                      https://markestactone.onrender.com/airports/findairport/nepal 
                      https://markestactone.onrender.com/airports/findairport/australia

3. find the list of the all airport of the our database  

    url :- https://markestactone.onrender.com/airports/findall


    


Base url for localmode :     http://localhost:3000 
base url of render live mode :   https://markestactone.onrender.com/



  WORKFLOW: Nearest Airport Finder & Airport Search

ROUTE 1: Nearest Airports by City & Country
-------------------------------------------
1. User opens Home Page
        |
2. User selects a Country
        |
3. API fetches and populates Cities dropdown based on selected Country
        |
4. User selects a City and clicks "Find Airport" button
        |
5. API returns nearest airports:
        - Within 300 KM of selected city
        - Sorted in ascending order by distance
        |
6. User sees list of nearest airports
        |
        ---> END

ROUTE 2: Airport Search (Full List)
-----------------------------------
1. User opens Home Page
        |
2. User clicks "Go to Search Page" button
        |
3. Navigated to Search Page
        |
4. Full list of airports is displayed
        |
5. User can use Search Input:
        - Performs wildcard search (e.g., partial names, codes)
        - Filters airport list in real-time
        |
6. User sees filtered search results
        |
        ---> END

