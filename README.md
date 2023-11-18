# proj_backend
```http
  POST /addPatient
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `account_address` | `address` | **Required**. Address of the user. From Metamask |
| `user_name` | `string` | **Required**. Username |
| `patient_name` | `string` | **Required**. Name of the patient |
| `gender` | `string` | **Required**. Gender of the user |
| `dob` | `unit` | **Required**. Date of Birth |
| `created_at` | `uint` | **Required**. Creation time of the account |

```http
  POST /addRecord
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `uint` | **Required**. ID for record |
| `user_address` | `address` | **Required**. Address of the user. From Metamask. |
| `title` | `string` | **Required**. Title of the record |
| `date` | `uint` | **Required**.Date of the record |
| `filename` | `string` | **Required**. Filename |
| `created_at` | `uint` | **Required**. Creation time of the account |
| `file` | `file` | **Required**. File |
