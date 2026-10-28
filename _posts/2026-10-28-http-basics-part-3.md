---
title: "[HTTP의 기초를 찾아서 - 3편] HTTP Headers"
date: 2026-10-28 11:15:51 +0900
categories: [Network]
tags: [network, http]
description: "HTTP 메시지에 부가 정보를 담는 헤더를 요청·응답·공통 헤더로 나눠 살펴보고, 같은 URI에서 가장 알맞은 표현을 골라 주는 콘텐츠 협상까지 정리했습니다."
image:
  path: /assets/images/posts/http-basics.png
  alt: ""
series: http-basics
series_order: 3
---

<!-- 참고 자료 안내 -->

{: .prompt-info }

> 이 글은 `혼자 공부하는 네트워크` 책과 널널한 개발자님의 `외워서 끝내는 네트워크 핵심이론 - 기초` 강의를 참고해서 작성한 글입니다.

[1편]({% post_url 2026-10-27-http-basics-part-1 %})에서는 HTTP 메시지가 `시작 라인`, `필드 라인`, `메시지 본문`으로 이루어져 있다는 것을 보았고, [2편]({% post_url 2026-10-27-http-basics-part-2 %})에서는 시작 라인에 들어가는 메서드와 상태코드를 정리했습니다.
이번 편에서는 시작 라인 바로 아래에 오는 `필드 라인`, 흔히 `헤더(Header)`라고 부르는 부분을 살펴보겠습니다.
헤더는 종류가 아주 많아서 하나씩 외우기보다는 쓰임새별로 묶어 보는 편이 이해하기 쉽습니다.
이 글에서는 다음 순서로 정리해 보겠습니다.

1. 요청 헤더, 응답 헤더, 요청과 응답 모두에 쓰는 헤더
2. 같은 URI에서 가장 알맞은 형태를 골라 주는 콘텐츠 협상

캐시, 쿠키와 세션, 그리고 실무에서 자주 만나는 헤더는 4편에서 이어서 다루겠습니다.

## **헤더란?**

![요청 메시지에서 시작 라인과 빈 줄 사이에 있는 Host, User-Agent, Accept-Language 세 줄이 헤더이고, 그중 Accept-Language 한 줄을 콜론을 기준으로 필드 이름과 필드 값으로 나눈 그림](/assets/images/posts/http-header-fields.png){: w="3840" h="2160" }
_요청 메시지 안의 헤더와 헤더 한 줄의 구조_

헤더는 시작 라인과 빈 줄 사이에 들어갑니다. 한 줄에 하나씩 `이름: 값` 형태로 적고 이름은 대소문자를 구분하지 않습니다.
요청을 어느 호스트로 보내는지, 본문이 어떤 형식인지, 응답을 저장해 두고 다시 써도 되는지 같은 **부가 정보**가 모두 헤더에 담깁니다.
똑같은 `GET /index.html` 요청이라도 헤더가 다르면 서버가 돌려주는 응답이 달라질 수 있습니다.

## **요청 헤더**

클라이언트가 요청 메시지에 담아 보내는 헤더입니다.

### **Host**

`Host`는 **요청을 보낼 호스트**를 나타냅니다.
보통 도메인 이름을 적고 기본 포트(HTTP는 80, HTTPS는 443)가 아니면 `localhost:8080`처럼 포트 번호도 함께 적습니다.

예를 들어 `http://info.cern.ch/hypertext/WWW/TheProject.html`에 접속하면 요청 메시지는 다음과 같습니다.

```
GET /hypertext/WWW/TheProject.html HTTP/1.1
Host: info.cern.ch
```

1편에서 보았듯이 HTTP/1.1부터 `Host`는 반드시 넣어야 하는 헤더입니다.
서버 한 대(IP 주소 하나)로 여러 도메인의 사이트를 운영하는 경우가 많은데, 서버는 `Host` 값을 보고 어느 사이트로 온 요청인지 구분합니다.

### **User-Agent**

`User-Agent`는 `Host`와 함께 요청 메시지에서 가장 흔히 볼 수 있는 헤더입니다.
`유저 에이전트`란 **웹 브라우저처럼 사용자를 대신해 HTTP 요청을 보내는 클라이언트 프로그램**을 말합니다.

