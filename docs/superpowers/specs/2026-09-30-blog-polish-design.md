# 블로그 다듬기 설계 (jeonje.github.io 참고)

- 작성일: 2026-09-30
- 상태: 승인 대기
- 참고 사이트: https://jeonje.github.io (Jekyll + Chirpy v7.6.0, 저장소 `JeonJe/JeonJe.github.io` 공개)

## 1. 목표

기존 `iamkanguk97.github.io`(Chirpy `~> 7.5`, giscus, 글 10개)를 유지한 채, 참고 블로그가 얹은
커스텀 요소를 **내 블로그에 맞게 줄여서** 이식한다. 참고 블로그를 그대로 복제하는 것이 목표가
아니다(사용자 확인: "너무 똑같이 할 필요는 없습니다").

성공 기준:

- 아래 2~5 항목이 각각 별도 PR로 `main`에 병합되고, GitHub Actions 배포가 성공한다.
- 각 PR은 로컬 `bundle exec jekyll build`가 경고 없이 끝나고, 로컬 서버 화면 캡처로 확인한다.
- 기존 글 10개의 내용·URL, giscus 설정, 사이드바 메뉴 순서는 변하지 않는다.

## 2. 현재 상태 (조사로 확인한 사실)

| 항목 | 참고 블로그 | 내 블로그 |
|---|---|---|
| 테마 | Chirpy 7.6.0 | Chirpy ~> 7.5 (같은 계열) |
| 날짜 표기 | `2026년 09월 24일` (`_data/locales` 오버라이드) | `2026/04/07` (Chirpy ko-KR 기본값) |
| 프로필 사진 | 실제 사진 | `assets/images/profile-avatar.svg` placeholder |
| Recently Updated 패널 | 표시 | `_includes/update-list.html`을 빈 파일로 덮어 **의도적으로 숨김** |
| 글 썸네일 | `image` front matter 사용 | `_layouts/home.html`이 이미 `post.image`를 지원, 글 3개에 SVG 썸네일 |
| 시리즈 패널 | `_data/series.yml` + `_includes/series/navigation.html` + `series.css` | 없음 |
| About | `_data/about.yml` + 타임라인 CSS 282줄 | 일반 마크다운 |
| Categories | 통계 3칸 + d3-cloud 워드클라우드 + 기본 목록 (레이아웃 295줄) | Chirpy 기본 |
| 글 생성 스크립트 | 없음 | `bin/new-post` (front matter 템플릿 내장) |
| 배포 | GitHub Actions | `pages-deploy.yml`, Ruby 3.4, `fetch-depth: 0` |

로컬 환경: macOS 기본 Ruby 2.6뿐이라 로컬 미리보기 불가. Homebrew 있음, rbenv/mise 없음.

## 3. 작업 환경 (선행 작업, PR 없음)

1. `brew install ruby` 후 zsh PATH에 `$(brew --prefix ruby)/bin` 추가. (사용자 승인: Homebrew ruby)
2. 저장소는 `~/workspace/iamkanguk97.github.io`에 clone 완료. `git submodule update --init`(assets/lib).
3. `bundle install` → `bundle exec jekyll serve`로 http://127.0.0.1:4000 미리보기.
4. 브랜치: `main`만 존재하므로 `feature/<topic>` → `main` PR, squash merge. push/PR 생성은 매번 사용자 확인.

## 4. 항목별 설계

### 4.1 기본 다듬기 — 브랜치 `feature/basic-polish`

커스텀 코드 없이 설정·양식만 바꾼다.

- **한글 날짜**: `_data/locales/ko-KR.yml`을 추가해 Chirpy 기본 ko-KR 로케일을 통째로 복사한 뒤
  `df.post`만 `%Y년 %m월 %d일` / `YYYY년 MM월 DD일`로 바꾼다. (Jekyll의 `_data`는 파일 단위
  오버라이드라 부분 오버라이드가 불가능하므로 전체 복사가 필요하다.)
- **프로필 사진 자리**: `_config.yml`의 `avatar`를 `/assets/images/avatar.jpg`로 바꾸고, 현재
  placeholder SVG를 그 이름의 정사각형 이미지로 변환해 둔다. 사용자는 나중에 파일만 덮어쓴다.
  README의 "프로필 사진 변경" 절을 새 경로로 갱신한다.
- **Recently Updated 복구**: `_includes/update-list.html` 오버라이드 파일을 삭제해 테마 기본 동작으로
  되돌린다. 테마 기본 include는 `last_modified_at`이 없으면 `date`로 대체하므로 글을 수정하지 않아도
  최근 글 5개가 표시된다. 이전에 의도적으로 숨긴 이력이 있으므로 PR 본문에 명시한다.
- **글 양식**: 별도 템플릿 파일 대신 기존 `bin/new-post`의 front matter를 확장한다.
  `description`(카드·검색용 요약, Chirpy 표준 키), `image: { path, alt }`(썸네일, 주석 처리된 예시),
  본문 첫 섹션에 `## TL;DR` 3줄 골격을 추가한다. 기존 `excerpt` 키는 Chirpy가 쓰지 않으므로
  `description`으로 바꾼다(기존 글은 건드리지 않는다).

### 4.2 시리즈 네비게이션 — 브랜치 `feature/post-series`

- **데이터**: `_data/series.yml` — 시리즈 id를 키로 `name`, `description`.
  글 front matter: `series: <id>`, `series_order: <정수>`.
- **include**: `_includes/panel/series.html`. `page.series`가 있고 같은 시리즈 글이 **2개 이상**일 때만
  렌더링. 목록은 `series_order` 오름차순, 현재 글은 링크 없이 강조. 각 항목에 번호·제목·날짜.
