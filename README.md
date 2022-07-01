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
> 전화번호 인증
>### Request
> ```console
>POST /v1/user/phone
>```
>### Response
> ```console
>{
>   "phone": "010-1233-1233",
>    "name": "허동욱"
>}
>```
> ----------


> 회원가입
>

> 로그인

> 회원정보 조회

> 토큰 리프레쉬

> 비밀번호 재설정

> 비밀번호 변경