이 헤더에는 요청을 만든 프로그램에 대한 정보가 담깁니다. 운영체제, 브라우저 종류와 버전, 렌더링 엔진 같은 것들입니다.

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0
```

위 값을 풀어 보면 64비트 Windows 10 이상에서 Gecko 엔진을 쓰는 Firefox 109 버전입니다.
서버는 이 값으로 클라이언트의 접속 환경을 짐작합니다. 접속 통계를 내거나 모바일 기기에는 모바일 페이지를 보여 주는 식으로 활용합니다.

다만 `User-Agent`는 클라이언트가 얼마든지 바꿔서 보낼 수 있는 값입니다.
접속 환경을 짐작하는 데는 쓸 수 있지만, 이 값만 믿고 보안과 관련된 판단을 내려서는 안 됩니다.

### **Referer**

`Referer`에는 **클라이언트가 요청을 보내기 직전에 머물던 페이지의 URL**이 담깁니다.
네이버에서 링크를 눌러 구글로 이동하면 구글로 가는 요청에 다음 헤더가 붙습니다.

```
Referer: https://www.naver.com/
```

서버는 이 값으로 사용자가 어디를 거쳐 들어왔는지 알 수 있어서 유입 경로를 분석할 때 많이 씁니다.
`Referer`는 영어 단어 referrer의 철자를 잘못 적은 것입니다. 초기 명세에 이렇게 들어간 탓에 지금까지 그대로 쓰고 있습니다.

이전 페이지의 URL에는 검색어나 회원 번호 같은 정보가 들어 있을 수도 있습니다.
그래서 요즘 브라우저는 다른 사이트로 이동할 때 기본적으로 경로를 빼고 `https://www.naver.com/`처럼 **출처만** 보냅니다. HTTPS 페이지에서 HTTP 페이지로 이동할 때는 아예 보내지 않습니다.
어디까지 보낼지는 서버가 `Referrer-Policy` 응답 헤더로 정할 수 있습니다.

### **Authorization**

`Authorization`은 **클라이언트의 인증 정보**를 담는 헤더입니다.
인증 방식(type)과 인증에 필요한 정보(credentials)를 함께 적습니다.

```
Authorization: <type> <credentials>
```

인증 방식에는 `Basic`, `Bearer`, `Digest` 등 여러 가지가 있고 가장 기본적인 방식은 `Basic`입니다.
`Basic`은 `아이디:비밀번호`처럼 아이디와 비밀번호를 콜론으로 이어 붙이고 이를 `Base64`로 인코딩해 인증 정보로 씁니다.
Base64는 데이터를 알파벳 대소문자, 숫자, `+`, `/`로 이루어진 64개의 문자만으로 표현하도록 바꾸는 인코딩 방식입니다. 길이를 맞추기 위해 끝에 `=`가 붙기도 합니다.

```
아이디 user, 비밀번호 password
→ user:password
→ Base64 인코딩: dXNlcjpwYXNzd29yZA==

Authorization: Basic dXNlcjpwYXNzd29yZA==
```

{: .prompt-warning }
> **Base64는 암호화가 아닙니다.**
> 누구나 디코딩해서 `user:password`를 그대로 꺼낼 수 있습니다. 그래서 `Basic` 방식은 반드시 HTTPS와 함께 써야 합니다.

실무에서 가장 자주 보는 방식은 `Bearer`입니다.
로그인에 성공하면 서버가 발급한 토큰(예: JWT)을 받아 두었다가 요청을 보낼 때마다 이 헤더에 담아 보냅니다.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Bearer는 "소지자"라는 뜻으로, 토큰을 가진 사람에게 권한을 준다는 의미입니다.
토큰이 새어 나가면 누구나 그 토큰으로 요청을 보낼 수 있으니 이 방식도 HTTPS로 주고받아야 합니다.

## **응답 헤더**

서버가 응답 메시지에 담아 보내는 헤더입니다. 2편에서 상태코드와 함께 잠깐 나왔던 헤더도 여기서 다시 정리하겠습니다.

### **Server**

`Server`에는 **요청을 처리한 서버 쪽 소프트웨어**에 대한 정보가 들어 있습니다.

```
Server: Apache/2.4.1 (Unix)
```

위 값을 보면 Unix 운영체제에서 Apache HTTP 서버 2.4.1 버전이 동작하고 있습니다.

그런데 서버 버전을 그대로 드러내면 공격자가 그 버전에 알려진 취약점을 노리기 쉬워집니다.
운영 환경에서는 `Server: nginx`처럼 버전을 빼거나 헤더를 아예 숨기는 경우가 많습니다. Nginx에서는 `server_tokens off` 설정으로 버전을 숨깁니다.

### **Allow**

