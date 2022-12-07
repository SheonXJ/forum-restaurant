<h1>
  <div>
  forum-restaurant(<a href="https://hidden-badlands-15238.herokuapp.com/signin">Live Demo</a>)
  </div>
</h1>

此為簡易餐廳論壇，主要使用`Bootstrap`搭配`Express`，Demo資料庫使用AWS RDS建立`MySQL`。

使用者可以建立餐廳，對特定餐廳進行留言及收藏餐廳。

並設有後台管理功能，可以針對餐廳、留言、分類等資料進行管理。

# 目錄<!-- omit in toc -->
- [安裝流程](#安裝流程)
    - [`Github-Repo`](#github-repo)
    - [`Docker-Image` \& `Docker-compose`](#docker-image--docker-compose)
- [種子資料](#種子資料)

# 安裝流程

提供兩種安裝方式，可以透過`Github`下載專案在本地測試，也可以透過`Docker`直接拉取`image`進行測試。

### `Github-Repo`

  * 利用終端機(Terminal)，Clone專案至目標位置
    ```
    git clone https://github.com/SheonXJ/forum-restaurant.git
    ```

  * 進入專案資料夾後，安裝 npm packages
    ```
    npm install
    ```
  
  * 在專案根目錄將檔案`.enx.example`改為`.env`，並設定環境變數
    ```
    IMGUR_CLIENT_ID=<client-ID>
    JWT_SECRET=<secret>
    ```
    
  * 使用MySQL建立本地資料庫
    ```
    drop database if exists forum_demo;
    create database forum_demo;
    use forum_demo;
    ```
    
  * 使用MySQL建立新使用者及設定權限
    ```
    CREATE USER 'DevAuth'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON . TO 'DevAuth'@'localhost';
    ```
    
  * 建立資料表及產生種子資料
    ```
    npx sequelize db:migrate && npx sequelize db:seed:all
    ```

  * 開啟伺服器
    ```
    npm run dev
    ```


### `Docker-Image` & `Docker-compose`

  `開發模式`

  * 利用終端機(Terminal)，Clone專案至目標位置
    ```
    git clone https://github.com/SheonXJ/forum-restaurant.git
    ```
    
  * 在專案根目錄將檔案`.enx.example`改為`.env`，並設定環境變數
    ```
    IMGUR_CLIENT_ID=<client-ID>
    JWT_SECRET=<secret>
    platform=linux/amd64
    ```
    * 如果使用Mac M1等arm64架構，第三行需改為`platform=linux/arm64`
    
  * 進入專案資料夾後，執行docker-compose
    ```
    docker-compose up -d
    ```
    
  * 建立資料表及產生種子資料(App container的terminal)
    ```
    npx sequelize db:migrate && npx sequelize db:seed:all
    ```
      
  `測試模式`
  
  * 運行資料庫
  
    * 建立docker network
      ```
      docker network create restaurant-app
      ```
      
    * 運行MySQL container
      ```
      docker run -dp 3306:3306 \
        --network restaurant-app --network-alias DockerMysql \
        -v res-data:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=password \
        -e MYSQL_DATABASE=forum_demo \
        mysql:8 \
        --lower_case_table_names=1
      ```

  * 運行App
  
    * 下載Docker image
      ```
      docker pull sheonzeng/restaurant-app
      ```
      
    * 建立Container
      ```
      docker run -dp 3000:3000 \
        --network restaurant-app \
        -e NODE_ENV=dockerDev \
        sheonzeng/restaurant-app
      ```
      
  * 建立資料表及產生種子資料
  
    * 進入App container在terminal輸入指令
      ```
      npx sequelize db:migrate && npx sequelize db:seed:all
      ```
  

# 種子資料
  ```
  name: root
  email: root@example.com
  password: 12345678
  ```

  ```
  name: User1
  email: user1@example.com
  password: 12345678
  ```

  ```
  name: User2
  email: user2@example.com
  password: 12345678
  ```
  