# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "Naw",
  "password": "*****",
  "name": "Mohammad Nawawi"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "Naw",
    "name": "Mohammad Nawawi"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must not blank! ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "Naw",
  "password": "*****"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "Naw",
    "name": "Mohammad Nawawi",
    "token": "token"
  }
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :

- Authorization : token

Response Body (Success) :

```json
{
  "data": {
    "username": "Naw",
    "name": "Mohammad Nawawi"
  }
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Body :

```json
{
  "name": "Mohammad Nawawi", //if needed
  "password": "*****" //if needed
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "Naw",
    "name": "Mohammad Nawawi"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :

- Authorization : token

```json
{
  "data": true
}
```