`Allow`는 **대상 자원에 쓸 수 있는 HTTP 메서드 목록**을 알려 줍니다.
2편에서 다룬 `405 Method Not Allowed`로 응답할 때는 이 헤더를 반드시 함께 보내야 하고 `OPTIONS` 요청의 응답에도 쓰입니다.

```
Request URL: http://127.0.0.1:8080/users/api/token
Request Method: GET
Status Code: 405 Method Not Allowed

<Response Headers>
Allow: POST, OPTIONS
```

위 응답대로라면 이 주소에는 `GET`을 쓸 수 없고 `POST`와 `OPTIONS`만 허용됩니다.

### **Retry-After**

**언제 다시 요청하면 되는지** 알려 주는 헤더가 `Retry-After`입니다.
값으로 날짜와 시각을 적을 수도 있고 몇 초 뒤에 다시 시도하라고 초 단위로 적을 수도 있습니다.

```
Retry-After: Fri, 23 Aug 2024 09:00:00 GMT
Retry-After: 120
```

주로 `503 Service Unavailable`과 함께 씁니다. 503은 "지금은 요청을 처리할 수 없지만 나중에는 가능할 수도 있다"는 뜻이었습니다.
요청을 너무 많이 보냈을 때 돌려주는 `429 Too Many Requests`에도 자주 붙습니다. 클라이언트는 이 시간만큼 기다렸다가 다시 시도하면 됩니다.

### **Location**

`Location`은 **클라이언트에게 자원의 위치를 알려 주는** 헤더입니다.
2편에서 본 것처럼 주로 두 가지 상황에서 씁니다.

- **리다이렉션(3xx)**: 클라이언트가 다시 요청을 보낼 새 URL을 알려 줍니다.
- **자원 생성(201 Created)**: 새로 만들어진 자원의 위치를 알려 줍니다.

```
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/new

HTTP/1.1 201 Created
Location: /users/42
```

3xx 응답에서는 브라우저가 이 주소로 자동으로 다시 요청합니다.
반면 201 응답에서는 주소를 알려 줄 뿐이고, 그 주소로 다시 요청할지는 클라이언트가 정합니다.

여기서 말하는 위치는 **URI**입니다. 서버가 자원을 어디에 어떻게 저장했는지와는 관계가 없습니다.
자원이 DB 테이블의 한 행이든, 여러 테이블에 나뉘어 저장되었든, S3 같은 파일 저장소에 있든 `Location`에는 클라이언트가 그 자원을 찾아갈 URI 하나만 담깁니다.
예를 들어 주문 하나를 만들면서 `orders` 테이블에 한 행, `order_items` 테이블에 세 행이 생겼더라도 `Location`은 `/orders/42` 하나입니다.

201 응답에서 `Location`은 필수가 아닙니다. 이 헤더가 없으면 요청을 보낸 URI 자체를 새로 만들어진 자원으로 봅니다.
그래서 `PUT /files/a.png`처럼 클라이언트가 주소를 정해서 보내는 요청에서는 생략해도 됩니다.
반면 `POST /orders`처럼 서버가 새 자원의 ID를 정하는 경우에는 클라이언트가 그 주소를 알 수 없으니, `Location`을 넣어 주는 것이 좋습니다.

### **WWW-Authenticate**

`WWW-Authenticate`는 **자원에 접근하려면 어떤 방식으로 인증해야 하는지** 알려 주는 헤더로, `401 Unauthorized` 응답과 함께 씁니다.
앞에서 본 `Authorization`과 짝을 이룹니다. 서버가 `WWW-Authenticate`로 인증 방식을 알려 주면, 클라이언트는 그 방식에 맞춰 `Authorization`에 인증 정보를 담아 다시 요청합니다.

```
WWW-Authenticate: Basic
```

### **Content-Disposition**

파일 다운로드 기능을 만들 때 자주 쓰는 헤더가 `Content-Disposition`입니다.
이 헤더는 **응답 본문을 브라우저 화면에 보여 줄지, 파일로 내려받게 할지** 알려 줍니다.

```
Content-Disposition: inline
Content-Disposition: attachment; filename="report.pdf"
```

`inline`이면 브라우저가 본문을 화면에 바로 보여 주고, `attachment`이면 다운로드 창을 띄워 `filename`에 적힌 이름으로 저장합니다.

## **요청과 응답 모두에 쓰는 헤더**

클라이언트와 서버 양쪽에서 쓸 수 있는 헤더입니다.

### **Date**

