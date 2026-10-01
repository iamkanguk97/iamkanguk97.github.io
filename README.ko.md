# 욱개로그

[English](./README.md) | 한국어

Chirpy 테마를 사용한 GitHub Pages 기반 개인 블로그입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve            # 초안 포함: --drafts
```

## 글 작성

```bash
./bin/new-post "글 제목" optional-slug
./bin/new-post --draft "초안 제목" optional-slug
```

- 일반 글: `_posts/YYYY-MM-DD-slug.md`
- 초안: `_drafts/slug.md`

### front matter 키

- `description`: 카드, 검색 결과, meta description에 쓰이는 한 줄 요약. 빈 값(`""`)으로 두면 카드가 비므로, 쓰지 않을 때는 키를 지웁니다.
- `image.path` / `image.alt`: 글 상단과 카드에 나오는 썸네일
- `series` / `series_order`: 같은 시리즈 글 묶기

## 시리즈

`_data/series.yml`에 시리즈를 등록하고, 글 front matter에 `series`와 `series_order`를 적습니다. 같은 시리즈 글이 2개 이상일 때만 글 오른쪽에 목록이 나타납니다.

```yaml
# _data/series.yml
nestjs-ecommerce:
  name: "NestJS로 이커머스 만들기"
  description: "설계부터 배포까지"
```

## 배포

`main`에 푸시하면 `.github/workflows/pages-deploy.yml`이 GitHub Actions로 배포합니다. 저장소의 Pages Source는 `GitHub Actions`로 맞춰 두어야 합니다.
