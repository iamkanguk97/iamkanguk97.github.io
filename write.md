---
title: Write
permalink: /write/
description: 욱이로그에 새 글과 초안을 만드는 방법
---

욱이로그는 GitHub Pages와 Jekyll 기반이라 웹 관리자 화면에서 직접 글을 쓰는 방식이 아니라, 저장소 안에서 마크다운 글을 만들고 커밋하는 흐름으로 운영합니다.

## 새 글 만들기

```bash
./bin/new-post "GitHub Pages로 블로그 시작하기" github-pages-blog
```

- 첫 번째 인자: 글 제목
- 두 번째 인자: 파일명에 들어갈 slug
- 생성 위치: `_posts/YYYY-MM-DD-slug.md`

## 초안 만들기

```bash
./bin/new-post --draft "Jekyll 메모 정리" jekyll-notes
```

- 생성 위치: `_drafts/slug.md`
- 초안은 로컬에서 `bundle exec jekyll serve --drafts`로 확인할 수 있습니다.

## 미리 보기만 하기

```bash
./bin/new-post --dry-run "새 글 테스트" sample-post
```

파일은 만들지 않고 어떤 경로와 내용으로 생성될지만 보여줍니다.

## 작성 후 흐름

1. 생성된 파일 내용을 수정합니다.
2. 로컬에서 미리 봅니다.
3. `git add`, `git commit`, `git push`로 배포합니다.

## 참고

한글 제목처럼 slug를 자동 생성하기 어려운 경우가 있으니, 두 번째 인자는 짧고 읽기 쉬운 영문 slug로 넣는 편이 좋습니다.