`Date`는 **메시지가 만들어진 날짜와 시각**을 담습니다.

```
Date: Mon, 05 Feb 2024 12:00:00 GMT
```

요청과 응답 모두에 쓸 수 있지만 실제로는 대부분 서버가 응답에 담아 보냅니다.
시각은 항상 그리니치 표준시(GMT)로 적습니다. 4편에서 볼 캐시의 유효 기간을 계산할 때도 이 값을 씁니다.

### **Connection**

`Connection`은 **지금 쓰고 있는 연결을 어떻게 다룰지** 정하는 헤더입니다.

HTTP/1.1은 1편에서 본 것처럼 한 번 맺은 TCP 연결로 여러 요청과 응답을 주고받는 `지속 연결(keep-alive)`을 지원합니다.
`Connection`에는 주로 이 지속 연결과 관련된 값을 적습니다.

```
Connection: keep-alive
Connection: close
```

`keep-alive`는 연결을 계속 유지하고 싶다는 뜻이고, `close`는 이번 응답을 끝으로 연결을 닫겠다는 뜻입니다.
HTTP/1.1은 지속 연결이 기본이라서 실제로는 연결을 끊고 싶을 때 `Connection: close`를 보내는 경우가 더 많습니다.

`Connection: keep-alive`는 HTTP/1.0 시절에 쓰던 값입니다. 1.0 표준에는 지속 연결이 없었지만 많은 브라우저와 서버가 확장 기능으로 지원했고, 클라이언트와 서버가 이 값을 주고받아 지속 연결을 쓰기로 합의했습니다.

참고로 HTTP/2와 HTTP/3는 연결을 관리하는 방식이 달라서 `Connection` 헤더를 쓰지 않습니다.

### **Content-Length와 Transfer-Encoding**

`Content-Length`는 **메시지 본문의 크기를 바이트 단위로** 나타냅니다.
받는 쪽은 이 값을 보고 본문이 어디서 끝나는지 압니다.

```
Content-Length: 1024
```

글자 수가 아니라 바이트 수라는 점에 주의해야 합니다.
UTF-8에서 한글은 한 글자가 3바이트이므로 `안녕`이라는 본문의 `Content-Length`는 2가 아니라 6입니다.

본문 크기를 미리 알 수 없을 때도 있습니다. 데이터를 만들어 가면서 바로바로 보내는 경우가 그렇습니다.
이럴 때 HTTP/1.1에서는 `Content-Length` 대신 `Transfer-Encoding: chunked`를 써서 본문을 여러 조각(chunk)으로 나눠 보냅니다.
각 조각 앞에 그 조각의 크기를 16진수로 적고, 크기가 0인 조각으로 본문이 끝났음을 알립니다.

```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

7
Mozilla
9
Developer
0

```

### **표현 헤더: Content-Type, Content-Language, Content-Encoding**

같은 자원도 HTML, JSON처럼 여러 형태로 나타낼 수 있습니다. 이렇게 실제로 주고받는 자원의 형태를 `표현(Representation)`이라고 합니다.
`Content-Type`, `Content-Language`, `Content-Encoding`은 **메시지 본문이 어떤 표현인지** 설명하는 헤더라서 `표현 헤더(Representation Header)`라고 부릅니다.

#### **Content-Type**

`Content-Type`은 **본문의 미디어 타입**을 나타냅니다.
미디어 타입은 1편에서 본 대로 `타입/서브타입` 형태로 적고 필요하면 문자 인코딩 같은 추가 정보를 `;` 뒤에 붙입니다.

```
Content-Type: text/html; charset=UTF-8
Content-Type: application/json
```

자주 보는 미디어 타입은 다음과 같습니다.

| 미디어 타입                         | 쓰임                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `text/html`                         | HTML 문서                                            |
| `text/plain`                        | 일반 텍스트                                          |
| `application/json`                  | JSON 데이터. API에서 가장 많이 쓰는 형식             |
| `application/x-www-form-urlencoded` | HTML 폼의 기본 전송 형식 (`name=kim&age=20`)         |
| `multipart/form-data`               | 파일 업로드처럼 여러 종류의 데이터를 함께 보낼 때    |
| `image/png`, `image/jpeg`           | 이미지                                               |

요청을 보낼 때도 `Content-Type`은 중요합니다.
서버는 이 값을 보고 본문을 어떻게 읽을지 정하기 때문에, JSON을 보내면서 `Content-Type`을 빠뜨리거나 잘못 적으면 서버가 본문을 제대로 읽지 못합니다.
서버가 처리할 수 없는 미디어 타입이면 `415 Unsupported Media Type`으로 응답하기도 합니다.

