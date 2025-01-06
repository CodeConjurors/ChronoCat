# ChronoCat

## Starting the backend

- In the `backend` directory, run the command:

    ```
    mvn spring-boot:run
    ```

## Deploying the backend to Render

1. Package the backend into a JAR file by running in the `backend` directory:

    ```
    mvn clean package
    ```

2. Build a Docker image by running in the `backend` directory:

    ```
    docker build -t chronocat-backend .
    ```

3. Tag the Docker image correctly for uploading to Docker hub by running in the `backend` directory:

    ```
    docker tag chronocat-backend OUR-DOCKER-HUB-ACCOUNT-NAME/chronocat-backend
    ```

4. Upload the image to Docker hub by running in the `backend` directory:

    ```
    docker push OUR-DOCKER-HUB-ACCOUNT-NAME/chronocat-backend:latest
    ```

5. Go to our [Render dashboard](https://dashboard.render.com), select the application there, click `Manual Deploy` on the top right corner and select `Deploy latest reference`
