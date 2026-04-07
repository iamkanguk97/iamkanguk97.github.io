# 욱이로그

Chirpy 테마를 적용한 GitHub Pages 기반 개인 개발 블로그입니다.

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

## Chirpy 전환 후 핵심 구조

```text
.
├── _config.yml
├── _data
├── _drafts
├── _plugins
├── _posts
├── _tabs
├── assets/images/profile-avatar.svg
├── bin/new-post
└── .github/workflows/pages-deploy.yml
```

## 프로필 사진 변경

현재 사이드바 아바타는 `assets/images/profile-avatar.svg`를 사용합니다.

실제 사진으로 바꾸려면:

1. 원하는 이미지를 저장소에 넣습니다.
2. `_config.yml`의 `avatar` 값을 그 경로로 바꿉니다.

## 배포

Chirpy는 GitHub Actions 기반 배포 구성을 사용합니다. 저장소의 GitHub Pages Source도 `GitHub Actions`로 맞추는 편이 안전합니다.