#### **Content-Language**

`Content-Language`는 **본문에 쓰인 자연어**, 즉 사람이 쓰는 언어를 나타냅니다.

```
Content-Language: en
Content-Language: en-US
```

언어는 `언어 태그`로 적습니다. 언어 태그는 하이픈(`-`)으로 구분한 여러 서브태그로 이루어지는데, 보통은 두 번째 서브태그까지만 씁니다.

- **첫 번째 서브태그는 언어 코드**입니다. `ko`, `en`, `zh`, `ja`, `de`, `fr`처럼 특정 언어를 나타냅니다.
- **두 번째 서브태그로는 주로 국가 코드**를 씁니다. `KR`, `US`, `GB`, `CN`, `TW`, `JP`, `DE`, `FR`처럼 특정 국가를 나타냅니다.

두 코드를 조합하면 어느 나라에서 쓰는 어떤 언어인지 알 수 있습니다.
`ko-KR`은 한국에서 쓰는 한국어, `en-US`는 미국에서 쓰는 영어, `en-GB`는 영국에서 쓰는 영어입니다.

#### **Content-Encoding**

`Content-Encoding`에는 **본문을 압축하거나 변환한 방식**이 들어갑니다.

HTTP로 주고받는 데이터는 전송 속도를 높이려고 압축해서 보내는 경우가 많습니다.
보내는 쪽은 압축에 쓴 방식을 이 헤더에 적고, 받는 쪽은 이 값을 보고 압축을 풀어 원래 내용을 확인합니다.

```
Content-Encoding: gzip
```

대표적인 값으로 `gzip`, `deflate`, `br`(Brotli)이 있고 최근에는 `zstd`도 쓰입니다. `compress`라는 값도 있지만 지금은 거의 쓰지 않습니다.
본문을 압축했다면 `Content-Length`에는 압축한 뒤의 크기가 들어갑니다.

클라이언트가 어떤 압축 방식을 풀 수 있는지는 바로 다음에 볼 `Accept-Encoding` 헤더로 서버에 알려 줍니다.

## **콘텐츠 협상**

### **같은 URI, 다른 표현**

`콘텐츠 협상(Content Negotiation)`은 **같은 URI에 대해 클라이언트에게 가장 알맞은 표현을 골라 주는 방식**입니다.
같은 URI의 HTML 문서라도 영어로 요청하면 영어 페이지를, 한국어로 요청하면 한국어 페이지를 주는 식입니다.

이렇게 보면 `GET` 메서드의 의미도 조금 더 정확해집니다.
2편에서는 `GET`을 "자원을 조회하는 메서드"라고 했지만, 자원 하나에 여러 표현이 있을 수 있으니 클라이언트가 실제로 받는 것은 그중 하나입니다.
`GET`은 "**자원의 특정 표현**을 조회하는 메서드"라고 하는 편이 맞습니다.

### **Accept 계열 헤더**

클라이언트는 다음 헤더로 원하는 표현을 서버에 알립니다.

| 요청 헤더         | 알리는 것                    | 짝이 되는 응답 헤더        |
| ----------------- | ---------------------------- | -------------------------- |
| `Accept`          | 선호하는 미디어 타입         | `Content-Type`             |
| `Accept-Language` | 선호하는 언어                | `Content-Language`         |
| `Accept-Encoding` | 풀 수 있는 압축 방식         | `Content-Encoding`         |
| `Accept-Charset`  | 선호하는 문자 인코딩         | `Content-Type`의 `charset` |

이 중 `Accept-Charset`은 요즘 브라우저가 보내지 않습니다. 대부분 UTF-8을 쓰다 보니 굳이 협상할 필요가 없어졌기 때문입니다.

### **q 값으로 우선순위 매기기**

콘텐츠 협상에서는 **선호도에 우선순위를 매길 수 있습니다**.
예를 들어 "한국어를 가장 원하지만 영어도 괜찮다"고 요청하는 식입니다.

우선순위는 `q`(Quality Value) 값으로 나타냅니다.
0부터 1까지의 값을 쓰고 값이 클수록 우선순위가 높으며, 생략하면 1로 봅니다.

```
GET /index.html HTTP/1.1
Host: example.com
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
Accept: text/html,application/xml;q=0.9,text/plain;q=0.6,*/*;q=0.5
```

`Accept-Language`를 풀어 보면 다음과 같습니다.

