# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :

- Authorization : token

Request Body :

```json
{
  "first_name": "Mohammad",
  "last_name": "Nawawi",
  "email": "fromnaw@naw.id",
  "phone": "1234567890"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Nawawi",
    "email": "fromnaw@naw.id",
    "phone": "1234567890"
  }
}
```

## Get Contact

Endpoint : GET /api/contacts/{idContact}

Request Header :

- Authorization : token

Response Body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Nawawi",
    "email": "fromnaw@naw.id",
    "phone": "1234567890"
  }
}
```

## Update Contact

Endpoint : PUT /api/contacts/{idContact}

Request Header :

- Authorization : token

Request Body :

```json
{
  "first_name": "Mohammad",
  "last_name": "Nawawi",
  "email": "fromnaw@naw.id",
  "phone": "1234567890"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Nawawi",
    "email": "fromnaw@naw.id",
    "phone": "1234567890"
  }
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/{idContact}

Request Header :

- Authorization : token

Response Body :

```json
{
  "data": true
}
```

## Search Contact

Endpoint : GET /api/contacts

Request Header :

- Authorization : token

Query Parameter :

- name : string, search firstname or lastname
- email : string, search email
- phone : string, search phone
- page : number, default 1
- size : number, default 10

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Mohammad",
      "last_name": "Nawawi",
      "email": "fromnaw@naw.id",
      "phone": "1234567890"
    },
    {
      "id": 2,
      "first_name": "Mohammad",
      "last_name": "Nawawi",
      "email": "fromnaw@naw.id",
      "phone": "1234567890"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
