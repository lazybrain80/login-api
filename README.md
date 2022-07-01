# login-api

## Requirement

1. node ^16.15.1
2. npm >= 6.0.0
-----------------
## 설치/실행 방법

```console
npm install
npm start
```
-----------------
## API 설명
> ### 전화번호 인증
>#### Request
> ```console
>POST /v1/user/phone HTTP/1.1
>Content-Type: application/json
>{
>    "phone": "010-1233-1233",
>    "name": "허동욱"
>}
>```
>#### Response
> ```console
> Set-Cookie: phone-auth-token=<token>; Path=/; HttpOnly; Expires=Fri, 01 Jul 2022 21:24:13 GMT;
> 
> body
>{
>   "phone": "010-1233-1233",
>    "name": "허동욱"
>}
>```
> ----------


>### 회원가입
>#### Request
> ```console
>POST /v1/user HTTP/1.1
>Cookie: phone-auth-token=<token>
>Content-Type: application/json
>{
>    "email": "advdf@hamel.com",
>    "password": "interpark1!",
>    "checkPassword": "interpark1!",
>    "nickname": "ddkdkdkd"
>}
>```
>#### Response
> ```console
> body
>{
>   "phone": "010-1233-1233",
>    "name": "허동욱"
>}
>```
> ----------

>### 로그인
>#### Request
> ```console
>POST /v1/signin HTTP/1.1
>Content-Type: application/json
>{
>    "email": "advdf@hamel.com",
>    // or
>    //"phone": "010-1233-1233",
>    //"username": "허동욱",
>    "password": "interpark1!"
>}
>```
>#### Response
> ```console
> Set-Cookie: ably-token=<token>; Path=/; HttpOnly; Expires=Fri, 01 Jul 2022 21:24:13 GMT;
> 
> body
>{
>   "phone": "010-1233-1233",
>    "name": "허동욱"
>}
>```
> ----------

>### 회원정보 조회
>#### Request
> ```console
>GET /v1/user/<user-id> HTTP/1.1
>Cookie: ably-token=<token>
>Content-Type: application/json
>```
>#### Response
> ```console
> body
>{
>    "email": "advdf@hamel.com",
>    "username": "허동욱",
>    "nickname": "ddkdkdkd",
>    "phone": "010-1233-1233"
>}
>```
> ----------

>### 토큰 리프레쉬
>#### Request
> ```console
>GET /v1/user/<user-id>/token/refresh HTTP/1.1
>Cookie: ably-token=<token>
>Content-Type: application/json
>```
>#### Response
> ```console
> Set-Cookie: ably-token=<token>; Path=/; HttpOnly; Expires=Fri, 01 Jul 2022 21:24:13 GMT;
> body
>{
>    "access_token": "<access_token>",
>    "refresh_token": "<refresh_token>"
>}
>```
> ----------

>### 비밀번호 재설정
>#### Request
> ```console
>DELETE /v1/user/password HTTP/1.1
>Cookie: phone-auth-token=<token>
>```
>#### Response
> ```console
> 
> body
>{
>    "tmp_password": "TejZ0WbhMD49zwNx"
>}
>```
> ----------

>### 비밀번호 변경
>#### Request
> ```console
>POST /v1/user/password HTTP/1.1
>Cookie: ably-token=<token>
>{
>    "password": "interpark1!",
>    "checkPassword": "interpark1!"
>}
>```
>#### Response
> ```console
> Set-Cookie: ably-token=<token>; Path=/; HttpOnly; Expires=Fri, 01 Jul 2022 21:24:13 GMT;
> body
>{}
>```
> ----------