1. `ko-KR` (q 생략 → 1): 한국에서 쓰는 한국어를 가장 원합니다.
2. `ko` (0.9): 그다음은 지역을 가리지 않는 한국어입니다.
3. `en-US` (0.8): 그다음은 미국 영어입니다.
4. `en` (0.7): 마지막으로 영어면 됩니다.

`Accept`도 읽는 방법은 같습니다. HTML을 가장 원하고 그다음은 XML, 일반 텍스트 순이며, `*/*`는 그 밖의 어떤 형식이든 괜찮다는 표시입니다.

서버는 자신이 줄 수 있는 표현 중에서 우선순위가 가장 높은 것을 골라 응답합니다.

### **Vary: 어떤 헤더를 보고 골랐는지 알려 주기**

콘텐츠 협상을 하는 서버는 응답에 `Vary` 헤더를 붙여 주는 것이 좋습니다.
`Vary`는 **어떤 요청 헤더에 따라 응답이 달라지는지** 알려 줍니다.

```
Vary: Accept-Language
```

이 헤더가 필요한 이유는 `캐시` 때문입니다.
캐시는 4편에서 자세히 다루겠지만, 한 번 받은 응답을 저장해 두었다가 같은 요청이 오면 서버를 거치지 않고 저장해 둔 응답을 돌려주는 기능입니다.
그런데 캐시는 기본적으로 **URI만 보고** 같은 요청인지 판단합니다.

`Vary`가 없으면 다음과 같은 일이 생길 수 있습니다.

1. 한국어 사용자가 `Accept-Language: ko`로 `/index.html`을 요청합니다. 서버는 한국어 페이지를 주고, 캐시는 이 응답을 저장합니다.
2. 영어 사용자가 `Accept-Language: en`으로 같은 `/index.html`을 요청합니다.
3. 캐시는 URI가 같으니 같은 요청이라고 보고, 저장해 둔 한국어 페이지를 돌려줍니다.

응답에 `Vary: Accept-Language`가 있으면 캐시는 URI와 함께 `Accept-Language` 값도 비교합니다.
`ko` 요청과 `en` 요청을 서로 다른 요청으로 보고 응답을 따로 저장하므로, 영어 사용자는 서버에서 영어 페이지를 새로 받습니다.

![Vary가 없으면 캐시가 URI만 비교해 영어 사용자에게 저장된 한국어 페이지를 돌려주고, Vary: Accept-Language가 있으면 URI와 Accept-Language 값을 함께 비교해 서버에서 영어 페이지를 받아 따로 저장하는 과정을 비교한 그림](/assets/images/posts/http-vary-cache.png){: w="3840" h="2160" }
_Vary 유무에 따라 캐시가 요청을 구분하는 방식_

같은 이유로 `Vary: Accept-Encoding`도 흔히 붙습니다.
압축을 풀 수 있는 클라이언트에는 `gzip`으로 압축한 응답을, 풀 수 없는 클라이언트에는 압축하지 않은 응답을 줘야 하기 때문입니다.

## **정리하면**

- 헤더는 `이름: 값` 형태로 메시지의 부가 정보를 담습니다. 이름은 대소문자를 구분하지 않습니다.
- 요청 헤더로는 요청을 보낼 호스트(`Host`), 클라이언트 프로그램 정보(`User-Agent`), 직전 페이지(`Referer`), 인증 정보(`Authorization`)를 보냅니다.
- 응답 헤더로는 서버 소프트웨어(`Server`), 쓸 수 있는 메서드(`Allow`), 재시도 시점(`Retry-After`), 자원의 위치(`Location`), 인증 방식(`WWW-Authenticate`), 다운로드 여부(`Content-Disposition`)를 알려 줍니다.
- 요청과 응답 모두에 쓰는 헤더로는 생성 시각(`Date`), 연결 유지 여부(`Connection`), 본문 크기(`Content-Length`, `Transfer-Encoding`)가 있습니다.
- 표현 헤더(`Content-Type`, `Content-Language`, `Content-Encoding`)는 본문을 어떻게 해석할지 알려 줍니다.
- 콘텐츠 협상은 `Accept` 계열 헤더와 `q` 값으로 원하는 표현을 고르고, 서버는 `Vary`로 어떤 헤더를 보고 골랐는지 알려 줍니다.

다음 편에서는 캐시, 쿠키와 세션, 그리고 CORS·프록시·보안 관련 헤더를 이어서 정리해 보겠습니다.