- **레이아웃**: `_layouts/post.html`의 `panel_includes`를 `[panel/series, toc]`로 바꿔 목차 위에 둔다.
- **스타일**: `assets/css/series.css`(약 60~80줄). Chirpy CSS 변수(`--card-bg`, `--link-color`,
  `--text-muted-color`)만 사용해 다크/라이트 모두 대응. `_includes/head.html` 오버라이드가 이미 있으므로
  거기서 `page.series`가 있을 때만 링크한다.
- **초기 데이터**: 묶을 글이 없으므로 `series.yml`은 주석으로 형식 예시만 두고 빈 상태로 시작.
  `bin/new-post`에는 `# series:` / `# series_order:` 주석 두 줄만 추가.

### 4.3 About 타임라인 — 브랜치 `feature/about-timeline`

참고 블로그와 달리 **글 목록은 자동 생성**한다(연도별 `site.posts`). 손으로 쓰는 것은 소개글과
연도별 주제·이야기·키워드뿐이다. 글을 쓸 때마다 about 데이터를 고치는 중복을 없애기 위한 결정.

- **데이터**: `_data/about.yml`
  ```yaml
  intro: "..."
  timeline:
    title: "Timeline"
    years:
      - year: "2026"
        theme: "..."
        story: "..."
        keywords: ["...", "..."]
  ```
  `years`에 없는 연도의 글은 주제·이야기 없이 글 목록만 표시한다(글이 있는데 항목이 빠져 사라지는
  일을 막기 위해).
- **include**: `_includes/about-timeline.html` — `site.posts`를 `date | date: "%Y"`로 그룹화하고,
  각 연도 블록에 헤더(연도·주제) → 이야기 → 키워드 칩 → 글 목록(월, 제목, `description`).
- **탭**: `_tabs/about.md`는 `site.data.about.intro` + include 호출만 남긴다.
- **스타일**: `assets/css/about-timeline.css`(약 120줄). 세로 선 + 연도 마커, 다크/라이트 대응.
  `head.html`에서 `page.title == "About"`일 때만 링크.
- **초기 내용**: `intro`와 2026년 항목은 현재 About 문구를 옮겨 placeholder로 채운다. 실제 문장은
  사용자가 직접 다듬는다.

### 4.4 Categories 통계 + 워드클라우드 — 브랜치 `feature/categories-dashboard`

- **레이아웃**: `_layouts/categories.html` 오버라이드. 구조는 위에서부터
  1. 통계 3칸: 전체 글 수 / 카테고리 수 / 최다 카테고리(이름 + 글 수)
  2. 워드클라우드 컨테이너
  3. Chirpy 기본 카테고리 목록(테마 원본 레이아웃 내용을 그대로 포함)
- **워드클라우드**: d3 v7 + d3-cloud 1.2.7을 jsDelivr CDN에서 `defer` 로드(외부 스크립트 2개 추가,
  사용자 승인). 데이터는 `<script type="application/json">`에 카테고리명·글 수를 Liquid로 출력하고,
  `assets/js/category-cloud.js`가 읽어 그린다. 글자 크기는 로그 스케일, 색상은 다크/라이트 모두에서
  대비가 충분한 고정 팔레트 8색, 클릭 시 해당 카테고리 페이지로 이동. 카테고리가 3개 미만이면
  워드클라우드 영역을 숨긴다.
- **스타일**: `assets/css/categories-dashboard.css`(약 50줄).
- **주의**: Chirpy의 PWA 캐시가 새 JS를 가릴 수 있으므로 `pwa-reset.js`가 있는 현 구조를 유지한다.

## 5. 검증

각 PR 공통:

1. `bundle exec jekyll build` 종료 코드 0, 출력에 `Warning`/`Error` 없음.
2. `bundle exec jekyll serve` 후 헤드리스 Chrome으로 해당 페이지 캡처, 참고 블로그 캡처와 나란히 비교.
3. 다크/라이트 모드 각각 캡처.
4. 병합 후 Actions 성공 및 https://iamkanguk97.github.io 반영 확인.

항목별 추가 확인:

- 4.1: 홈 카드 날짜가 `YYYY년 MM월 DD일`, 우측 패널에 Recently Updated 5개, `./bin/new-post --dry-run` 출력에 새 front matter.
- 4.2: 테스트용 초안 2개에 같은 `series`를 넣고 `--drafts`로 띄워 패널이 보이는지, 초안 1개만 있을 때는 안 보이는지.
- 4.3: About에 연도 블록이 글 수만큼 생기고, `about.yml`에 없는 연도도 목록이 나오는지.
- 4.4: 통계 숫자가 실제 글/카테고리 수와 일치, 워드클라우드 단어 클릭 시 카테고리 페이지 이동.

## 6. 범위 밖

- 기존 글 10개의 내용, 영문 카테고리명, 날짜.
- giscus, 사이드바 메뉴 순서, 푸터 문구.
- 실제 프로필 사진 파일, About의 실제 문장, 시리즈 실제 데이터 — 사용자가 채운다.

## 7. 위험과 대응

- **테마 업그레이드 충돌**: `_layouts/categories.html` 오버라이드는 테마 원본을 복사해 확장하므로
  테마 버전이 오르면 원본 변경을 놓칠 수 있다. 파일 상단 주석에 기준 버전(7.6.0)을 적어 둔다.
- **외부 CDN 의존**: d3 로드 실패 시 워드클라우드만 빈 채로 두고 나머지 페이지는 정상 동작하도록
  JS에서 존재 여부를 확인한다.
- **로케일 전체 복사**: 테마의 ko-KR 문구가 바뀌어도 반영되지 않는다. 날짜 형식 외에는 손대지 않고
  기준 버전을 주석으로 남긴다.
