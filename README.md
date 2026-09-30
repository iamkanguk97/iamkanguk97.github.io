# Jason

Chirpy 테마를 적용한 GitHub Pages 기반 개인 블로그입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

초안까지 보려면:

```bash
bundle exec jekyll serve --drafts
```

## 글 작성

직접 Markdown 파일을 만들어도 되고, 스크립트를 써도 됩니다.

```bash
./bin/new-post "GitHub Pages로 블로그 시작하기" github-pages-blog
./bin/new-post --draft "Jekyll 메모 정리" jekyll-notes
```

- 일반 글: `_posts/YYYY-MM-DD-slug.md`
- 초안: `_drafts/slug.md`

### front matter 키

- `description`: 카드와 검색 결과에 보이는 한 줄 요약. 비워두면 본문 첫 문단이 쓰입니다.
- `image.path` / `image.alt`: 글 상단과 카드 오른쪽에 나오는 썸네일. 주석을 풀고 경로를 채웁니다.
- `series` / `series_order`: 같은 시리즈 글을 묶습니다. 자세한 내용은 아래 "시리즈" 절.

## Chirpy 전환 후 핵심 구조

```text
.
├── _config.yml
├── _data
├── _drafts
├── _plugins
├── _posts
├── _tabs
├── assets/images/avatar.png
├── bin/new-post
└── .github/workflows/pages-deploy.yml
```

## 프로필 사진 변경

사이드바 아바타는 `assets/images/avatar.png`입니다. 지금 들어 있는 것은 자리만 잡아둔 기본 이미지입니다.

실제 사진으로 바꾸려면 정사각형(권장 448×448 이상) PNG를 같은 이름으로 덮어쓰기만 하면 됩니다.
JPG를 쓰고 싶으면 파일을 `assets/images/avatar.jpg`로 넣고 `_config.yml`의 `avatar` 값을 그 경로로 바꿉니다.

## 배포

Chirpy는 GitHub Actions 기반 배포 구성을 사용합니다. 저장소의 GitHub Pages Source도 `GitHub Actions`로 맞추는 편이 안전합니다.
