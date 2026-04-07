# Kanguk Log

GitHub Pages와 Jekyll로 만든 개인 개발 블로그입니다. 기본 Jekyll 테마 대신, 읽기 경험과 첫인상을 강화한 커스텀 레이아웃과 스타일을 직접 구성했습니다.

## 특징

- GitHub Pages 호환 Jekyll 설정
- 반응형 홈 화면과 포스트 템플릿
- 깔끔한 아카이브, 소개 페이지, 404 페이지
- GitHub Actions 기반 Pages 배포 워크플로

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://127.0.0.1:4000`을 열면 됩니다.

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소로 올립니다.
2. 저장소 이름을 `iamkanguk97.github.io`로 사용하면 사용자 사이트로 바로 배포할 수 있습니다.
3. 다른 저장소 이름을 쓰는 경우에도 `.github/workflows/pages.yml`이 있으므로 GitHub Pages 소스를 `GitHub Actions`로 설정하면 배포할 수 있습니다.

## 구조

```text
.
├── _config.yml
├── _includes
├── _layouts
├── _posts
├── assets/css/style.scss
├── about.md
├── archive.html
└── .github/workflows/pages.yml
```

