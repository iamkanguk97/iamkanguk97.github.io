# 욱이로그

GitHub Pages와 Jekyll로 만든 개인 개발 블로그입니다. 기본 Jekyll 테마 대신, 읽기 경험과 첫인상을 강화한 커스텀 레이아웃과 스타일을 직접 구성했습니다.

## 특징

- GitHub Pages 호환 Jekyll 설정
- 프로필 카드와 교체 가능한 아바타 지원
- 반응형 홈 화면과 포스트 템플릿
- 태그별 글 탐색 페이지
- 깔끔한 아카이브, 소개 페이지, 404 페이지
- 새 글과 초안을 빠르게 만드는 `bin/new-post` 작성 스크립트
- GitHub Actions 기반 Pages 배포 워크플로

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://127.0.0.1:4000`을 열면 됩니다.

## 글 작성

```bash
./bin/new-post "GitHub Pages로 블로그 시작하기" github-pages-blog
./bin/new-post --draft "Jekyll 메모 정리" jekyll-notes
```

- 일반 글은 `_posts`에 생성됩니다.
- 초안은 `_drafts`에 생성됩니다.
- 초안까지 보려면 `bundle exec jekyll serve --drafts`를 사용하면 됩니다.

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 올립니다.
2. 저장소 이름을 `iamkanguk97.github.io`로 사용하면 사용자 사이트로 바로 배포할 수 있습니다.
3. 다른 저장소 이름을 쓰는 경우에도 `.github/workflows/pages.yml`이 있으므로 GitHub Pages 소스를 `GitHub Actions`로 설정하면 배포할 수 있습니다.

## 구조

```text
.
├── _config.yml
├── _drafts
├── _includes
├── _layouts
├── _posts
├── bin/new-post
├── assets/css/style.scss
├── about.md
├── archive.html
├── tags.html
└── .github/workflows/pages.yml
```
